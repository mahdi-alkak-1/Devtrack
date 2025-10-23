<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Profile\UpdatePasswordRequest;
use App\Notifications\PasswordChanged;  
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Redirect;

class PasswordController extends Controller
{
    
    public function update(UpdatePasswordRequest $request)
    {
        $user = $request->user();
        $user->forceFill([
            'password' => Hash::make($request->validated()['password']),
        ])->save();

               // notify user by email (optional but recommended)
        if (method_exists($user, 'notify')) {
            $user->notify(new PasswordChanged());
        };

        return Redirect::route('profile.edit')->with('success', 'Password updated.');
    }
}
