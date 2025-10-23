<?php

namespace App\Http\Controllers;

use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    public function read(Request $request, string $id): RedirectResponse
    {
        $notification = $request->user()->notifications()->findOrFail($id);
        $notification->markAsRead();

        // If the payload has a URL, go there. Otherwise back.
        $url = $notification->data['url'] ?? null;
        return $url ? redirect($url) : back();
    }

    // Optional: list page if you ever want a full page
    public function index(Request $request)
    {
        return inertia('Notifications/Index', [
            'unread' => $request->user()->unreadNotifications()->latest()->get(),
            'read'   => $request->user()->readNotifications()->latest()->limit(20)->get(),
        ]);
    }
}
