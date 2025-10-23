// resources/js/Layouts/AuthenticatedLayout.jsx
import Dropdown from '@/Components/Dropdown'
import ResponsiveNavLink from '@/Components/ResponsiveNavLink'
import { Link, router, usePage } from '@inertiajs/react'
import { useState } from 'react'

export default function AuthenticatedLayout({ header, children }) {
  const props = usePage().props || {}
  const {
    auth,
    me,
    invites = { pendingCount: 0, list: [] },
    notifications = { unreadCount: 0, list: [] },
  } = props

  // Panels & drawers
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const [showInvitesPanel, setShowInvitesPanel] = useState(false)
  const [showNotifsPanel, setShowNotifsPanel] = useState(false)

  function respond(communityId, action) {
    if (!me?.id) return
    router.patch(`/communities/${communityId}/members/${me.id}`, { action }, {
      preserveScroll: true,
      onSuccess: () => router.reload({ only: ['invites'] }),
    })
  }

  function openNotif(n) {
    setShowNotifsPanel(false)
    router.post(`/notifications/${n.id}/read`, {}, { preserveScroll: true })
  }

  // Plain helper (no hooks inside functions)
  const initials = (name = '') =>
    (name.trim().split(/\s+/).slice(0, 2).map(s => s[0]?.toUpperCase()).join('')) || 'DT'

  // Relative time
  const fmtRelative = (ts) => {
    try {
      const rtf = new Intl.RelativeTimeFormat(undefined, { numeric: 'auto' })
      const diffMs = new Date(ts) - new Date()
      const diffMin = Math.round(diffMs / 60000)
      const abs = Math.abs(diffMin)
      if (abs < 60) return rtf.format(diffMin, 'minute')
      const diffHr = Math.round(diffMin / 60)
      if (Math.abs(diffHr) < 24) return rtf.format(diffHr, 'hour')
      const diffDay = Math.round(diffHr / 24)
      return rtf.format(diffDay, 'day')
    } catch {
      return new Date(ts).toLocaleString()
    }
  }

  return (
    // 💡 Make the whole page a flex column so footer sticks to bottom
    <div className="min-h-screen flex flex-col bg-[#0b1020] text-gray-100">
      {/* Glow background */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute left-1/2 top-[-200px] h-[480px] w-[480px] -translate-x-1/2 rounded-full bg-cyan-500/20 blur-3xl" />
        <div className="absolute bottom-[-200px] right-[-100px] h-[420px] w-[420px] rounded-full bg-teal-500/10 blur-3xl" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-white/10 bg-[#0d1328]/70 backdrop-blur-md">
        <nav className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 sm:px-6">
          {/* Brand */}
          <Link href="/dashboard" className="group hidden items-center gap-2 rounded px-2 py-1.5 sm:flex">
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500 to-teal-500 text-black shadow">DT</span>
            <span className="text-sm font-semibold tracking-tight text-white/90 group-hover:text-white">DevTrack</span>
          </Link>

          {/* Invites trigger */}
          <button
            type="button"
            onClick={() => setShowInvitesPanel(s => !s)}
            className="inline-flex items-center justify-center rounded-md p-2 text-white/80 hover:bg-white/10"
            aria-label="Invitations"
            title="Invitations"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M4 6h16M4 12h10" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="18" cy="12" r="2" />
              <path d="M4 18h8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          {invites?.pendingCount > 0 && (
            <span className="rounded-full bg-rose-500/90 px-1.5 py-0.5 text-[10px] font-semibold text-white shadow">
              {invites.pendingCount}
            </span>
          )}

          {/* Main nav (desktop) */}
          <div className="ml-2 hidden items-center gap-1.5 text-sm sm:flex">
            <Link href="/dashboard" className="rounded-md px-3 py-2 text-white/80 hover:bg-white/10 hover:text-white">Dashboard</Link>
            <Link href="/projects" className="rounded-md px-3 py-2 text-white/80 hover:bg-white/10 hover:text-white">Projects</Link>
            <Link href="/communities" className="rounded-md px-3 py-2 text-white/80 hover:bg-white/10 hover:text-white">Communities</Link>
            <Link href="/my-work" className="rounded-md px-3 py-2 text-white/80 hover:bg-white/10 hover:text-white">My Work</Link>
          </div>

          <div className="mr-auto flex-1" />

          {/* Bell */}
          <button
            onClick={() => setShowNotifsPanel(s => !s)}
            className="relative rounded-md p-2 text-white/80 hover:bg-white/10"
            aria-label="Notifications"
            title="Notifications"
          >
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 17h5l-1.4-1.4A2 2 0 0 1 18 14.2V11a6 6 0 10-12 0v3.2a2 2 0 0 1-.6 1.4L4 17h5" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
            </svg>
            {notifications?.unreadCount > 0 && (
              <span className="absolute -right-1 -top-1 rounded-full bg-amber-400 px-1.5 text-[10px] font-semibold text-black">
                {notifications.unreadCount}
              </span>
            )}
          </button>

          {/* User */}
          {auth?.user && (
            <div className="hidden items-center gap-2 sm:flex">
              <span className="text-sm font-medium text-white/90">{auth.user.name}</span>
              <Dropdown>
                <Dropdown.Trigger>
                  <span className="inline-flex rounded-md">
                    <button className="inline-flex items-center rounded-md border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-white/80 shadow hover:bg-white/10">
                      Menu
                      <svg className="ml-2 h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.25a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </span>
                </Dropdown.Trigger>
                <Dropdown.Content className="rounded-md bg-[#0f1731] py-1 shadow-lg ring-1 ring-white/10">
                  <Dropdown.Link href="/profile" className="block px-4 py-2 text-sm text-white/80 hover:bg-white/5">Profile</Dropdown.Link>
                  <Dropdown.Link href="/logout" method="post" as="button" className="block px-4 py-2 text-sm text-white/80 hover:bg-white/5">Log Out</Dropdown.Link>
                </Dropdown.Content>
              </Dropdown>
            </div>
          )}

          {/* Hamburger (mobile) */}
          <div className="-mr-2 ml-1 flex items-center sm:hidden">
            <button
              onClick={() => setMobileNavOpen(true)}
              className="group relative h-10 w-10 rounded-md p-2 text-white/85 hover:bg-white/10"
              aria-label="Open menu"
            >
              <span className={`absolute left-1/2 top-[11px] h-[2px] w-5 -translate-x-1/2 transform bg-white transition-all duration-300 ${mobileNavOpen ? 'translate-y-[3px] rotate-45' : ''}`}/>
              <span className={`absolute left-1/2 top-[17px] h-[2px] w-5 -translate-x-1/2 transform bg-white transition-all duration-300 ${mobileNavOpen ? '-translate-y-[3px] -rotate-45' : ''}`}/>
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile nav drawer */}
      {mobileNavOpen && (
        <>
          <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm" onClick={() => setMobileNavOpen(false)} />
          <aside className="fixed left-0 top-0 z-50 h-full w-[300px]">
            <div className="flex h-full flex-col overflow-hidden rounded-r-2xl border-r border-white/10 bg-[#0e1630]/90 shadow-[0_10px_40px_rgba(0,0,0,0.5)] backdrop-blur-xl">
              <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
                <div className="flex items-center gap-2">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500 to-teal-500 text-black">DT</span>
                  <span className="text-sm font-semibold text-white/90">DevTrack</span>
                </div>
                <button
                  className="rounded p-1 text-white/70 hover:bg-white/10"
                  onClick={() => setMobileNavOpen(false)}
                  aria-label="Close menu"
                >
                  ✕
                </button>
              </div>

              <nav className="flex-1 space-y-1 p-3">
                <ResponsiveNavLink href="/dashboard" className="block rounded-lg px-3 py-2 text-white/85 hover:bg-white/10">Dashboard</ResponsiveNavLink>
                <ResponsiveNavLink href="/projects" className="block rounded-lg px-3 py-2 text-white/85 hover:bg-white/10">Projects</ResponsiveNavLink>
                <ResponsiveNavLink href="/communities" className="block rounded-lg px-3 py-2 text-white/85 hover:bg-white/10">Communities</ResponsiveNavLink>
                <ResponsiveNavLink href="/my-work" className="block rounded-lg px-3 py-2 text-white/85 hover:bg-white/10">My Work</ResponsiveNavLink>
                <div className="my-2 h-px bg-white/10" />
                <div className="px-3">
                  <div className="text-xs uppercase tracking-wide text-white/40">Account</div>
                </div>
                <ResponsiveNavLink href="/profile" className="block rounded-lg px-3 py-2 text-white/85 hover:bg-white/10">Profile</ResponsiveNavLink>
                <ResponsiveNavLink href="/logout" method="post" as="button" className="block rounded-lg px-3 py-2 text-white/85 hover:bg-white/10">Log Out</ResponsiveNavLink>
              </nav>
            </div>
          </aside>
        </>
      )}

      {/* Notifications panel */}
      {showNotifsPanel && (
        <>
          <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm" onClick={() => setShowNotifsPanel(false)} />
          <aside className="fixed right-0 top-0 z-50 h-full w-[420px]">
            <div className="flex h-full flex-col overflow-hidden rounded-l-2xl border-l border-white/10 bg-[#0e1630]/90 shadow-[0_10px_40px_rgba(0,0,0,0.5)] backdrop-blur-xl">
              <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
                <div className="flex items-center gap-2">
                  <div className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500/70 to-teal-500/70 text-black shadow">
                    <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" fill="none" strokeWidth="2">
                      <path d="M15 17h5l-1.4-1.4A2 2 0 0 1 18 14.2V11a6 6 0 10-12 0v3.2a2 2 0 0 1-.6 1.4L4 17h5" />
                      <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white">Notifications</h3>
                    <p className="text-[11px] text-white/50">{notifications?.unreadCount ?? 0} unread</p>
                  </div>
                </div>
                <button className="rounded p-1 text-white/70 hover:bg-white/10" onClick={() => setShowNotifsPanel(false)} aria-label="Close">✕</button>
              </div>

              <div className="flex-1 overflow-y-auto p-3 sm:p-4">
                {notifications?.list?.length ? (
                  <ul className="space-y-2">
                    {notifications.list.map(n => {
                      const unread = !n.read_at
                      return (
                        <li key={n.id} className="group rounded-xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.03] p-3 shadow-sm transition hover:border-cyan-400/30 hover:shadow-md">
                          <div className="flex items-start gap-3">
                            <div className="mt-1">
                              <span className={`block h-2.5 w-2.5 rounded-full ${unread ? 'bg-cyan-400 shadow-[0_0_0_3px_rgba(34,211,238,0.15)]' : 'bg-white/30'}`} title={unread ? 'Unread' : 'Read'} />
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center justify-between gap-2">
                                <span className="truncate text-sm text-white/90">{n.title || 'Notification'}</span>
                                <span className="shrink-0 text-[11px] text-white/50">{fmtRelative(n.created_at)}</span>
                              </div>
                              <p className="mt-0.5 line-clamp-3 text-xs leading-5 text-white/70">{n.message}</p>
                              <div className="mt-2">
                                <button onClick={() => openNotif(n)} className="rounded-md bg-gradient-to-r from-cyan-400 to-teal-400 px-3 py-1.5 text-[11px] font-medium text-black transition hover:from-cyan-300 hover:to-teal-300">
                                  Open
                                </button>
                              </div>
                            </div>
                          </div>
                        </li>
                      )
                    })}
                  </ul>
                ) : (
                  <div className="mt-10 grid place-items-center text-center">
                    <div className="rounded-2xl border border-white/10 bg-white/5 px-6 py-10 shadow-sm">
                      <div className="mx-auto mb-3 inline-flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500/30 to-teal-500/30 text-white">🔔</div>
                      <h4 className="text-sm font-semibold text-white">You’re all caught up</h4>
                      <p className="mt-1 text-xs text-white/60">No notifications right now.</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </aside>
        </>
      )}

      {/* Invitations panel */}
      {showInvitesPanel && (
        <>
          <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm" onClick={() => setShowInvitesPanel(false)} />
          <aside className="fixed left-0 top-0 z-50 h-full w-[380px]">
            <div className="flex h-full flex-col overflow-hidden rounded-r-2xl border-r border-white/10 bg-[#0e1630]/90 shadow-[0_10px_40px_rgba(0,0,0,0.5)] backdrop-blur-xl">
              <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
                <div className="flex items-center gap-2">
                  <div className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-rose-500/70 to-orange-500/70 text-white shadow">💌</div>
                  <div>
                    <h3 className="text-sm font-semibold text-white">Invitations</h3>
                    <p className="text-[11px] text-white/50">{invites?.pendingCount ?? 0} pending</p>
                  </div>
                </div>
                <button className="rounded p-1 text-white/70 hover:bg-white/10" onClick={() => setShowInvitesPanel(false)} aria-label="Close">✕</button>
              </div>

              <div className="flex-1 overflow-y-auto p-3 sm:p-4">
                {invites?.list?.length ? (
                  <ul className="space-y-3">
                    {invites.list.map(c => (
                      <li key={c.id} className="rounded-xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.03] p-3 shadow-sm hover:border-rose-300/30 transition">
                        <div className="flex items-start gap-3">
                          <div className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-rose-400/40 to-orange-400/40 text-[12px] font-semibold text-white">
                            {initials(c.owner?.name || 'CM')}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between gap-2">
                              <div className="truncate text-sm font-medium text-white/90">{c.name}</div>
                              {c.created_at && <div className="shrink-0 text-[11px] text-white/50">{new Date(c.created_at).toLocaleDateString()}</div>}
                            </div>
                            {c.owner?.name && (
                              <div className="mt-0.5 text-xs text-white/60">
                                Owner: <span className="text-white/80">{c.owner.name}</span>{c.owner.email ? <span> · {c.owner.email}</span> : null}
                              </div>
                            )}
                            {c.role && (
                              <div className="mt-0.5 text-xs text-white/60">
                                Role: <span className="text-white/80">{c.role}</span>
                              </div>
                            )}
                            <div className="mt-3 flex gap-2">
                              <button onClick={() => respond(c.id, 'accept')} className="flex-1 rounded-md bg-gradient-to-r from-emerald-400 to-lime-400 px-3 py-1.5 text-xs font-semibold text-black shadow hover:from-emerald-300 hover:to-lime-300">Accept</button>
                              <button onClick={() => respond(c.id, 'reject')} className="flex-1 rounded-md border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-white/85 hover:bg-white/10">Dismiss</button>
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="mt-10 grid place-items-center text-center">
                    <div className="rounded-2xl border border-white/10 bg-white/5 px-6 py-10 shadow-sm">
                      <div className="mx-auto mb-3 inline-flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-rose-500/30 to-orange-500/30 text-white">📭</div>
                      <h4 className="text-sm font-semibold text-white">No pending invitations</h4>
                      <p className="mt-1 text-xs text-white/60">You’ll see new invites here.</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </aside>
        </>
      )}

      {/* Optional page header */}
      {header && (
        <div className="border-b border-white/10 bg-[#0f1731]">
          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">{header}</div>
        </div>
      )}

      {/* Main content grows to push footer down */}
      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
          {children}
        </div>
      </main>

      {/* Footer pinned to bottom when content is short */}
      <footer className="mt-8 border-t border-white/10 bg-[#0f1731]/80">
        <div className="mx-auto max-w-7xl px-4 py-6 text-center text-xs text-white/60 sm:px-6">
          © {new Date().getFullYear()} DevTrack
        </div>
      </footer>
    </div>
  )
}
