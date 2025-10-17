<?php

namespace App\Http\Controllers;                             // 1) Controller namespace

use App\Models\Project;                                     // 2) We’ll list issues for a given Project
use App\Models\Issue;                                       // 3) (Optional here) direct access to Issue if needed
use Illuminate\Http\Request;                                // 4) To read filters later (?status=...)
use Inertia\Inertia;                                        // 5) Inertia bridge
use Inertia\Response;                                       // 6) Return type hint
use Illuminate\Support\Facades\Auth; 
use App\Http\Requests\StoreIssueRequest;     // 1) Our validation rules
use Illuminate\Http\RedirectResponse;        // 2) Redirect type
use Illuminate\Support\Facades\DB;           // 3) For an atomic transaction (safe numbering)
                       // 7) Current user (for auth checks later)

class IssueController extends Controller                    // 8) Our controller class
{
    // GET /projects/{project}/issues
    public function index(Request $request, Project $project): Response   // 9) Route Model Binding injects Project
    {
        // 10) Basic auth guard (owner-only for now; we’ll add policies later)
        if ($project->owner_id !== Auth::id()) {
            abort(403, 'You do not have access to this project.');
        }

        
        // 1) Read optional ?status=todo|in_progress|done from the query string
        $status = $request->query('status');
        $allowed = ['todo', 'in_progress', 'done'];
        if ($status && !in_array($status, $allowed, true)) {
            $status = null; // ignore invalid values
        }

            // NEW: priority filter
        $priority = $request->query('priority');
        $allowedPriority = ['low', 'medium', 'high'];
        if ($priority && !in_array($priority, $allowedPriority, true)) {
            $priority = null;
        }

        // 11) Fetch issues for this project (we’ll add filters/pagination later)
        $query = $project->issues()
            ->select('id','number','title','status','priority','assignee_id','created_at')
            ->orderBy('number');        // show in sequence order

        if ($status) {
            $query->where('status', $status);
        }

            // NEW:
        if ($priority) {
            $query->where('priority', $priority);
        }
        
        $issues = $query->get();

        // 12) Send data to a new React page: resources/js/Pages/Issues/Index.jsx
        return Inertia::render('Issues/Index', [
            'project' => [
                'id'   => $project->id,
                'name' => $project->name,
                'key'  => $project->key,
            ],
            'issues'  => $issues,
            'me' => [
                'id' =>Auth::id(),
                'name' => Auth::user()->name,   
            ],
                'filters' => [                         // 👈 add this block
                'status' => $status,               // 'todo' | 'in_progress' | 'done' | null
                
            ],
        ]);
    }

    public function store(StoreIssueRequest $request, Project $project): RedirectResponse
    {
        // 4) Basic access guard — only owner for now (we'll add Policies later)
        if ($project->owner_id !== Auth::id()) {
            abort(403, 'You do not have access to this project.');
        }

        // 5) Validate input using StoreIssueRequest; gives us only clean fields
        $data = $request->validated();

        // 6) Create the issue inside a DB transaction so "number" stays consistent if two creates happen at once
        DB::transaction(function () use ($project, $data) {
            // 7) Find the next per-project sequence number: max(number)+1 (or 1 if none)
            $nextNumber = ($project->issues()->max('number') ?? 0) + 1;

            // 8) Insert the issue
            $project->issues()->create([
                'number'      => $nextNumber,                 // WEB-<number>
                'title'       => $data['title'],
                'description' => $data['description'] ?? null,
                'status'      => $data['status'] ?? 'todo',
                'priority'    => $data['priority'] ?? 'medium',
                'due_date'    => $data['due_date'] ?? null,
                'assignee_id' => $data['assignee_id'] ?? null,
            ]);
        });

        // 9) Redirect back to this project's issues list with a success flash
        return redirect()
            ->route('projects.issues.index', $project->id)
            ->with('success', 'Issue created successfully.');
    }

    public function update(Request $request, Project $project, Issue $issue): RedirectResponse
    {
        if ($project->owner_id !== Auth::id()) {
            abort(403, 'You do not have access to this project.');
        }
        if ($issue->project_id !== $project->id) {
            abort(404, 'Issue not found in this project.');
        }

        // Validate optional fields; at least one must be present
        $data = $request->validate([
            'status'   => ['nullable', 'in:todo,in_progress,done'],
            'priority' => ['nullable', 'in:low,medium,high'],
        ]);

        if (empty(array_filter($data, fn ($v) => !is_null($v)))) {
            return back()->with('error', 'Nothing to update.');
        }

        $issue->update(array_filter($data, fn ($v) => !is_null($v)));

        return redirect()
            ->route('projects.issues.index', $project->id)
            ->with('success', 'Issue updated.');
    }

    public function show(Project $project, Issue $issue): Response
    {
        // 1) Make sure the issue belongs to this project (integrity check).
        if ($issue->project_id !== $project->id) {
            abort(404, 'Issue not found in this project.');
        }

        // 2) (Simple auth) Only the project owner for now.
        if ($project->owner_id !== Auth::id()) {
            abort(403, 'You do not have access to this project.');
        }

        // 3) Optionally eager-load small relations (assignee) if you want.
        $issue->load('assignee:id,name');

        // 4) Render the React page and pass the props we need.
        return Inertia::render('Issues/Show', [
            'project' => [
                'id'   => $project->id,
                'name' => $project->name,
                'key'  => $project->key,
            ],
            'issue' => [
                'id'          => $issue->id,
                'number'      => $issue->number,
                'title'       => $issue->title,
                'description' => $issue->description,
                'status'      => $issue->status,
                'priority'    => $issue->priority,
                'due_date'    => $issue->due_date,
                'assignee'    => $issue->assignee?->only(['id','name']),
                'created_at'  => $issue->created_at,
            ],
        ]);
    }

    public function destroy(Project $project, Issue $issue): RedirectResponse
    {
        // 1) Ensure the issue belongs to this project
        if ($issue->project_id !== $project->id) {
            abort(404, 'Issue not found in this project.');
        }

        // 2) Simple auth: only the project owner can delete (for now)
        if ($project->owner_id !== Auth::id()) {
            abort(403, 'You do not have access to this project.');
        }

        // 3) Delete the issue
        $issue->delete();

        // 4) Redirect back to the issues list with a flash message
        return redirect()
            ->route('projects.issues.index', $project->id)
            ->with('success', 'Issue deleted.');
    }
}
