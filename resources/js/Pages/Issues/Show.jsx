import AppLayout from '@/Layouts/AppLayout';
import Badge from '@/Components/Badge';
import Button from '@/Components/Button';
import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

function StatusBadge({ status }) {
  const tone = status === 'done' ? 'green' : status === 'in_progress' ? 'blue' : 'gray';
  const label = status === 'in_progress' ? 'In Progress' : status === 'todo' ? 'To-do' : 'Done';
  return <Badge tone={tone}>{label}</Badge>;
}
function PriorityBadge({ priority }) {
  const map = { low: 'green', medium: 'amber', high: 'rose' };
  const tone = map[priority] || 'gray';
  const label = priority?.[0]?.toUpperCase() + priority?.slice(1);
  return <Badge tone={tone}>{label}</Badge>;
}

export default function Show({ project, issue }) {
  return (
    <AuthenticatedLayout>
      <Head title="Issue-Details" />
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">
          {project.key}-{issue.number}: {issue.title}
        </h1>
        <Link href={`/projects/${project.id}/issues`} className="text-sm underline text-indigo-700 hover:text-indigo-800">
          ← Back to Issues
        </Link>
      </div>

      {/* Meta */}
      <div className="rounded-xl border bg-white p-5 shadow-sm space-y-2">
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <StatusBadge status={issue.status} />
          <PriorityBadge priority={issue.priority} />
          {issue.assignee ? (
            <span className="text-gray-700">Assignee: <span className="font-medium">{issue.assignee.name}</span></span>
          ) : (
            <span className="text-gray-500 italic">Unassigned</span>
          )}
          <span className="text-xs text-gray-500 ml-auto">
            Created: {new Date(issue.created_at).toLocaleString()}
          </span>
        </div>
      </div>

      {/* Description */}
      <section className="rounded-xl border bg-white p-5 shadow-sm">
        {issue.description ? (
          <p className="text-gray-800 whitespace-pre-wrap">{issue.description}</p>
        ) : (
          <p className="text-gray-500 italic">No description provided.</p>
        )}
      </section>
    </AuthenticatedLayout>
  );
}
