// resources/js/Pages/Projects/Show.jsx
import { Head, Link, useForm, usePage, router } from '@inertiajs/react'
import { useEffect, useMemo, useRef, useState } from 'react'

import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import Button from '@/Components/Button'
import StatusBadge from '@/Components/StatusBadge'
import PriorityBadge from '@/Components/PriorityBadge'
import AnotherModal from '@/Components/AnotherModal'
import ConfirmDialog from '@/Components/ConfirmDialog'

export default function Show({ project, issues = [], me, assignees = [], filters = {} }) {
  const { flash } = usePage().props || {}
  const isOwner = String(me?.id || '') === String(project?.owner_id || '')

  // -----------------------------
  // Filters (status / priority)
  // -----------------------------
  const [localFilters, setLocalFilters] = useState({
    status: filters?.status ?? '',
    priority: filters?.priority ?? '',
  })

  function applyFilters(next) {
    const status = (next?.status ?? localFilters.status) || undefined
    const priority = (next?.priority ?? localFilters.priority) || undefined
    router.get(
      `/projects/${project.id}`,
      { status, priority },
      { preserveState: true, replace: true, preserveScroll: true }
    )
  }

  // -----------------------------
  // Create Issue Modal + Form
  // -----------------------------
  const [createOpen, setCreateOpen] = useState(false)

  const createAssigneeOptions = useMemo(() => {
    const base = [{ id: '', name: 'Unassigned' }]
    const mine = me ? [{ id: String(me.id), name: `Assign to me (${me.name})` }] : []
    const rest = (assignees || [])
      .filter(a => !me || String(a.id) !== String(me.id))
      .map(a => ({ id: String(a.id), name: a.name }))
    return [...base, ...mine, ...rest]
  }, [assignees, me])

  const {
    data: form,
    setData: setForm,
    post: postIssue,
    processing: creating,
    errors: formErrors,
    reset: resetForm,
  } = useForm({
    title: '',
    description: '',
    status: 'todo',
    priority: 'medium',
    due_date: '',
    assignee_id: '',
  })

  function submitCreate(e) {
    e.preventDefault()
    postIssue(`/projects/${project.id}/issues`, {
      onSuccess: () => {
        resetForm('title', 'description', 'due_date', 'assignee_id')
        setCreateOpen(false)
        router.reload({ only: ['issues'] })
      },
      preserveScroll: true,
    })
  }

  // -----------------------------
  // Inline update helpers
  // -----------------------------
  function updateStatus(issueId, newStatus) {
    router.patch(
      `/projects/${project.id}/issues/${issueId}`,
      { status: newStatus },
      {
        preserveScroll: true,
        onSuccess: () => router.reload({ only: ['issues'] }),
      }
    )
  }

  function updatePriority(issueId, newPriority) {
    router.patch(
      `/projects/${project.id}/issues/${issueId}`,
      { priority: newPriority },
      {
        preserveScroll: true,
        onSuccess: () => router.reload({ only: ['issues'] }),
      }
    )
  }

  function updateAssignee(issueId, assigneeId) {
    router.patch(
      `/projects/${project.id}/issues/${issueId}`,
      { assignee_id: assigneeId || null },
      {
        preserveScroll: true,
        onSuccess: () => router.reload({ only: ['issues'] }),
      }
    )
  }

  // -----------------------------
  // Hover Preview (centered card)
  // -----------------------------
  const [hoveredId, setHoveredId] = useState(null)
  const [hoverOpen, setHoverOpen] = useState(false)
  const openTimer = useRef(null)
  const closeTimer = useRef(null)
  const OPEN_DELAY_MS = 160
  const CLOSE_DELAY_MS = 220

  const hoveredIssue = useMemo(
    () => (hoveredId ? issues.find(i => i.id === hoveredId) : null),
    [hoveredId, issues]
  )

  function clearTimers() {
    if (openTimer.current) {
      clearTimeout(openTimer.current)
      openTimer.current = null
    }
    if (closeTimer.current) {
      clearTimeout(closeTimer.current)
      closeTimer.current = null
    }
  }
  function startOpenHover(id) {
    clearTimers()
    setHoveredId(id)
    openTimer.current = setTimeout(() => {
      setHoverOpen(true)
      openTimer.current = null
    }, OPEN_DELAY_MS)
  }
  function requestCloseHover() {
    if (closeTimer.current) return
    closeTimer.current = setTimeout(() => {
      setHoverOpen(false)
      setHoveredId(null)
      closeTimer.current = null
    }, CLOSE_DELAY_MS)
  }
  function cancelCloseHover() {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current)
      closeTimer.current = null
    }
  }
  useEffect(() => clearTimers, [])

  // -----------------------------
  // Confirm Delete Dialog
  // -----------------------------
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [deleteBusy, setDeleteBusy] = useState(false)
  const [targetIssue, setTargetIssue] = useState(null)

  function requestDelete(issue) {
    setTargetIssue(issue)
    setConfirmOpen(true)
  }

  function confirmDelete() {
    if (!targetIssue) return
    setDeleteBusy(true)
    router.delete(`/projects/${project.id}/issues/${targetIssue.id}`, {
      preserveScroll: true,
      onSuccess: () => {
        setConfirmOpen(false)
        setTargetIssue(null)
        setDeleteBusy(false)
        router.reload({ only: ['issues'] })
      },
      onError: () => setDeleteBusy(false),
    })
  }

  return (
    <AuthenticatedLayout>
      <Head title={project?.name ? `${project.name} — Project` : 'Project'} />

      {/* Header */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-white">
            {project.name}{' '}
            <span className="text-white/50">({project.key})</span>
          </h1>
          {project?.community?.name && (
            <p className="mt-1 text-sm text-white/60">
              Community: <span className="font-medium text-white/80">{project.community.name}</span>
            </p>
          )}
        </div>

        <div className="flex gap-2">
          <Link href={route('projects.index')}>
            <Button variant="outline">← All Projects</Button>
          </Link>

          {isOwner && (
            <Button
              onClick={() => setCreateOpen(true)}
              className="!bg-gradient-to-r !from-cyan-400 !to-teal-400 !text-black hover:from-cyan-300 hover:to-teal-300"
            >
              + Create Issue
            </Button>
          )}
        </div>
      </div>

      {/* Flash */}
      {flash?.success && (
        <div className="mb-3 rounded-xl border border-emerald-400/30 bg-emerald-500/10 px-4 py-2 text-sm text-emerald-200">
          {flash.success}
        </div>
      )}
      {flash?.error && (
        <div className="mb-3 rounded-xl border border-rose-400/30 bg-rose-500/10 px-4 py-2 text-sm text-rose-200">
          {flash.error}
        </div>
      )}

      {/* Project Details */}
      <section className="mb-6 rounded-2xl border border-white/10 bg-[#0f1731] p-5 shadow">
        <h2 className="text-base font-semibold text-white">Details</h2>
        <div className="mt-2 text-sm text-white/80 whitespace-pre-wrap">
          {project.description || <span className="text-white/50">No description.</span>}
        </div>
      </section>

      {/* Filters */}
      <div className="mb-4 rounded-2xl border border-white/10 bg-[#0f1731] p-4 shadow">
        <div className="flex flex-wrap items-center gap-3 text-sm text-white/80">
          <label className="flex items-center gap-2">
            <span className="text-white/70">Status:</span>
            <select
              className="rounded border border-white/10 bg-white/5 px-2 py-1 text-white"
              value={localFilters.status}
              onChange={(e) => {
                const status = e.target.value
                setLocalFilters(s => ({ ...s, status }))
                applyFilters({ status })
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
              value={localFilters.priority}
              onChange={(e) => {
                const priority = e.target.value
                setLocalFilters(s => ({ ...s, priority }))
                applyFilters({ priority })
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

      {/* Issues List */}
      <section className="mb-8">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-base font-semibold text-white">Issues</h2>
        </div>

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
                    <h3 className="text-base font-medium text-white">
                      {/* Hover only on the key:title element */}
                      <button
                        type="button"
                        className="underline decoration-cyan-400/60 underline-offset-2 hover:text-cyan-200"
                        onMouseEnter={() => startOpenHover(i.id)}
                        onMouseLeave={requestCloseHover}
                        onFocus={() => startOpenHover(i.id)}
                        onBlur={requestCloseHover}
                        onClick={() => { setHoveredId(i.id); setHoverOpen(true) }}
                      >
                        {project.key}-{i.number}: {i.title}
                      </button>
                    </h3>

                    <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-white/80">
                      <StatusBadge status={i.status} />
                      <PriorityBadge priority={i.priority} />
                      {i.assignee?.name && (
                        <span className="text-xs text-white/70">
                          Assignee: <span className="text-white/90">{i.assignee.name}</span>
                        </span>
                      )}
                      <span className="text-xs text-white/50">
                        {new Date(i.created_at).toLocaleDateString()}
                      </span>
                    </div>

                    {/* Inline controls (status, priority, assignee) */}
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

                      {isOwner && (
                        <label className="flex items-center gap-2">
                          <span className="text-white/70">Assignee:</span>
                          <select
                            className="rounded border border-white/10 bg-white/5 px-2 py-1 text-white"
                            value={i.assignee_id ?? ''}
                            onChange={(e) => updateAssignee(i.id, e.target.value)}
                          >
                            <option className="bg-[#0f1731]" value="">Unassigned</option>
                            {me && (
                              <option className="bg-[#0f1731]" value={me.id}>
                                Assign to me ({me.name})
                              </option>
                            )}
                            {assignees
                              .filter(u => !me || String(u.id) !== String(me.id))
                              .map(u => (
                                <option key={u.id} value={u.id} className="bg-[#0f1731]">
                                  {u.name}
                                </option>
                              ))
                            }
                          </select>
                        </label>
                      )}
                    </div>
                  </div>

                  {isOwner && (
                    <button
                      onClick={() => requestDelete(i)}
                      className="h-8 rounded-md border border-rose-400/40 bg-rose-500/10 px-2.5 py-1 text-xs font-semibold text-rose-200 hover:bg-rose-500/20"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Center Hover Preview */}
      {hoverOpen && hoveredIssue && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onMouseEnter={cancelCloseHover}
          onMouseLeave={requestCloseHover}
        >
          {/* backdrop */}
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => { setHoverOpen(false); setHoveredId(null) }}
          />
          {/* card */}
          <div className="relative z-10 w-full max-w-xl rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.03] p-5 text-white shadow-2xl">
            <div className="mb-2 text-sm text-white/60">Preview</div>
            <h4 className="text-lg font-semibold">
              {project.key}-{hoveredIssue.number}: {hoveredIssue.title}
            </h4>

            <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-white/80">
              <StatusBadge status={hoveredIssue.status} />
              <PriorityBadge priority={hoveredIssue.priority} />
              {hoveredIssue.assignee?.name && (
                <span className="text-xs text-white/70">
                  Assignee: <span className="text-white/90">{hoveredIssue.assignee.name}</span>
                </span>
              )}
              <span className="text-xs text-white/50">
                Created: {new Date(hoveredIssue.created_at).toLocaleString()}
              </span>
              {hoveredIssue.due_date && (
                <span className="text-xs text-white/50">
                  Due: {new Date(hoveredIssue.due_date).toLocaleDateString()}
                </span>
              )}
            </div>

            <div className="mt-4 text-sm text-white/90 whitespace-pre-wrap">
              {hoveredIssue.description || <span className="text-white/50">No description.</span>}
            </div>

            <div className="mt-5 flex justify-end">
              <button
                className="rounded-md border border-white/15 bg-white/5 px-3 py-1.5 text-sm hover:border-cyan-400/40 hover:text-cyan-200"
                onClick={() => { setHoverOpen(false); setHoveredId(null) }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Issue Modal */}
      {isOwner && (
        <AnotherModal
          open={createOpen}
          onClose={() => setCreateOpen(false)}
          title="Create Issue"
          footer={(
            <>
              <button
                onClick={() => setCreateOpen(false)}
                className="rounded-md border border-white/15 bg-white/5 px-3 py-1.5 text-sm text-white hover:bg-white/10"
              >
                Cancel
              </button>
              <button
                onClick={submitCreate}
                disabled={creating}
                className="rounded-md bg-gradient-to-r from-cyan-400 to-teal-400 px-3 py-1.5 text-sm font-semibold text-black hover:from-cyan-300 hover:to-teal-300 disabled:opacity-60"
              >
                {creating ? 'Creating…' : 'Create Issue'}
              </button>
            </>
          )}
        >
          <form onSubmit={submitCreate} className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-white/80">Title</label>
              <input
                className="mt-1 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-white placeholder-white/30 outline-none focus:border-cyan-400/60"
                value={form.title}
                onChange={(e) => setForm('title', e.target.value)}
                placeholder="Fix navbar overlap on mobile"
              />
              {formErrors?.title && <p className="mt-1 text-sm text-rose-400">{formErrors.title}</p>}
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div>
                <label className="block text-sm font-medium text-white/80">Status</label>
                <select
                  className="mt-1 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-white outline-none focus:border-cyan-400/60"
                  value={form.status}
                  onChange={(e) => setForm('status', e.target.value)}
                >
                  <option className="bg-[#0f1731]" value="todo">todo</option>
                  <option className="bg-[#0f1731]" value="in_progress">in_progress</option>
                  <option className="bg-[#0f1731]" value="done">done</option>
                </select>
                {formErrors?.status && <p className="mt-1 text-sm text-rose-400">{formErrors.status}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-white/80">Priority</label>
                <select
                  className="mt-1 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-white outline-none focus:border-cyan-400/60"
                  value={form.priority}
                  onChange={(e) => setForm('priority', e.target.value)}
                >
                  <option className="bg-[#0f1731]" value="low">low</option>
                  <option className="bg-[#0f1731]" value="medium">medium</option>
                  <option className="bg-[#0f1731]" value="high">high</option>
                </select>
                {formErrors?.priority && <p className="mt-1 text-sm text-rose-400">{formErrors.priority}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-white/80">Due date (optional)</label>
                <input
                  type="date"
                  className="mt-1 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-white outline-none focus:border-cyan-400/60"
                  value={form.due_date}
                  onChange={(e) => setForm('due_date', e.target.value)}
                />
                {formErrors?.due_date && <p className="mt-1 text-sm text-rose-400">{formErrors.due_date}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-white/80">Assignee</label>
              <select
                className="mt-1 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-white outline-none focus:border-cyan-400/60"
                value={form.assignee_id}
                onChange={(e) => setForm('assignee_id', e.target.value)}
              >
                {createAssigneeOptions.map(opt => (
                  <option key={opt.id || 'none'} value={opt.id} className="bg-[#0f1731]">
                    {opt.name}
                  </option>
                ))}
              </select>
              {formErrors?.assignee_id && <p className="mt-1 text-sm text-rose-400">{formErrors.assignee_id}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-white/80">Description (optional)</label>
              <textarea
                rows={3}
                className="mt-1 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-white outline-none focus:border-cyan-400/60"
                value={form.description}
                onChange={(e) => setForm('description', e.target.value)}
                placeholder="Add more context for the issue…"
              />
              {formErrors?.description && <p className="mt-1 text-sm text-rose-400">{formErrors.description}</p>}
            </div>
          </form>
        </AnotherModal>
      )}

      {/* Delete confirmation dialog */}
      <ConfirmDialog
        open={confirmOpen}
        onClose={() => (!deleteBusy && setConfirmOpen(false))}
        title="Delete issue?"
        message={
          targetIssue
            ? `This will permanently delete ${project.key}-${targetIssue.number}: “${targetIssue.title}”.`
            : ''
        }
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
        onConfirm={confirmDelete}
        busy={deleteBusy}
      />
    </AuthenticatedLayout>
  )
}
