<?php

namespace App\Http\Controllers;
use Illuminate\Support\Facades\Schema;
use App\Models\Community;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;

class CommunityController extends Controller
{
    // List communities the current user belongs to (accepted)
    public function index(): Response
    {
        $authId = Auth::id();

        $communities = Auth::user()
            ->communities()
            ->wherePivot('status', 'accepted')
            ->with([
                // owner basic info
                'owner:id,name,email',

                // accepted members (id, name, email)
                'users' => function ($q) {
                    $q->select('users.id', 'users.name', 'users.email')
                    ->where('community_user.status', 'accepted');
                },
            ])
            ->withCount(['users as members_count' => function ($q) {
                $q->where('community_user.status', 'accepted');
            }])
            ->orderBy('communities.name', 'asc')
            ->get(['communities.id', 'communities.name', 'communities.owner_id']);

        // Flatten to the exact shape your Vue/React expects
        $payload = $communities->map(function ($c) use ($authId) {
            return [
                'id'            => $c->id,
                'name'          => $c->name,
                'owner_id'      => $c->owner_id,
                'is_owner'      => $c->owner_id === $authId,     // helpful on the client
                'members_count' => $c->members_count ?? 0,
                'owner'         => $c->owner ? [
                                    'id'    => $c->owner->id,
                                    'name'  => $c->owner->name,
                                    'email' => $c->owner->email,
                                ] : null,
                'members'       => $c->users->map(fn ($u) => [
                                    'id'    => $u->id,
                                    'name'  => $u->name,
                                    'email' => $u->email,
                                ])->values(),
            ];
        });

        return Inertia::render('Communities/Index', [
            'communities' => $payload,
        ]);
    }
    // Show "Create Community" form
    public function create(): Response
    {
        return Inertia::render('Communities/Create');
    }

    // Handle form submit - create community and attach owner as accepted member
    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'name' => ['required','string','max:255'],
        ]);
        

        $community = Community::create([
            'name' => $data['name'],
            'owner_id' => Auth::id(),
        ]);

        // owner becomes a member (Owner role, accepted)
        $community->users()->attach(Auth::id(), [
            'role' => 'Owner',
            'status' => 'accepted',
        ]);

        return redirect()->route('communities.index')
            ->with('success', 'Community created.');
    }

    // Owner invites a user to this community (status: pending)
    public function invite(Request $request, Community $community): RedirectResponse
    {
        // Only the owner can invite
        if ($community->owner_id !== Auth::id()) {
            abort(403, 'Only the owner can invite members.');
        }

        $data = $request->validate([
            'user_identifier' => ['required','string'], // email or name (your choice)
            'role' => ['nullable','string','max:255'],
        ]);

        // For simplicity, search by email. You can change to username, etc.
        $user = User::where('email', $data['user_identifier'])->first();
        if (!$user) {
            return back()->with('error', 'User not found.');
        }

        $existing = $community->users()->where('users.id', $user->id)->first();
        if ($existing?->pivot->status === 'accepted') {
            return back()->with('error', 'User is already a member.');
        }
        if ($existing?->pivot->status === 'pending') {
            return back()->with('error', 'User already has a pending invite.');
        }

        // Attach or update pivot to 'pending'
        $community->users()->syncWithoutDetaching([
            $user->id => [
                'role' => $data['role'] ?? null,
                'status' => 'pending',
            ],
        ]);

        return back()->with('success', 'Invitation sent.');
    }

    // Invited user accepts or rejects
    public function respond(Request $request, Community $community, User $user): RedirectResponse
    {
        // Only the invited user can respond
        if ($user->id !== Auth::id()) {
            abort(403, 'You can only respond to your own invitations.');
        }

        $data = $request->validate([
            'action' => ['required','in:accept,reject'],
        ]);

        // Ensure a membership row exists
        $exists = $community->users()
            ->where('users.id', $user->id)
            ->exists();

        if (!$exists) {
            return back()->with('error', 'Invitation not found.');
        }

        $newStatus = $data['action'] === 'accept' ? 'accepted' : 'rejected';

        // Update pivot (status only)
        $community->users()->updateExistingPivot($user->id, [
            'status' => $newStatus,
        ]);

        return back()->with('success', "Invitation {$newStatus}.");
    }

    // Owner removes a member
// app/Http/Controllers/CommunityController.php

    public function remove(Community $community, User $user): RedirectResponse
    {
        $actorId = Auth::id();
        $isOwner = ($community->owner_id === $actorId);
        $isSelf  = ($actorId === $user->id);

        // Only owner can remove other people; any member may remove themselves (leave)
        if (! $isOwner && ! $isSelf) {
            abort(403, 'Only the owner can remove other members.');
        }

        // Prevent removing the owner via this endpoint
        if ($user->id === $community->owner_id) {
            return back()->with('error', 'Owner cannot be removed.');
        }

        // Ensure the membership exists (optional safety)
        $exists = $community->users()->where('users.id', $user->id)->exists();
        if (! $exists) {
            return back()->with('error', 'Membership not found.');
        }

        $community->users()->detach($user->id);

        return back()->with('success', $isSelf ? 'You left the community.' : 'Member removed.');
    }

    public function destroy(Community $community): RedirectResponse
    {
        if ($community->owner_id !== Auth::id()) {
            abort(403, 'Only the owner can delete this community.');
        }

        // If you have child records, ensure FKs are cascading or handle deletes here.
        // Detach all members from pivot first (safe & clean)
        $community->users()->detach();

        // Delete the community
        $community->delete();

        return redirect()
            ->route('communities.index')
            ->with('success', 'Community deleted.');
    }

    
    // Current user's pending invitations
    // public function invitations(): \Inertia\Response
    // {
    //     $user = \Illuminate\Support\Facades\Auth::user();

    //     // Safety: if somehow accessed without auth middleware
    //     if (!$user) {
    //         abort(403);
    //     }

    //     $pending = $user->communities()
    //         ->wherePivot('status','pending')
    //         ->with('owner:id,name,email') // so c.owner?.name works
    //         ->get([
    //             'communities.id',
    //             'communities.name',
    //             'communities.owner_id',
    //             'communities.created_at',
    //         ])
    //         ->map(function ($c) {
    //             return [
    //                 'id'         => $c->id,
    //                 'name'       => $c->name,
    //                 'created_at' => $c->created_at,          // used by new Date(...)
    //                 'role'       => $c->pivot->role,         // your UI shows role
    //                 'owner'      => $c->owner ? [
    //                     'id'    => $c->owner->id,
    //                     'name'  => $c->owner->name,
    //                     'email' => $c->owner->email,
    //                 ] : null,
    //             ];
    //         });

    //     return \Inertia\Inertia::render('Invitations/Index', [
    //         'pending' => $pending,
    //     ]);
    // }

}
