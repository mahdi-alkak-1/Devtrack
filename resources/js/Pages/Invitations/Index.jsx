import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import Button from '@/Components/Button'
import { Head, router, usePage } from '@inertiajs/react'

export default function Index({ pending }) {
  const { me, flash } = usePage().props

  function respond(communityId, action) {
    if (!me?.id) return alert('Missing current user id.')
    router.patch(
      `/communities/${communityId}/members/${me.id}`,
      { action },
      {
        preserveScroll: true,
        onSuccess: () => router.reload({ only: ['pending'] }),
      },
    )
  }

  return (
    <AuthenticatedLayout>
      <Head title="Invitations" />

      <div className="mb-4">
        <h1 className="text-xl font-semibold text-white">Your Invitations</h1>
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

      {pending.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-[#0f1731] p-6 text-white/70 shadow">
          You have no pending invitations.
        </div>
      ) : (
        <ul className="grid gap-4 md:grid-cols-2">
          {pending.map((c) => (
            <li key={c.id} className="rounded-2xl border border-white/10 bg-[#0f1731] p-5 shadow">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-sm text-white/60">Community</div>
                  <div className="text-base font-medium text-white">{c.name}</div>

                  <div className="mt-2 text-sm text-white/80">
                    Invited as: <span className="font-medium">{c.role ?? 'Member'}</span>
                  </div>
                  {c.owner?.name && (
                    <div className="text-sm text-white/70">
                      Owner: {c.owner.name} {c.owner.email ? `(${c.owner.email})` : ''}
                    </div>
                  )}
                  <div className="mt-2 text-xs text-white/50">
                    Created: {new Date(c.created_at).toLocaleString()}
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <Button
                    className="px-3 py-1.5"
                    onClick={() => respond(c.id, 'accept')}
                  >
                    Accept
                  </Button>
                  <Button
                    variant="danger"
                    className="px-3 py-1.5"
                    onClick={() => respond(c.id, 'reject')}
                  >
                    Reject
                  </Button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </AuthenticatedLayout>
  )
}
