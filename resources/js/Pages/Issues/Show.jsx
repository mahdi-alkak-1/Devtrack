import Badge from '@/Components/Badge'
import Button from '@/Components/Button'
import { Head, Link } from '@inertiajs/react'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'

function StatusBadge({ status }) {
  const tone = status === 'done' ? 'green' : status === 'in_progress' ? 'blue' : 'gray'
  const label = status === 'in_progress' ? 'In Progress' : status === 'todo' ? 'To-do' : 'Done'
  return <Badge tone={tone}>{label}</Badge>
}
function PriorityBadge({ priority }) {
  const map = { low: 'green', medium: 'amber', high: 'rose' }
  const tone = map[priority] || 'gray'
  const label = priority?.[0]?.toUpperCase() + priority?.slice(1)
  return <Badge tone={tone}>{label}</Badge>
}

export default function Show({ project, issue }) {
  return (
    <AuthenticatedLayout>
      <Head title="Issue Details" />

      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-white">
          {project.key}-{issue.number}: {issue.title}
        </h1>
        <Link href={`/projects/${project.id}/issues`}>
          <Button variant="outline">← Back to Issues</Button>
        </Link>
      </div>

      {/* Meta */}
      <div className="mb-4 rounded-2xl border border-white/10 bg-[#0f1731] p-5 shadow">
        <div className="flex flex-wrap items-center gap-2 text-sm text-white/80">
          <StatusBadge status={issue.status} />
          <PriorityBadge priority={issue.priority} />
          {issue.assignee ? (
            <span>Assignee: <span className="font-medium text-white/90">{issue.assignee.name}</span></span>
          ) : (
            <span className="italic text-white/60">Unassigned</span>
          )}
          <span className="ml-auto text-xs text-white/50">
            Created: {new Date(issue.created_at).toLocaleString()}
          </span>
        </div>
      </div>

      {/* Description */}
      <section className="rounded-2xl border border-white/10 bg-[#0f1731] p-5 shadow">
        {issue.description ? (
          <p className="whitespace-pre-wrap text-white/85">{issue.description}</p>
        ) : (
          <p className="italic text-white/60">No description provided.</p>
        )}
      </section>
    </AuthenticatedLayout>
  )
}
