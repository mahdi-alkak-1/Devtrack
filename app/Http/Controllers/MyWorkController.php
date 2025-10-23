<?php
// app/Http/Controllers/MyWorkController.php
namespace App\Http\Controllers;

use App\Models\Issue;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class MyWorkController extends Controller
{
    public function index()
    {
        $userId = Auth::id();

        $issues = Issue::select('id','number','title','status','priority','project_id','created_at')
            ->where('assignee_id', $userId)
            ->whereIn('status', ['todo','in_progress'])   // hide 'done'
            ->with(['project:id,name,key'])               // include project with id/key/name
            ->orderByDesc('id')
            ->get()
            ->map(fn ($i) => [
                'id'         => $i->id,
                'number'     => $i->number,
                'title'      => $i->title,
                'status'     => $i->status,
                'priority'   => $i->priority,
                'created_at' => $i->created_at,
                'project_id' => $i->project_id,           // fallback id
                'project'    => $i->project ? [
                    'id'   => $i->project->id,
                    'key'  => $i->project->key,
                    'name' => $i->project->name,
                ] : null,
            ]);

        return Inertia::render('MyWork/Index', [
            'issues' => $issues,
        ]);
    }
}
