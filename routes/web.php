<?php

use App\Http\Controllers\ProjectController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\IssueController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\CommunityController;



Route::middleware(['auth', 'verified'])
    ->get('/dashboard', DashboardController::class)
    ->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

Route::middleware(['auth'])->get('/projects',[
    ProjectController::class, 'index'
])->name('projects.index');
Route::middleware(['auth'])->get('/projects/create', [
    ProjectController::class, 'create'])
    ->name('projects.create');
Route::middleware('auth')->post('/projects', [
    ProjectController::class, 'store'
])->name('projects.store');
Route::middleware(['auth'])->get('/projects/{project}', [
    ProjectController::class, 'show'
])->name('projects.show');
Route::middleware(['auth'])->get('/projects/{project}/issues', [
    IssueController::class, 'index'
])->name('projects.issues.index');
Route::middleware('auth')->post('/projects/{project}/issues', [
    IssueController::class, 'store'
    ])->name('projects.issues.index');
Route::middleware('auth')->patch('/projects/{project}', [
    ProjectController::class, 'update'])
    ->name('projects.update');
Route::middleware('auth')->patch('/projects/{project}/issues/{issue}', [
    IssueController::class, 'update'])
    ->name('projects.issues.update');
Route::middleware('auth')->get('/projects/{project}/issues/{issue}', [
    IssueController::class, 'show'])
    ->name('projects.issues.show');
Route::middleware('auth')->delete('/projects/{project}/issues/{issue}', [
    IssueController::class, 'destroy'])
    ->name('projects.issues.destroy');


Route::middleware(['auth'])->group(function () {
    Route::get('/communities', [CommunityController::class, 'index'])->name('communities.index');
    Route::get('/communities/create', [CommunityController::class, 'create'])->name('communities.create');
    Route::post('/communities', [CommunityController::class, 'store'])->name('communities.store');
});

Route::post('/communities/{community}/invite', [CommunityController::class, 'invite'])->name('communities.invite');
Route::patch('/communities/{community}/members/{user}', [CommunityController::class, 'respond'])->name('communities.members.respond');
Route::delete('/communities/{community}/members/{user}', [CommunityController::class, 'remove'])->name('communities.members.remove');
Route::get('/invitations',[CommunityController::class, 'invitations'])->name('invitations.index');

require __DIR__.'/auth.php';
