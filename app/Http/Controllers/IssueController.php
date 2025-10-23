<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Models\Issue;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\Auth;
use App\Http\Requests\StoreIssueRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\DB;
use App\Notifications\IssueAssigned;
use App\Notifications\IssueStatusChanged;

class IssueController extends Controller
{
    // GET /projects/{project}/issues
    public function index(Request $request, Project $project): Response
    {
        // Owner-only listing page (assignees use "My Work")
        if ($project->owner_id !== Auth::id()) {
            abort(403, 'You do not have access to this project.');
        }

        $status = $request->query('status');
        $allowedStatus = ['todo', 'in_progress', 'done'];
        if ($status && !in_array($status, $allowedStatus, true)) {
            $status = null;
        }

        $priority = $request->query('priority');
        $allowedPriority = ['low', 'medium', 'high'];
        if ($priority && !in_array($priority, $allowedPriority, true)) {
            $priority = null;
        }

        $query = $project->issues()
            ->select('id','number','title','status','priority','assignee_id','created_at')
            ->orderBy('number');

        if ($status)   $query->where('status', $status);
        if ($priority) $query->where('priority', $priority);

        $issues = $query->get();

        // Assignee options = accepted members of the project's community (if any)
        $assignees = collect();
        if ($project->community_id) {
            $assignees = User::select('users.id','users.name')
                ->join('community_user','users.id','=','community_user.user_id')
                ->where('community_user.community_id', $project->community_id)
                ->where('community_user.status', 'accepted')
                ->orderBy('users.name')
                ->get();
        }

        return Inertia::render('Issues/Index', [
            'project' => [
                'id'        => $project->id,
                'name'      => $project->name,
                'key'       => $project->key,
                'owner_id'  => $project->owner_id, // 👈 needed to show owner-only UI
            ],
            'issues'  => $issues,
            'me'      => [
                'id'   => Auth::id(),
                'name' => Auth::user()->name,
            ],
            'filters' => [
                'status'   => $status,
                'priority' => $priority,
            ],
            'assignees' => $assignees,
        ]);
    }

