<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $user = $request->user();
        return [
            ...parent::share($request),
            'auth' => [
                'user' => $request->user(),
            ],
            'invites' => [
                'pendingCount' => $user
                ? $user->communities()->wherePivot('status','pending')->count()
                : 0,
            ],
            'me' => $request->user()
            ? ['id' => $request->user()->id, 'name' => $request->user()->name]
            : null,

            'flash' => [
                'success' => session('success'),
                'error'   => session('error'),
            ],
        ];
    }
}
