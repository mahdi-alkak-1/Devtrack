<?php

namespace App\Notifications;

use App\Models\Issue;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
// If you decide to queue later:
// use Illuminate\Contracts\Queue\ShouldQueue;
// use Illuminate\Queue\SerializesModels;

class IssueStatusChanged extends Notification
{
    use Queueable;
    // If queued: use SerializesModels and implement ShouldQueue

    public function __construct(public Issue $issue, public string $old, public string $new) {}

    public function via($notifiable): array
    {
        return ['database'];
    }

    public function toDatabase($notifiable): array
    {
        $issue = $this->issue->loadMissing('project:id,name,key');
        $project = $issue->project;

        return [
            'type'     => 'issue_status_changed',
            'issue'    => [
                'id'     => $issue->id,
                'number' => $issue->number,
                'title'  => $issue->title,
                'from'   => $this->old,
                'to'     => $this->new,
            ],
            'project'  => $project ? [
                'id'   => $project->id,
                'name' => $project->name,
                'key'  => $project->key,
            ] : null,
            'message'  => $project
                ? "{$project->key}-{$issue->number} “{$issue->title}” marked as {$this->new}"
                : "Issue #{$issue->number} “{$issue->title}” marked as {$this->new}",
            'url'      => $project ? url("/projects/{$project->id}/issues/{$issue->id}") : null,
        ];
    }
}
