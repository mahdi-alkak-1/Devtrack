<?php

namespace App\Notifications;

use App\Models\Issue;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
// If you decide to queue later:
// use Illuminate\Contracts\Queue\ShouldQueue;
// use Illuminate\Queue\SerializesModels;

class IssueAssigned extends Notification
{
    use Queueable;
    // If queued: use SerializesModels and implement ShouldQueue

    public function __construct(public Issue $issue) {}

    public function via($notifiable): array
    {
        return ['database']; // add 'mail' later if you want emails too
    }

    public function toDatabase($notifiable): array
    {
        $issue = $this->issue->loadMissing('project:id,key,name');
        $project = $issue->project;

        return [
            'type'    => 'issue_assigned',
            'issue'   => [
                'id'     => $issue->id,
                'number' => $issue->number,
                'title'  => $issue->title,
                'status' => $issue->status,
            ],
            'project' => $project ? [
                'id'   => $project->id,
                'key'  => $project->key,
                'name' => $project->name,
            ] : null,
            'message' => $project
                ? "You were assigned to {$project->key}-{$issue->number}: {$issue->title}"
                : "You were assigned to issue #{$issue->number}: {$issue->title}",
            'url'     => $project ? url("/projects/{$project->id}/issues/{$issue->id}") : null,
        ];
    }
}
