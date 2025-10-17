import AppLayout from '@/Layouts/AppLayout';
import Button from '@/Components/Button';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Show({ project }) {
  const { flash } = usePage().props;
  const [editing, setEditing] = useState(false);

  const { data, setData, patch, processing, errors, reset } = useForm({
    name: project.name,
    description: project.description ?? '',
  });

  function submit(e) {
    e.preventDefault();
    patch(`/projects/${project.id}`, {
      preserveScroll: true,
      onSuccess: () => setEditing(false),
    });
  }

  return (
    <AuthenticatedLayout>
      <Head title="Project-Details" />
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">
          {project.name} <span className="text-gray-500">({project.key})</span>
        </h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => setEditing(v => !v)}>
            {editing ? 'Close Editor' : 'Edit Project'}
          </Button>
          <Link href="/projects" className="text-sm underline text-indigo-700 hover:text-indigo-800">
              <Button>← Back to Projects</Button>
          </Link>
        </div>
      </div>

      {/* Details */}
      <section className="rounded-xl border bg-white p-5 shadow-sm space-y-2">
        {project.description ? (
          <p className="text-gray-700">{project.description}</p>
        ) : (
          <p className="text-gray-500 italic">No description yet.</p>
        )}

        {project.owner && (
          <p className="text-sm text-gray-700">
            Owner: <span className="font-medium">{project.owner.name}</span> ({project.owner.email})
          </p>
        )}

        <p className="text-xs text-gray-500">
          Created: {new Date(project.created_at).toLocaleString()}
        </p>
      </section>

      {/* Editor */}
      {editing && (
        <section className="rounded-xl border bg-white p-5 shadow-sm space-y-4">
          <h2 className="text-lg font-medium">Edit Project</h2>
          <form onSubmit={submit} className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium">Name (title)</label>
              <input
                className="mt-1 w-full rounded-lg border px-3 py-2"
                value={data.name}
                onChange={e => setData('name', e.target.value)}
              />
              {errors.name && <p className="text-sm text-rose-600 mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium">Description</label>
              <textarea
                className="mt-1 w-full rounded-lg border px-3 py-2"
                rows={3}
                value={data.description}
                onChange={e => setData('description', e.target.value)}
              />
              {errors.description && <p className="text-sm text-rose-600 mt-1">{errors.description}</p>}
            </div>

            <div className="flex items-center gap-2">
              <Button type="submit" disabled={processing}>
                {processing ? 'Saving…' : 'Save Changes'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => { reset(); setEditing(false); }}
              >
                Cancel
              </Button>
            </div>
          </form>
        </section>
      )}

      {/* Issues link */}
      <section className="rounded-xl border bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium">Issues</h2>
          <Link href={`/projects/${project.id}/issues`}>
            <Button>View &amp; Create Issues</Button>
          </Link>
        </div>
        <p className="text-gray-500 mt-3">Manage this project’s issues on the dedicated page.</p>
      </section>
    </AuthenticatedLayout>
  );
}
