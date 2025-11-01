<?php

use App\Http\Controllers\ProjectController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\IssueController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\CommunityController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\MyWorkController;
use App\Http\Controllers\Auth\PasswordController;
use Illuminate\Http\Request;


Route::get('/', function () {
    return Inertia::render('Landing');
})->name('landing');

Route::get('/docs', function () {
    return Inertia::render('Docs');     // resources/js/Pages/Docs.jsx
})->name('docs');

Route::get('/about', function () {
    return Inertia::render('About');    // resources/js/Pages/About.jsx
})->name('about');

Route::get('/features', fn () => Inertia::render('Features'))->name('features');

Route::get('/dashboard', function () {
    return auth()->check()
        ? redirect()->route('dashboard')
        : redirect()->route('login');
});

Route::fallback(function () {
    return redirect()->route('login');
});



Route::patch('/profile/password', [PasswordController::class, 'update'])
    ->name('profile.password.update');


Route::middleware(['auth', 'verified'])
    ->get('/dashboard', DashboardController::class)
    ->name('dashboard');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

Route::middleware(['auth', 'verified'])->get('/projects',[
    ProjectController::class, 'index'
])->name('projects.index');
Route::middleware(['auth', 'verified'])->get('/projects/create', [
    ProjectController::class, 'create'])
    ->name('projects.create');
Route::middleware(['auth', 'verified'])->post('/projects', [
    ProjectController::class, 'store'
])->name('projects.store');
Route::middleware(['auth', 'verified'])->get('/projects/{project}', [
    ProjectController::class, 'show'
])->name('projects.show');
Route::middleware(['auth', 'verified'])->delete('/projects/{project}', [
    ProjectController::class, 'destroy'
])->name('projects.destroy');

Route::middleware(['auth', 'verified'])->post('/projects/{project}/issues', [
    IssueController::class, 'store'
    ])->name('projects.issues.store');
Route::middleware(['auth', 'verified'])->patch('/projects/{project}', [
    ProjectController::class, 'update'])
    ->name('projects.update');
Route::middleware(['auth', 'verified'])->patch('/projects/{project}/issues/{issue}', [
    IssueController::class, 'update'])
    ->name('projects.issues.update');

Route::middleware(['auth', 'verified'])->delete('/projects/{project}/issues/{issue}', [
    IssueController::class, 'destroy'])
    ->name('projects.issues.destroy');


Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/communities', [CommunityController::class, 'index'])->name('communities.index');
    Route::get('/communities/create', [CommunityController::class, 'create'])->name('communities.create');
    Route::post('/communities', [CommunityController::class, 'store'])->name('communities.store');
});

Route::middleware(['auth', 'verified'])->group(function(){
    Route::post('/communities/{community}/invite', [CommunityController::class, 'invite'])->name('communities.invite');
    Route::patch('/communities/{community}/members/{user}', [CommunityController::class, 'respond'])->name('communities.members.respond');
    Route::delete('/communities/{community}/members/{user}', [CommunityController::class, 'remove'])->name('communities.members.remove');
    Route::delete('/communities/{community}', [\App\Http\Controllers\CommunityController::class, 'destroy'])
        ->name('communities.destroy');
    // Route::get('/invitations',[CommunityController::class, 'invitations'])->name('invitations.index');
    Route::redirect('/invitations', '/communities');
});





Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/notifications', [NotificationController::class, 'index'])->name('notifications.index'); // optional page
    Route::post('/notifications/{id}/read', [NotificationController::class, 'read'])->name('notifications.read');
}); 

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/my-work', [MyWorkController::class, 'index'])
        ->name('mywork.index');
});
require __DIR__.'/auth.php';
