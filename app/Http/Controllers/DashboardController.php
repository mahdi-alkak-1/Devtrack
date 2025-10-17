<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Models\Issue;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __invoke(Request $request): Response
    {
        $userId = Auth::id();

        // Stats for the signed-in user (personal tracker)
        $projectsCount = Project::where('owner_id', $userId)->count();

        $issuesBase = Issue::whereHas('project', fn ($q) => $q->where('owner_id', $userId));

        $issuesCount      = (clone $issuesBase)->count();
        $issuesTodo       = (clone $issuesBase)->where('status', 'todo')->count();
        $issuesInProgress = (clone $issuesBase)->where('status', 'in_progress')->count();
        $issuesDone       = (clone $issuesBase)->where('status', 'done')->count();

        // Recent 5 issues (newest first)
        $recentIssues = (clone $issuesBase)
            ->select('id','number','title','status','priority','project_id','created_at')
            ->with(['project:id,key,name'])
            ->orderByDesc('id')
            ->limit(5)
            ->get()
            ->map(fn ($i) => [
                'id'         => $i->id,
                'number'     => $i->number,
                'title'      => $i->title,
                'status'     => $i->status,
                'priority'   => $i->priority,
                'created_at' => $i->created_at,
                'project'    => [
                    'id'   => $i->project->id,
                    'key'  => $i->project->key,
                    'name' => $i->project->name,
                ],
            ]);

        return Inertia::render('Dashboard', [
            'stats' => [
                'projects'      => $projectsCount,
                'issues'        => $issuesCount,
                'issues_todo'   => $issuesTodo,
                'issues_doing'  => $issuesInProgress,
                'issues_done'   => $issuesDone,
            ],
            'recentIssues' => $recentIssues,
        ]);
    }
}
