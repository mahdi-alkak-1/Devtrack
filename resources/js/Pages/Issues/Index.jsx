import Button from '@/Components/Button'
import Badge from '@/Components/Badge'
import { Head, Link, useForm, usePage, router } from '@inertiajs/react'
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

export default function Index({ project, issues, me, filters, assignees = [] }) {
  const { flash } = usePage().props
  const isOwner = String(me?.id || '') === String(project?.owner_id || '') // ← owner-only checks

  // Build assignee options for the "Create Issue" form without duplicates
  const createAssigneeOptions = [
    { id: '', name: 'Unassigned' },
    ...(me ? [{ id: String(me.id), name: `Assign to me (${me.name})` }] : []),
    ...assignees
      .filter(a => !me || String(a.id) !== String(me.id))
      .map(a => ({ id: String(a.id), name: a.name })),
  ]

  const { data, setData, post, processing, errors, reset } = useForm({
    title: '',
    description: '',
    status: 'todo',
    priority: 'medium',
    due_date: '',
    assignee_id: '',
  })

  function submit(e) {
    e.preventDefault()
    post(`/projects/${project.id}/issues`, {
      onSuccess: () => reset('title', 'description', 'due_date', 'assignee_id'),
      preserveScroll: true,
    })
  }

  function updateStatus(issueId, newStatus) {
    router.patch(
      `/projects/${project.id}/issues/${issueId}`,
      { status: newStatus },
      { preserveScroll: true }
    )
  }

  function updatePriority(issueId, newPriority) {
    router.patch(
      `/projects/${project.id}/issues/${issueId}`,
      { priority: newPriority },
      { preserveScroll: true }
    )
  }

  function updateAssignee(issueId, assigneeId) {
    router.patch(
      `/projects/${project.id}/issues/${issueId}`,
      { assignee_id: assigneeId || null },
      { preserveScroll: true }
    )
  }

  function destroyIssue(issueId) {
    if (!confirm('Delete this issue?')) return
    router.delete(`/projects/${project.id}/issues/${issueId}`, { preserveScroll: true })
  }

  return (
    <AuthenticatedLayout>
      <Head title="Issues" />

      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-white">
          {project.name} <span className="text-white/50">({project.key})</span> — Issues
        </h1>
        <Link href={`/projects/${project.id}`}>
          <Button variant="outline">← Back to Project</Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="mb-4 rounded-2xl border border-white/10 bg-[#0f1731] p-4 shadow">
        <div className="flex flex-wrap items-center gap-3 text-sm text-white/80">
          <label className="flex items-center gap-2">
            <span className="text-white/70">Status:</span>
            <select
              className="rounded border border-white/10 bg-white/5 px-2 py-1 text-white"
              value={filters?.status ?? ''}
              onChange={(e) => {
                const s = e.target.value || undefined
                const p = filters?.priority || undefined
                router.get(
                  `/projects/${project.id}/issues`,
                  { status: s, priority: p },
                  { preserveState: true, replace: true, preserveScroll: true }
                )
              }}
            >
              <option className="bg-[#0f1731]" value="">All</option>
              <option className="bg-[#0f1731]" value="todo">todo</option>
              <option className="bg-[#0f1731]" value="in_progress">in_progress</option>
              <option className="bg-[#0f1731]" value="done">done</option>
            </select>
          </label>

          <label className="flex items-center gap-2">
            <span className="text-white/70">Priority:</span>
            <select
              className="rounded border border-white/10 bg-white/5 px-2 py-1 text-white"
              value={filters?.priority ?? ''}
              onChange={(e) => {
                const p = e.target.value || undefined
                const s = filters?.status || undefined
                router.get(
                  `/projects/${project.id}/issues`,
                  { status: s, priority: p },
                  { preserveState: true, replace: true, preserveScroll: true }
                )
              }}
            >
              <option className="bg-[#0f1731]" value="">All</option>
              <option className="bg-[#0f1731]" value="low">low</option>
              <option className="bg-[#0f1731]" value="medium">medium</option>
              <option className="bg-[#0f1731]" value="high">high</option>
            </select>
          </label>
        </div>
      </div>

      {/* Create Issue */}
      <section className="mb-4 rounded-2xl border border-white/10 bg-[#0f1731] p-5 shadow">
        <h2 className="mb-4 text-base font-semibold text-white">Create Issue</h2>
        <form onSubmit={submit} className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-white/80">Title</label>
            <input
              className="mt-1 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-white placeholder-white/30 outline-none focus:border-cyan-400/60"
              value={data.title}
              onChange={(e) => setData('title', e.target.value)}
              placeholder="Fix navbar overlap on mobile"
            />
            {errors.title && <p className="mt-1 text-sm text-rose-400">{errors.title}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-white/80">Status</label>
            <select
              className="mt-1 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-white outline-none focus:border-cyan-400/60"
              value={data.status}
              onChange={(e) => setData('status', e.target.value)}
            >
              <option className="bg-[#0f1731]" value="todo">todo</option>
              <option className="bg-[#0f1731]" value="in_progress">in_progress</option>
              <option className="bg-[#0f1731]" value="done">done</option>
            </select>
            {errors.status && <p className="mt-1 text-sm text-rose-400">{errors.status}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-white/80">Priority</label>
            <select
              className="mt-1 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-white outline-none focus:border-cyan-400/60"
              value={data.priority}
              onChange={(e) => setData('priority', e.target.value)}
            >
              <option className="bg-[#0f1731]" value="low">low</option>
              <option className="bg-[#0f1731]" value="medium">medium</option>
              <option className="bg-[#0f1731]" value="high">high</option>
            </select>
            {errors.priority && <p className="mt-1 text-sm text-rose-400">{errors.priority}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-white/80">Due date (optional)</label>
            <input
              type="date"
              className="mt-1 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-white outline-none focus:border-cyan-400/60"
              value={data.due_date}
              onChange={(e) => setData('due_date', e.target.value)}
            />
            {errors.due_date && <p className="mt-1 text-sm text-rose-400">{errors.due_date}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-white/80">Assignee</label>
            <select
              className="mt-1 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-white outline-none focus:border-cyan-400/60"
              value={data.assignee_id}
              onChange={(e) => setData('assignee_id', e.target.value)}
            >
              {createAssigneeOptions.map(opt => (
                <option key={opt.id || 'none'} value={opt.id} className="bg-[#0f1731]">
                  {opt.name}
                </option>
              ))}
            </select>
            {errors.assignee_id && <p className="mt-1 text-sm text-rose-400">{errors.assignee_id}</p>}
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-white/80">Description (optional)</label>
            <textarea
              rows={3}
              className="mt-1 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-white outline-none focus:border-cyan-400/60"
              value={data.description}
              onChange={(e) => setData('description', e.target.value)}
            />
            {errors.description && <p className="mt-1 text-sm text-rose-400">{errors.description}</p>}
          </div>

          <div className="md:col-span-2">
            <Button type="submit" disabled={processing}>
              {processing ? 'Creating…' : 'Create Issue'}
            </Button>
          </div>
        </form>
      </section>

      {/* List */}
      {issues.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-[#0f1731] p-6 text-white/70">
          No issues yet.
        </div>
      ) : (
        <ul className="overflow-hidden rounded-2xl border border-white/10 bg-[#0f1731] shadow">
          {issues.map((i) => (
            <li key={i.id} className="border-b border-white/10 p-4 last:border-b-0">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-base font-medium text-white">
                    <Link
                      href={`/projects/${project.id}/issues/${i.id}`}
                      className="underline decoration-cyan-400/60 underline-offset-2 hover:text-cyan-200"
                    >
                      {project.key}-{i.number}: {i.title}
                    </Link>
                  </h2>
                  <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-white/80">
                    <StatusBadge status={i.status} />
                    <PriorityBadge priority={i.priority} />
                    <span className="text-xs text-white/50">
                      {new Date(i.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <Button variant="danger" onClick={() => destroyIssue(i.id)}>Delete</Button>
              </div>

              {/* Controls */}
              <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-white/80">
                <label className="flex items-center gap-2">
                  <span className="text-white/70">Status:</span>
                  <select
                    className="rounded border border-white/10 bg-white/5 px-2 py-1 text-white"
                    value={i.status}
                    onChange={(e) => updateStatus(i.id, e.target.value)}
                  >
                    <option className="bg-[#0f1731]" value="todo">todo</option>
                    <option className="bg-[#0f1731]" value="in_progress">in_progress</option>
                    <option className="bg-[#0f1731]" value="done">done</option>
                  </select>
                </label>

                <label className="flex items-center gap-2">
                  <span className="text-white/70">Priority:</span>
                  <select
                    className="rounded border border-white/10 bg-white/5 px-2 py-1 text-white"
                    value={i.priority}
                    onChange={(e) => updatePriority(i.id, e.target.value)}
                  >
                    <option className="bg-[#0f1731]" value="low">low</option>
                    <option className="bg-[#0f1731]" value="medium">medium</option>
                    <option className="bg-[#0f1731]" value="high">high</option>
                  </select>
                </label>

                {/* Owner-only: reassign inline */}
                {isOwner && (
                  <label className="flex items-center gap-2">
                    <span className="text-white/70">Assignee:</span>
                    <select
                      className="rounded border border-white/10 bg-white/5 px-2 py-1 text-white"
                      value={i.assignee_id ?? ''}
                      onChange={(e) => updateAssignee(i.id, e.target.value)}
                    >
                      <option className="bg-[#0f1731]" value="">Unassigned</option>
                      {me && <option className="bg-[#0f1731]" value={me.id}>Assign to me ({me.name})</option>}
                      {assignees
                        .filter(u => !me || String(u.id) !== String(me.id))
                        .map(u => (
                          <option key={u.id} value={u.id} className="bg-[#0f1731]">{u.name}</option>
                        ))
                      }
                    </select>
                  </label>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </AuthenticatedLayout>
  )
}
