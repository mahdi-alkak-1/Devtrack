import Button from '@/Components/Button'
import { Head, Link, useForm } from '@inertiajs/react'
import { useState } from 'react'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'

export default function Show({ project }) {
  const [editing, setEditing] = useState(false)

  const { data, setData, patch, processing, errors, reset } = useForm({
    name: project.name,
    description: project.description ?? '',
  })

  function submit(e) {
    e.preventDefault()
    patch(`/projects/${project.id}`, {
      preserveScroll: true,
      onSuccess: () => setEditing(false),
    })
  }

  return (
    <AuthenticatedLayout>
      <Head title={`${project.name} · Project`} />

      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-white">
          {project.name}{' '}
          <span className="text-white/50">({project.key})</span>
        </h1>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => setEditing(v => !v)}
            className="border-white/20 text-white hover:border-cyan-400/50 hover:text-cyan-200"
          >
            {editing ? 'Close Editor' : 'Edit Project'}
          </Button>
          <Link href="/projects">
            <Button variant="outline" className="border-white/20 text-white hover:border-cyan-400/50 hover:text-cyan-200">
              ← Back to Projects
            </Button>
          </Link>
        </div>
      </div>

      {/* Details */}
      <section className="mb-4 rounded-2xl border border-white/10 bg-[#0f1731] p-6 shadow">
        {project.description ? (
          <p className="text-white/80">{project.description}</p>
        ) : (
          <p className="italic text-white/50">No description yet.</p>
        )}

        {project.owner && (
          <p className="mt-3 text-sm text-white/70">
            Owner:{' '}
            <span className="font-medium text-white/90">{project.owner.name}</span> ({project.owner.email})
          </p>
        )}

        <p className="mt-1 text-xs text-white/40">
          Created: {new Date(project.created_at).toLocaleString()}
        </p>
      </section>

      {/* Editor */}
      {editing && (
        <section className="mb-4 rounded-2xl border border-white/10 bg-[#0f1731] p-6 shadow">
          <h2 className="mb-3 text-base font-semibold text-white">Edit Project</h2>
          <form onSubmit={submit} className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-white/80">Name</label>
              <input
                className="mt-1 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-white outline-none focus:border-cyan-400/60"
                value={data.name}
                onChange={e => setData('name', e.target.value)}
              />
              {errors.name && <p className="mt-1 text-sm text-rose-400">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-white/80">Description</label>
              <textarea
                rows={4}
                className="mt-1 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-white outline-none focus:border-cyan-400/60"
                value={data.description}
                onChange={e => setData('description', e.target.value)}
              />
              {errors.description && <p className="mt-1 text-sm text-rose-400">{errors.description}</p>}
            </div>

            <div className="flex items-center gap-2">
              <Button
                type="submit"
                disabled={processing}
                className="!bg-gradient-to-r !from-cyan-400 !to-teal-400 !text-black hover:from-cyan-300 hover:to-teal-300"
              >
                {processing ? 'Saving…' : 'Save Changes'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => { reset(); setEditing(false) }}
                className="border-white/20 text-white hover:border-rose-400/60 hover:text-rose-200"
              >
                Cancel
              </Button>
            </div>
          </form>
        </section>
      )}

      {/* Issues link */}
      <section className="rounded-2xl border border-white/10 bg-[#0f1731] p-6 shadow">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-white">Issues</h2>
          <Link href={`/projects/${project.id}/issues`}>
            <Button className="!bg-gradient-to-r !from-cyan-400 !to-teal-400 !text-black hover:from-cyan-300 hover:to-teal-300">
              View &amp; Create Issues
            </Button>
          </Link>
        </div>
        <p className="mt-3 text-sm text-white/60">Manage this project’s issues on the dedicated page.</p>
      </section>
    </AuthenticatedLayout>
  )
}
