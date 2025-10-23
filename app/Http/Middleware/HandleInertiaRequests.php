<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Schema;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    protected $rootView = 'app';

    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    public function share(Request $request): array
    {
        $user = $request->user();

        // Defaults so first-run / auth pages don't break
        $pendingCount = 0;
        $inviteList   = [];

        // Invites (only if tables exist and user is logged in)
        if (
            $user &&
            Schema::hasTable('communities') &&
            Schema::hasTable('community_user')
        ) {
            $pendingCount = $user->communities()
                ->wherePivot('status', 'pending')
                ->count();

            $inviteList = $user->communities()
                ->wherePivot('status', 'pending')
                ->with('owner:id,name,email')
                ->select('communities.id','communities.name','communities.owner_id','communities.created_at')
                ->orderBy('communities.name', 'asc')
                ->limit(10)
                ->get()
                ->map(function ($c) {
                    return [
                        'id'         => $c->id,
                        'name'       => $c->name,
                        'created_at' => $c->created_at,
                        'role'       => $c->pivot->role,
                        'owner'      => $c->owner ? [
                            'id'    => $c->owner->id,
                            'name'  => $c->owner->name,
                            'email' => $c->owner->email,
                        ] : null,
                    ];
                });
        }

        // Notifications (guarded by schema check)
        $notifications = ['unreadCount' => 0, 'list' => []];
        if ($user && Schema::hasTable('notifications')) {
            $notifications = [
                'unreadCount' => $user->unreadNotifications()->count(),
                'list' => $user->unreadNotifications()
                    ->latest()
                    ->limit(10)
                    ->get()
                    ->map(fn ($n) => [
                        'id'         => $n->id,
                        'message'    => $n->data['message'] ?? 'Notification',
                        'url'        => $n->data['url'] ?? null,
                        'created_at' => $n->created_at,
                    ]),
            ];
        }

        return [
            ...parent::share($request),

            'auth' => [
                'user' => $user,
            ],

            'invites' => [
                'pendingCount' => $pendingCount,
                'list'         => $inviteList,
            ],

            'notifications' => $notifications,

            'me' => $user ? [
                'id'   => $user->id,
                'name' => $user->name,
            ] : null,

            'flash' => [
                'success' => session('success'),
                'error'   => session('error'),
            ],
        ];
    }
}
