<?php

namespace App\Http\Controllers;

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
        $communities = Auth::user()
            ->communities()
            ->wherePivot('status', 'accepted')
            ->get(['communities.id','communities.name','communities.owner_id']);

        return Inertia::render('Communities/Index', [
            'communities' => $communities,
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
    public function remove(Community $community, User $user): RedirectResponse
    {
        // Only owner can remove
        if ($community->owner_id !== Auth::id()) {
            abort(403, 'Only the owner can remove members.');
        }

        // Don’t allow removing oneself as owner here (optional)
        if ($user->id === $community->owner_id) {
            return back()->with('error', 'Owner cannot be removed.');
        }

        $community->users()->detach($user->id);

        return back()->with('success', 'Member removed.');
    }

    // Current user's pending invitations
    public function invitations(): Response
    {
        $user = Auth::user();

        $pending = $user->communities()
            ->wherePivot('status','pending')
            ->get(['communities.id','communities.name','communities.owner_id']);

        return Inertia::render('Invitations/Index', [
            'pending' => $pending,
        ]);
    }
}
