import AppLayout from '@/Layouts/AppLayout';
import Button from '@/Components/Button';
import Badge from '@/Components/Badge';
import { Head, Link, useForm, usePage, router } from '@inertiajs/react';
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

export default function Index({ project, issues, me, filters }) {
const { flash } = usePage().props;

// Create form state
const { data, setData, post, processing, errors, reset } = useForm({
title: '',
description: '',
status: 'todo',
priority: 'medium',
due_date: '',
assignee_id: '',
});

function submit(e) {
e.preventDefault();
post(`/projects/${project.id}/issues`, {
onSuccess: () => reset('title', 'description', 'due_date', 'assignee_id'),
preserveScroll: true,
});
}

// Inline updates
function updateStatus(issueId, newStatus) {
router.patch(
`/projects/${project.id}/issues/${issueId}`,
{ status: newStatus },
{ preserveScroll: true }
);
}
function updatePriority(issueId, newPriority) {
router.patch(
`/projects/${project.id}/issues/${issueId}`,
{ priority: newPriority },
{ preserveScroll: true }
);
}
function destroyIssue(issueId) {
if (!confirm('Delete this issue?')) return;
router.delete(`/projects/${project.id}/issues/${issueId}`, { preserveScroll: true });
}

return (
<AuthenticatedLayout>
  <Head title="Issues" />
    {/* Header */}
    <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">
           {project.name} <span className="text-gray-500">({project.key})</span> – Issues
        </h1>
        <Link href={`/projects/${project.id}`} className="text-sm underline text-indigo-700 hover:text-indigo-800">
        ← Back to Project
        </Link>
    </div>

    {/* Filters */}
    <div className="rounded-xl border bg-white p-4 shadow-sm">
        <div className="flex flex-wrap items-center gap-3">
            <label className="text-sm text-gray-700 flex items-center gap-2">
                <span>Status:</span>
                <select className="rounded border px-2 py-1 text-sm" value={filters?.status ?? '' } onChange={(e)=> {
                    const s = e.target.value || undefined;
                    const p = filters?.priority || undefined;
                    router.get(
                    `/projects/${project.id}/issues`,
                    { status: s, priority: p },
                    { preserveState: true, replace: true, preserveScroll: true }
                    );
                    }}
                    >
                    <option value="">All</option>
                    <option value="todo">todo</option>
                    <option value="in_progress">in_progress</option>
                    <option value="done">done</option>
                </select>
            </label>

            <label className="text-sm text-gray-700 flex items-center gap-2">
                <span>Priority:</span>
                <select className="rounded border px-2 py-1 text-sm" value={filters?.priority ?? '' } onChange={(e)=> {
                    const p = e.target.value || undefined;
                    const s = filters?.status || undefined;
                    router.get(
                    `/projects/${project.id}/issues`,
                    { status: s, priority: p },
                    { preserveState: true, replace: true, preserveScroll: true }
                    );
                    }}
                    >
                    <option value="">All</option>
                    <option value="low">low</option>
                    <option value="medium">medium</option>
                    <option value="high">high</option>
                </select>
            </label>
        </div>
    </div>

    {/* Create Issue */}
    <section className="rounded-xl border bg-white p-5 shadow-sm">
        <h2 className="text-lg font-medium mb-4">Create Issue</h2>
        <form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
                <label className="block text-sm font-medium">Title</label>
                <input className="mt-1 w-full rounded-lg border px-3 py-2" value={data.title} onChange={(e)=>
                setData('title', e.target.value)}
                placeholder="Fix navbar overlap on mobile"
                />
                {errors.title && <p className="text-sm text-rose-600 mt-1">{errors.title}</p>}
            </div>

            <div>
                <label className="block text-sm font-medium">Status</label>
                <select className="mt-1 w-full rounded-lg border px-3 py-2" value={data.status} onChange={(e)=>
                    setData('status', e.target.value)}
                    >
                    <option value="todo">todo</option>
                    <option value="in_progress">in_progress</option>
                    <option value="done">done</option>
                </select>
                {errors.status && <p className="text-sm text-rose-600 mt-1">{errors.status}</p>}
            </div>

            <div>
                <label className="block text-sm font-medium">Priority</label>
                <select className="mt-1 w-full rounded-lg border px-3 py-2" value={data.priority} onChange={(e)=>
                    setData('priority', e.target.value)}
                    >
                    <option value="low">low</option>
                    <option value="medium">medium</option>
                    <option value="high">high</option>
                </select>
                {errors.priority && <p className="text-sm text-rose-600 mt-1">{errors.priority}</p>}
            </div>

            <div>
                <label className="block text-sm font-medium">Due date (optional)</label>
                <input type="date" className="mt-1 w-full rounded-lg border px-3 py-2" value={data.due_date}
                    onChange={(e)=> setData('due_date', e.target.value)}
                />
                {errors.due_date && <p className="text-sm text-rose-600 mt-1">{errors.due_date}</p>}
            </div>

            <div className="md:col-span-2">
                <label className="block text-sm font-medium">Description (optional)</label>
                <textarea className="mt-1 w-full rounded-lg border px-3 py-2" value={data.description} onChange={(e)=> setData('description', e.target.value)}
              rows={3}
            />
            {errors.description && <p className="text-sm text-rose-600 mt-1">{errors.description}</p>}
          </div>

          {me && (
            <div>
              <label className="block text-sm font-medium">Assignee</label>
              <select
                className="mt-1 w-full rounded-lg border px-3 py-2"
                value={data.assignee_id}
                onChange={e => setData('assignee_id', e.target.value)}
              >
                <option value="">Unassigned</option>
                <option value={me.id}>Assign to me ({me.name})</option>
              </select>
              {errors.assignee_id && <p className="text-sm text-rose-600 mt-1">{errors.assignee_id}</p>}
            </div>
          )}

          <div className="md:col-span-2">
            <Button type="submit" disabled={processing}>
              {processing ? 'Creating…' : 'Create Issue'}
            </Button>
          </div>
        </form>
      </section>

      {/* List */}
      {issues.length === 0 ? (
        <p className="text-gray-600">No issues yet.</p>
      ) : (
        <ul className="divide-y divide-gray-200 overflow-hidden rounded-xl border bg-white shadow-sm">
          {issues.map(i => (
            <li key={i.id} className="p-4">
              {/* Row 1: title + delete */}
              <div className="flex items-start justify-between">
                <h2 className="text-lg font-medium">
                  <Link
                    href={`/projects/${project.id}/issues/${i.id}`}
                    className="underline decoration-indigo-600 underline-offset-2 hover:text-indigo-800"
                  >
                    {project.key}-{i.number}: {i.title}
                  </Link>
                </h2>
                <Button variant="danger" onClick={() => destroyIssue(i.id)}>
                  Delete
                </Button>
              </div>

              {/* Row 2: badges, controls, date */}
              <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-gray-700">
                <StatusBadge status={i.status} />
                <PriorityBadge priority={i.priority} />

                <label className="ml-2 flex items-center gap-2">
                  <span>Status:</span>
                  <select
                    className="rounded border px-2 py-1"
                    value={i.status}
                    onChange={(e) => updateStatus(i.id, e.target.value)}
                  >
                    <option value="todo">todo</option>
                    <option value="in_progress">in_progress</option>
                    <option value="done">done</option>
                  </select>
                </label>

                <label className="flex items-center gap-2">
                  <span>Priority:</span>
                  <select
                    className="rounded border px-2 py-1"
                    value={i.priority}
                    onChange={(e) => updatePriority(i.id, e.target.value)}
                  >
                    <option value="low">low</option>
                    <option value="medium">medium</option>
                    <option value="high">high</option>
                  </select>
                </label>

                <span className="ml-auto text-xs text-gray-500">
                  {new Date(i.created_at).toLocaleDateString()}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </AuthenticatedLayout>
  );
}
