<?php

namespace App\Http\Controllers;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\Request;
use App\Models\Project;
use App\Http\Requests\StoreProjectRequest; 
use Illuminate\Http\RedirectResponse;
use App\Http\Requests\UpdateProjectRequest;

class ProjectController extends Controller
{
    public function index(Request $request): Response
    {
        $projects = Project::where('owner_id',Auth::id())->get();

        return Inertia::render('Projects/Index',[
            'title' => 'Your Projects',
            'projects' => $projects
        ]);
    }
    public function create(): Response
    {
        return Inertia::render('Projects/Create', [
                'title' => 'Create Project',
        ]);
    }

    public function store(StoreProjectRequest $request): RedirectResponse
    {
        // 1) Validate input using StoreProjectRequest rules; returns only clean fields
        $data = $request->validated();

        // 2) Create the row; strtoupper keeps keys consistent (e.g., "web" -> "WEB")
        Project::create([
            'name'        => $data['name'],
            'key'         => strtoupper($data['key']),
            'description' => $data['description'] ?? null,
            'owner_id'    => Auth::id(),
        ]);

        // 3) Redirect back to list with a flash message
        return redirect()
            ->route('projects.index')
            ->with('success', 'Project created successfully.');
    }
    public function show(Project $project): Response
    {
        // load the count of related issues (adds $project->issues_count)
        $project->loadCount('issues');

        return Inertia::render('Projects/Show', [
            'project' => [
                'id'          => $project->id,
                'name'        => $project->name,
                'key'         => $project->key,
                'description' => $project->description,
                'created_at'  => $project->created_at,
                'issues_count'=> $project->issues_count,   // <- pass the count to React
                'owner'        => $project->owner ? [
                    'id'    => $project->owner->id,
                    'name'  => $project->owner->name,
                    'email' => $project->owner->email,
                ] : null,
            ],
        ]);
    }

    public function update(UpdateProjectRequest $request, Project $project): RedirectResponse
    {
        // Owner-only for now
        if ($project->owner_id !== Auth::id()) {
            abort(403, 'You do not have access to this project.');
        }

        // Only validated fields (name, description)
        $data = $request->validated();

        $project->update([
            'name'        => $data['name'],
            'description' => $data['description'] ?? null,
        ]);

        return redirect()
            ->route('projects.show', $project->id)
            ->with('success', 'Project updated.');
    }


}
