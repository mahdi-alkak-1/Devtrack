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
        // Accepted communities owned by or joined by the user
        $myCommunities = Auth::user()
            ->communities()
            ->wherePivot('status', 'accepted')
            ->select('communities.id','communities.name')
            ->orderBy('communities.name')
            ->get();

        return Inertia::render('Projects/Create', [
            'title'        => 'Create Project',
            'communities'  => $myCommunities, // ← for <select>
        ]);
    }

    public function store(StoreProjectRequest $request): RedirectResponse
    {
        $data = $request->validated();

        Project::create([
            'name'         => $data['name'],
            'key'          => strtoupper($data['key']),
            'description'  => $data['description'] ?? null,
            'owner_id'     => Auth::id(),
            'community_id' => $data['community_id'] ?? null, // ← NEW
        ]);

        return redirect()
            ->route('projects.index')
            ->with('success', 'Project created successfully.');
    }

    public function show(Project $project): Response
    {
        $project->loadCount('issues')->load('owner:id,name,email','community:id,name');

        return Inertia::render('Projects/Show', [
            'project' => [
                'id'           => $project->id,
                'name'         => $project->name,
                'key'          => $project->key,
                'description'  => $project->description,
                'created_at'   => $project->created_at,
                'issues_count' => $project->issues_count,
                'owner'        => $project->owner ? [
                    'id'    => $project->owner->id,
                    'name'  => $project->owner->name,
                    'email' => $project->owner->email,
                ] : null,
                'community'    => $project->community ? [
                    'id'   => $project->community->id,
                    'name' => $project->community->name,
                ] : null,
            ],
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
}
