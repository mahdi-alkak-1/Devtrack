<?php

namespace App\Notifications;

use App\Models\Issue;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class IssueStatusChanged extends Notification
{
    use Queueable;

    public function __construct(public Issue $issue, public string $old, public string $new) {}

    public function via($notifiable): array
    {
        return ['database'];
    }

    public function toDatabase($notifiable): array
    {
        $issue   = $this->issue->loadMissing('project:id,name,key');
        $project = $issue->project;

        $targetUrl = url('/my-work');

        return [
            'type'     => 'issue_status_changed',
            'title'    => 'Issue status updated',
            'message'  => $project
                ? "{$project->key}-{$issue->number} “{$issue->title}” marked as {$this->new}"
                : "Issue #{$issue->number} “{$issue->title}” marked as {$this->new}",
            'url'      => $targetUrl,

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
        ];
    }
}
