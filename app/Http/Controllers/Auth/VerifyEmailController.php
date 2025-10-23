<?php
// app/Http/Controllers/Auth/VerifyEmailController.php
namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\Verified;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class VerifyEmailController extends Controller
{
    public function __invoke(Request $request)
    {
        $user = User::findOrFail($request->route('id'));

        // Validate the hash from the URL matches the user's current email
        $valid = hash_equals(
            (string) $request->route('hash'),
            sha1($user->getEmailForVerification())
        );
        if (! $valid) {
            abort(403, 'Invalid verification link.');
        }

        if (!$user->hasVerifiedEmail()) {
            $user->markEmailAsVerified();
            event(new Verified($user));
        }

        // Optional: log them in so they land on dashboard verified
        Auth::login($user);

        return redirect()->route('dashboard')->with('verified', 1);
    }
}
