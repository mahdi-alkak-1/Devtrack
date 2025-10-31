<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\Request;
use App\Models\Project;
use App\Models\Community;
use App\Http\Requests\StoreProjectRequest;
use Illuminate\Http\RedirectResponse;
use App\Http\Requests\UpdateProjectRequest;

class ProjectController extends Controller
{
    public function index(Request $request): Response
    {
        $projects = Project::where('owner_id', Auth::id())->get();

        return Inertia::render('Projects/Index', [
            'title'    => 'Your Projects',
            'projects' => $projects
        ]);
    }

    public function create(): Response
    {
        $userId = Auth::id();
        // Accepted communities owned by or joined by the user
        $myCommunities= Community::query()
        ->where('owner_id', $userId)
        ->orderBy('name')
        ->get(['id', 'name']);

        return Inertia::render('Projects/Create', [
            'title'        => 'Create Project',
            'communities'  => $myCommunities, // ← for <select>
        ]);
    }

    public function store(StoreProjectRequest $request): RedirectResponse
    {
        $userId = Auth::id();
        
        $data = $request->validate([
            'name'        => ['required', 'string', 'max:255'],
            'key'         => ['nullable', 'string', 'max:50'], // you removed unique
            'description' => ['nullable', 'string'],
            'community_id'=> ['nullable', 'integer'],
        ]);

        $communityId = $data['community_id'] ?? null;

        if ($communityId) {
            // 🔒 make sure this community is MINE (I am the owner)
            $isMine = Community::query()
                ->where('id', $communityId)
                ->where('owner_id', $userId)
                ->exists();

            if (! $isMine) {
                return back()
                    ->withInput()
                    ->withErrors([
                        'community_id' => 'You can only attach projects to communities you own.',
                    ]);
            }
        }

        $project = Project::create([
            'name'         => $data['name'],
            'key'          => $data['key'] ?? null,
            'description'  => $data['description'] ?? null,
            'owner_id'     => $userId,
            'community_id' => $communityId,
        ]);

        return redirect()
            ->route('projects.show', $project->id)
            ->with('success', 'Project created.');
    }

 
    public function show(Request $request, Project $project)
    {
        // Read filters from query string
        $status   = $request->query('status');
        $priority = $request->query('priority');

        // Eager-load what the page needs
        $project->load(['community.owner:id,name']);

        // Build the issues query with optional filters
        $issuesQuery = $project->issues()
            ->with(['assignee:id,name'])
            ->latest('created_at');

        if (in_array($status, ['todo', 'in_progress', 'done'], true)) {
            $issuesQuery->where('status', $status);
        }

        if (in_array($priority, ['low', 'medium', 'high'], true)) {
            $issuesQuery->where('priority', $priority);
        }

        return Inertia::render('Projects/Show', [
            // Use closures so partial reloads only compute what’s needed (e.g. 'issues')
            'project' => fn () => [
                'id'          => $project->id,
                'name'        => $project->name,
                'key'         => $project->key,
                'description' => $project->description,
                'owner_id'    => $project->owner_id,
                'community_id'=> $project->community_id,
                'community'   => $project->community ? [
                    'id'    => $project->community->id,
                    'name'  => $project->community->name,
                    'owner' => $project->community->owner
                        ? ['id' => $project->community->owner->id, 'name' => $project->community->owner->name]
                        : null,
                ] : null,
            ],

            'issues' => fn () =>
                $issuesQuery->get()->map(function ($i) {
                    return [
                        'id'          => $i->id,
                        'number'      => $i->number,
                        'title'       => $i->title,
                        'description' => $i->description,
                        'status'      => $i->status,
                        'priority'    => $i->priority,
                        'due_date'    => optional($i->due_date)?->toDateString(),
                        'created_at'  => $i->created_at,
                        'assignee_id' => $i->assignee_id,
                        'assignee'    => $i->assignee ? [
                            'id'   => $i->assignee->id,
                            'name' => $i->assignee->name,
                        ] : null,
                    ];
                }),

            'assignees' => fn () => $project->community_id
                ? $project->community
                    ->users()
                    ->wherePivot('status', 'accepted')
                    ->get(['users.id', 'users.name'])
                    ->map(fn ($u) => ['id' => $u->id, 'name' => $u->name])
                : collect(),

            'filters' => [
                'status'   => $status ?? '',
                'priority' => $priority ?? '',
            ],

            'me'    => fn () => Auth::user()?->only(['id', 'name', 'email']),
            'flash' => fn () => session()->only(['success', 'error']),
        ]);
    }
    public function update(UpdateProjectRequest $request, Project $project): RedirectResponse
    {
        if ($project->owner_id !== Auth::id()) {
            abort(403, 'You do not have access to this project.');
        }

        $data = $request->validated();

        $project->update([
            'name'         => $data['name'],
            'description'  => $data['description'] ?? null,
            'community_id' => $data['community_id'] ?? $project->community_id, // allow switching community
        ]);

        return redirect()
            ->route('projects.show', $project->id)
            ->with('success', 'Project updated.');
    }
    public function destroy(Project $project): RedirectResponse
    {
        if ($project->owner_id !== Auth::id()) {
            abort(403, 'You do not have access to this project.');
        }

        $project->delete();

        return redirect()
            ->route('projects.index')
            ->with('success', 'Project deleted successfully.');
    }
}