    public function show(Project $project, Issue $issue): Response
    {
        // Ensure the issue belongs to the project
        if ($issue->project_id !== $project->id) {
            abort(404, 'Issue not found in this project.');
        }

        $userId     = Auth::id();
        $isOwner    = $project->owner_id === $userId;
        $isAssignee = $issue->assignee_id === $userId;

        // Allow project owner OR the assignee to view
        if (!($isOwner || $isAssignee)) {
            abort(403, 'You do not have access to this issue.');
        }

        $issue->load('assignee:id,name');

        return \Inertia\Inertia::render('Issues/Show', [
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

    // POST /projects/{project}/issues
    public function store(StoreIssueRequest $request, Project $project): RedirectResponse
    {
        if ($project->owner_id !== Auth::id()) {
            abort(403, 'You do not have access to this project.');
        }

        $data = $request->validated();

        // If assignee provided, ensure they belong to the project's community
        if (!empty($data['assignee_id']) && $project->community_id) {
            $isMember = DB::table('community_user')
                ->where('community_id', $project->community_id)
                ->where('user_id', $data['assignee_id'])
                ->where('status', 'accepted')
                ->exists();
            if (!$isMember) {
                return back()->with('error', 'Selected user is not in this project’s community.');
            }
        }

        $createdIssue = null;

        DB::transaction(function () use ($project, $data, &$createdIssue) {
            $nextNumber = ($project->issues()->max('number') ?? 0) + 1;

            $createdIssue = $project->issues()->create([
                'number'      => $nextNumber,
                'title'       => $data['title'],
                'description' => $data['description'] ?? null,
                'status'      => $data['status'] ?? 'todo',
                'priority'    => $data['priority'] ?? 'medium',
                'due_date'    => $data['due_date'] ?? null,
                'assignee_id' => $data['assignee_id'] ?? null,
            ]);
        });

        // Notify assignee if set
        if ($createdIssue && !empty($data['assignee_id'])) {
            $assignee = User::find($data['assignee_id']);
            if ($assignee) {
                $assignee->notify(new IssueAssigned($createdIssue));
            }
        }

        return redirect()
            ->route('projects.issues.index', $project->id)
            ->with('success', 'Issue created successfully.');
    }

    // PATCH /projects/{project}/issues/{issue}
// app/Http/Controllers/IssueController.php

    public function update(Request $request, Project $project, Issue $issue): RedirectResponse
    {
        // 1) Integrity: make sure this issue belongs to this project
        if ($issue->project_id !== $project->id) {
            abort(404, 'Issue not found in this project.');
        }

        // 2) Authorization: allow project owner OR the assignee
        $userId     = Auth::id();
        $isOwner    = $project->owner_id === $userId;
        $isAssignee = $issue->assignee_id === $userId;

        if (!($isOwner || $isAssignee)) {
            abort(403, 'You do not have access to update this issue.');
        }

        // 3) Validation: owner can change assignee; assignee can change status/priority
        $rules = [
            'status'   => ['nullable', 'in:todo,in_progress,done'],
            'priority' => ['nullable', 'in:low,medium,high'],
        ];
        if ($isOwner) {
            $rules['assignee_id'] = ['nullable', 'exists:users,id'];
        }
        $data = $request->validate($rules);

        // 4) If owner is changing assignee, ensure that user is in the project's community (if any)
        if (
            $isOwner &&
            array_key_exists('assignee_id', $data) &&
            !is_null($data['assignee_id']) &&
            $project->community_id
        ) {
            $isMember = DB::table('community_user')
                ->where('community_id', $project->community_id)
                ->where('user_id', $data['assignee_id'])
                ->where('status', 'accepted')
                ->exists();

            if (!$isMember) {
                return back()->with('error', 'Selected user is not in this project’s community.');
            }
        }

        if (empty(array_filter($data, fn ($v) => !is_null($v)))) {
            return back()->with('error', 'Nothing to update.');
        }

        $oldStatus   = $issue->status;
        $oldAssignee = $issue->assignee_id;

        // 5) Apply updates
        $issue->update(array_filter($data, fn ($v) => !is_null($v)));

        // 6) Notify new assignee (only if owner changed assignee)
        if ($isOwner && array_key_exists('assignee_id', $data) && $data['assignee_id'] && (int)$data['assignee_id'] !== (int)$oldAssignee) {
            $assignee = \App\Models\User::find($data['assignee_id']);
            if ($assignee) {
                $assignee->notify(new \App\Notifications\IssueAssigned($issue));
            }
        }

        // 7) Notify owner when status becomes 'done' (assignee completing work)
        if (isset($data['status']) && $oldStatus !== $data['status'] && $data['status'] === 'done') {
            $owner = $project->owner;
            if ($owner) {
                $owner->notify(new \App\Notifications\IssueStatusChanged($issue, $oldStatus, $data['status']));
            }
        }

        // From My Work we do a partial reload, so redirecting back is fine
        return back()->with('success', 'Issue updated.');
    }


    // DELETE /projects/{project}/issues/{issue}
    public function destroy(Project $project, Issue $issue): RedirectResponse
    {
        if ($issue->project_id !== $project->id) {
            abort(404, 'Issue not found in this project.');
        }
        if ($project->owner_id !== Auth::id()) {
            abort(403, 'You do not have access to this project.');
        }

        $issue->delete();

        return redirect()
            ->route('projects.issues.index', $project->id)
            ->with('success', 'Issue deleted.');
    }

    // (kept if you use it elsewhere)
    private function isOwnerOrAssignee(Project $project, Issue $issue): bool
    {
        $userId = Auth::id();
        return $issue->project_id === $project->id
            && ($userId === $project->owner_id || $userId === $issue->assignee_id);
    }
}
