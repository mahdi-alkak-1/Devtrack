<?php

namespace App\Notifications;

use App\Models\Issue;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class IssueAssigned extends Notification
{
    use Queueable;

    public function __construct(public Issue $issue) {}

    public function via($notifiable): array
    {
        // Add 'mail' later if you want email too
        return ['database'];
    }

    public function toDatabase($notifiable): array
    {
        $issue   = $this->issue->loadMissing('project:id,key,name');
        $project = $issue->project;

        // Single, consistent target: My Work
        $targetUrl = url('/my-work');

        return [
            'type'     => 'issue_assigned',
            'title'    => 'New issue assigned',
            'message'  => $project
                ? "You were assigned to {$project->key}-{$issue->number}: {$issue->title}"
                : "You were assigned to issue #{$issue->number}: {$issue->title}",
            'url'      => $targetUrl,

            // keep helpful context
            'issue'    => [
                'id'     => $issue->id,
                'number' => $issue->number,
                'title'  => $issue->title,
                'status' => $issue->status,
            ],
            'project'  => $project ? [
                'id'   => $project->id,
                'key'  => $project->key,
                'name' => $project->name,
            ] : null,
        ];
    }
}
