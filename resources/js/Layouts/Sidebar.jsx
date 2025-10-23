// resources/js/Layouts/Sidebar.jsx
import { router, usePage, Link } from '@inertiajs/react'

export default function Sidebar() {
  const { me, invites } = usePage().props

  function respond(communityId, action) {
    if (!me?.id) return
    router.patch(
      `/communities/${communityId}/members/${me.id}`,
      { action },
      {
        preserveScroll: true,
        // Only refresh the "invites" shared prop (HandleInertiaRequests::share)
        onSuccess: () => router.reload({ only: ['invites'] }),
      }
    )
  }

  return (
    <aside className="space-y-4">
      {/* Example: main navigation */}
      <nav className="rounded-xl border bg-white p-3 shadow-sm">
        <div className="mb-2 text-xs font-semibold uppercase text-gray-500">Navigation</div>
        <ul className="space-y-1 text-sm">
          <li><Link href="/dashboard" className="block rounded px-2 py-1 hover:bg-gray-50">Dashboard</Link></li>
          <li><Link href="/projects" className="block rounded px-2 py-1 hover:bg-gray-50">Projects</Link></li>
          <li><Link href="/communities" className="block rounded px-2 py-1 hover:bg-gray-50">Communities</Link></li>
        </ul>
      </nav>

      {/* Invitations widget (only if there are pending) */}
      {invites?.pendingCount > 0 && (
        <div className="rounded-xl border bg-white p-3 shadow-sm">
          <div className="mb-2 flex items-center justify-between">
            <div className="text-sm font-medium">Invitations</div>
            <span className="rounded-full bg-rose-600 px-2 py-0.5 text-xs text-white">
              {invites.pendingCount}
            </span>
          </div>

          <ul className="space-y-2">
            {invites.List?.map((c) => (
              <li key={c.id} className="flex items-center justify-between gap-2">
                <span className="truncate text-sm">{c.name}</span>
                <div className="flex gap-1">
                  <button
                    onClick={() => respond(c.id, 'accept')}
                    className="rounded bg-emerald-600 px-2 py-1 text-xs text-white hover:bg-emerald-700"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => respond(c.id, 'reject')}
                    className="rounded bg-rose-600 px-2 py-1 text-xs text-white hover:bg-rose-700"
                  >
                    Reject
                  </button>
                </div>
              </li>
            ))}
          </ul>

          {/* Optional: link to full page if you keep it */}
          {/* <div className="mt-2 text-right">
            <Link href="/invitations" className="text-xs text-gray-500 underline">See all</Link>
          </div> */}
        </div>
      )}
    </aside>
  )
}
