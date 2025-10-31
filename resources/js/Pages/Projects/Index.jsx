import { Head, Link, usePage, router } from '@inertiajs/react'
import { useState } from 'react'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import Button from '@/Components/Button'
import ConfirmDialog from '@/Components/ConfirmDialog' // 👈 the one you showed

export default function Index({ projects = [] }) {
  const { me } = usePage().props || {}
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [projectToDelete, setProjectToDelete] = useState(null)
  const [busy, setBusy] = useState(false)

  function askDelete(project) {
    setProjectToDelete(project)
    setConfirmOpen(true)
  }

  function doDelete() {
    if (!projectToDelete) return
    setBusy(true)
    router.delete(`/projects/${projectToDelete.id}`, {
      preserveScroll: true,
      onFinish: () => {
        setBusy(false)
        setConfirmOpen(false)
        setProjectToDelete(null)
      },
      // if your controller returns redirect()->back()
      // inertia will refresh the list
    })
  }

  return (
    <AuthenticatedLayout
      header={<h2 className="text-xl font-semibold text-white">Projects</h2>}
    >
      <Head title="Projects" />

      {projects.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-[#0f1731] p-6 text-white/70">
          You don’t have any projects yet.
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((p) => {
            const isOwner = me && String(me.id) === String(p.owner_id)
            return (
              <div
                key={p.id}
                className="flex flex-col rounded-2xl border border-white/10 bg-[#0f1731] p-5 shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-base font-semibold text-white">
                      {p.name}
                    </h3>
                    <p className="text-xs text-white/40">
                      {p.key ? `Key: ${p.key}` : 'No key'}
                    </p>
                  </div>

                  {/* delete btn only for owner */}
                  {isOwner && (
                    <button
                      onClick={() => askDelete(p)}
                      className="rounded-md border border-rose-400/40 bg-rose-500/10 px-2 py-1 text-xs font-semibold text-rose-200 hover:bg-rose-500/20"
                    >
                      Delete
                    </button>
                  )}
                </div>

                <p className="mt-3 line-clamp-3 text-sm text-white/65">
                  {p.description || 'No description.'}
                </p>

                <div className="mt-4 flex gap-2">
                  <Link href={`/projects/${p.id}`} className="flex-1">
                    <Button
                      variant="outline"
                      className="w-full border-white/20 text-white hover:border-cyan-400/60 hover:text-cyan-200"
                    >
                      Open
                    </Button>
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Confirm dialog for delete */}
      <ConfirmDialog
        open={confirmOpen}
        onClose={() => !busy && setConfirmOpen(false)}
        title="Delete this project?"
        message={
          projectToDelete
            ? `This will permanently delete “${projectToDelete.name}”. Issues under it will also go away.`
            : ''
        }
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
        onConfirm={doDelete}
        busy={busy}
      />
    </AuthenticatedLayout>
  )
}
