// resources/js/Pages/Communities/Index.jsx
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import Button from '@/Components/Button'
import ConfirmDialog from '@/Components/ConfirmDialog'
import { Head, Link, useForm, usePage, router } from '@inertiajs/react'
import { useMemo, useState } from 'react'

export default function Index({ communities = [] }) {
  const { auth, flash } = usePage().props

  // Decide ownership (prefer is_owner from API, else compare owner_id)
  const isOwner = (c) =>
    typeof c?.is_owner === 'boolean'
      ? c.is_owner
      : (c?.owner_id && auth?.user?.id && c.owner_id === auth.user.id) || false

  // Tabs + search
  const [tab, setTab] = useState('owned')
  const [query, setQuery] = useState('')
  const owned  = useMemo(() => communities.filter(c => isOwner(c)), [communities])
  const joined = useMemo(() => communities.filter(c => !isOwner(c)), [communities])
  const filterList = (list) => {
    const q = query.trim().toLowerCase()
    if (!q) return list
    return list.filter(c =>
      c?.name?.toLowerCase().includes(q) ||
      String(c?.id || '').toLowerCase().includes(q)
    )
  }
  const visible = tab === 'owned' ? filterList(owned) : filterList(joined)

  // Expanded members panels per-community (owners only)
  const [expanded, setExpanded] = useState(() => new Set())
  const toggleExpand = (id) => {
    setExpanded(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  // ----- Confirm Dialog (reusable) -----
  const [confirm, setConfirm] = useState({
    open: false,
    title: '',
    message: '',
    confirmText: 'Confirm',
    variant: 'danger', // 'danger' | 'primary'
    busy: false,
    onConfirm: null,
  })

  function openConfirm(opts) {
    setConfirm((c) => ({ ...c, ...opts, open: true }))
  }
  function closeConfirm() {
    setConfirm((c) => ({ ...c, open: false, busy: false, onConfirm: null }))
  }
  async function runAndClose(fn) {
    try {
      setConfirm((c) => ({ ...c, busy: true }))
      await fn()
    } finally {
      closeConfirm()
    }
  }

  // Remove member (owner)
  function removeMember(communityId, userId) {
    openConfirm({
      title: 'Remove member?',
      message: 'This will immediately revoke their access to this community.',
      confirmText: 'Remove',
      variant: 'danger',
      onConfirm: () =>
        runAndClose(() =>
          router.delete(`/communities/${communityId}/members/${userId}`, {
            preserveScroll: true,
            onSuccess: () => router.reload({ only: ['communities'] }),
          })
        ),
    })
  }

  // Leave community (joined / non-owner)
  function leaveCommunity(communityId) {
    openConfirm({
      title: 'Leave this community?',
      message: 'You will lose access to content shared with this community.',
      confirmText: 'Leave',
      variant: 'danger',
      onConfirm: () =>
        runAndClose(() =>
          router.delete(`/communities/${communityId}/members/${auth.user.id}`, {
            preserveScroll: true,
            onSuccess: () => router.reload({ only: ['communities'] }),
          })
        ),
    })
  }

  // Delete community (owner)
  function deleteCommunity(communityId) {
    openConfirm({
      title: 'Delete community?',
      message: 'This action cannot be undone. All memberships will be removed.',
      confirmText: 'Delete Community',
      variant: 'danger',
      onConfirm: () =>
        runAndClose(() =>
          router.delete(`/communities/${communityId}`, {
            preserveScroll: true,
          })
        ),
    })
  }

  // ----- Invite form (unchanged) -----
  const { data, setData, post, processing, errors, reset } = useForm({
    community_id: '',
    user_identifier: '',
    role: '',
  })

  function invite(e) {
    e.preventDefault()
    if (!data.community_id) return
    post(`/communities/${data.community_id}/invite`, {
      onSuccess: () => reset('user_identifier', 'role'),
      preserveScroll: true,
    })
  }

  return (
    <AuthenticatedLayout>
      <Head title="Communities" />

      {/* Header */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-white">Communities</h1>
          <p className="mt-1 text-sm text-white/60">Your spaces and the ones you’ve joined.</p>
        </div>
        <Link href={route('communities.create')}>
          <Button className="!bg-gradient-to-r !from-cyan-400 !to-teal-400 !text-black hover:from-cyan-300 hover:to-teal-300">
            Create Community
          </Button>
        </Link>
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

      {/* Tabs + Search */}
      <section className="mb-5 rounded-2xl border border-white/10 bg-[#0f1731] p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="inline-flex overflow-hidden rounded-xl border border-white/10 bg-white/5 p-1">
            <button
              onClick={() => setTab('owned')}
              className={`px-4 py-2 text-sm font-medium transition ${tab === 'owned'
                ? 'bg-gradient-to-r from-cyan-400 to-teal-400 text-black'
                : 'text-white/80 hover:bg-white/10'}`}
            >
              Owned <span className="ml-2 rounded-full bg-black/10 px-2 py-[2px] text-xs font-semibold">{owned.length}</span>
            </button>
            <button
              onClick={() => setTab('joined')}
              className={`px-4 py-2 text-sm font-medium transition ${tab === 'joined'
                ? 'bg-gradient-to-r from-cyan-400 to-teal-400 text-black'
                : 'text-white/80 hover:bg-white/10'}`}
            >
              Joined <span className="ml-2 rounded-full bg-black/10 px-2 py-[2px] text-xs font-semibold">{joined.length}</span>
            </button>
          </div>

          <div className="relative w-full sm:w-80">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search communities…"
              className="w-full rounded-lg border border-white/10 bg-white/5 py-2 pl-9 pr-3 text-sm text-white placeholder-white/40 outline-none focus:border-cyan-400/50"
            />
            <svg className="pointer-events-none absolute left-2.5 top-2.5 h-4 w-4 text-white/50" viewBox="0 0 24 24" stroke="currentColor" fill="none" strokeWidth="2">
              <circle cx="11" cy="11" r="7" /><path d="M20 20l-3-3" />
            </svg>
          </div>
        </div>
      </section>

      {/* Empty states / list */}
      {visible.length === 0 ? (
        <div className="mb-8 rounded-2xl border border-white/10 bg-[#0f1731] p-8 text-center">
          <div className="mx-auto mb-3 inline-flex h-12 w-12 items-center justify-center rounded-full bg-white/5">
            {tab === 'owned' ? '🏗️' : '👥'}
          </div>
          <h3 className="text-sm font-semibold text-white">
            {tab === 'owned' ? 'No owned communities yet' : 'No joined communities yet'}
          </h3>
          <p className="mt-1 text-sm text-white/60">
            {tab === 'owned' ? 'Create one to start collaborating.' : 'Ask for an invite or accept one from the Invitations panel.'}
          </p>
        </div>
      ) : (
        <ul className="mb-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {visible.map((c) => {
            const owner = isOwner(c)
            return (
              <li key={c.id} className="group overflow-hidden rounded-2xl border border-white/10 bg-[#0f1731] p-5 shadow transition hover:border-cyan-400/40">
                {/* Top */}
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="truncate text-base font-medium text-white">{c.name}</div>
                    <div className="mt-0.5 text-xs text-white/50">ID: {c.id}</div>
                  </div>
                  <span
                    className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                      owner
                        ? 'bg-gradient-to-r from-cyan-400/20 to-teal-400/20 text-cyan-200 ring-1 ring-cyan-400/30'
                        : 'bg-white/10 text-white/70 ring-1 ring-white/15'
                    }`}
                    title={owner ? 'You are the owner' : 'You are a member'}
                  >
                    {owner ? 'Owner' : 'Member'}
                  </span>
                </div>

                {/* Meta */}
                <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-white/70">
                  <span className="rounded-md border border-white/10 bg-white/5 px-2 py-1">
                    Members: <span className="font-semibold">{c.members_count ?? c.members?.length ?? 0}</span>
                  </span>
                  {c.owner?.name && (
                    <span className="rounded-md border border-white/10 bg-white/5 px-2 py-1">
                      Owner: <span className="font-semibold text-white/80">{c.owner.name}</span>
                    </span>
                  )}
                </div>

                {/* Actions */}
                <div className="mt-4">
                  {owner ? (
                    <div className="space-y-3">
                      <button
                        onClick={() => toggleExpand(c.id)}
                        className="w-full rounded-md border border-white/15 bg-white/5 px-3 py-2 text-sm text-white hover:border-cyan-400/40 hover:text-cyan-200"
                      >
                        {expanded.has(c.id) ? 'Hide Members' : 'Show Members'}
                      </button>

                      {/* Members panel */}
                      {expanded.has(c.id) && (
                        <div className="rounded-xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.03] p-3">
                          {!c.members?.length ? (
                            <p className="text-xs text-white/60">
                              {c.members ? 'No members yet.' : 'Members are not included in this payload. Return members in the list API to render them here.'}
                            </p>
                          ) : (
                            <ul className="divide-y divide-white/10">
                              {c.members.map(m => {
                                const isOwnerRow = m.id === c.owner_id
                                return (
                                  <li key={m.id} className="flex items-center justify-between py-2">
                                    <div className="min-w-0">
                                      <div className="truncate text-sm text-white/90">
                                        {m.name} {isOwnerRow && <span className="ml-2 rounded bg-white/10 px-1.5 py-0.5 text-[10px] text-white/70">Owner</span>}
                                      </div>
                                      <div className="truncate text-xs text-white/50">{m.email}</div>
                                    </div>

                                    {/* Action column */}
                                    {isOwnerRow ? (
                                      <button
                                        onClick={() => deleteCommunity(c.id)}
                                        className="rounded-md border border-rose-400/40 bg-rose-500/10 px-2.5 py-1 text-xs font-semibold text-rose-200 hover:bg-rose-500/20"
                                        title="Delete this community"
                                      >
                                        Delete Community
                                      </button>
                                    ) : (
                                      <button
                                        onClick={() => removeMember(c.id, m.id)}
                                        className="rounded-md border border-white/15 bg-white/5 px-2.5 py-1 text-xs text-white/85 hover:border-rose-400/40 hover:bg-rose-500/10 hover:text-rose-200"
                                      >
                                        Remove
                                      </button>
                                    )}
                                  </li>
                                )
                              })}
                            </ul>
                          )}
                        </div>
                      )}
                    </div>
                  ) : (
                    <button
                      onClick={() => leaveCommunity(c.id)}
                      className="w-full rounded-md border border-white/15 bg-white/5 px-3 py-2 text-sm text-white hover:border-rose-400/40 hover:bg-rose-500/10 hover:text-rose-200"
                    >
                      Leave Community
                    </button>
                  )}
                </div>
              </li>
            )
          })}
        </ul>
      )}

      {/* Quick Invite (Owner) — unchanged */}
      <section className="max-w-xl rounded-2xl border border-white/10 bg-[#0f1731] p-5 shadow">
        <h2 className="mb-3 text-base font-semibold text-white">Quick Invite (Owner)</h2>
        <form onSubmit={invite} className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-white/80">Community ID (you own)</label>
            <input
              className="mt-1 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-white placeholder-white/30 outline-none focus:border-cyan-400/60"
              value={data.community_id}
              onChange={(e) => setData('community_id', e.target.value)}
              placeholder="e.g. 3"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-white/80">User Email</label>
            <input
              className="mt-1 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-white placeholder-white/30 outline-none focus:border-cyan-400/60"
              value={data.user_identifier}
              onChange={(e) => setData('user_identifier', e.target.value)}
              placeholder="user@example.com"
            />
            {errors?.user_identifier && (
              <p className="mt-1 text-sm text-rose-400">{errors.user_identifier}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-white/80">Role (optional)</label>
            <input
              className="mt-1 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-white placeholder-white/30 outline-none focus:border-cyan-400/60"
              value={data.role}
              onChange={(e) => setData('role', e.target.value)}
              placeholder="UI Dev / Backend / …"
            />
          </div>
          <div className="pt-1">
            <Button type="submit" disabled={processing}>
              {processing ? 'Sending…' : 'Send Invitation'}
            </Button>
          </div>
        </form>
      </section>

      {/* Global confirm dialog */}
      <ConfirmDialog
        open={confirm.open}
        onClose={closeConfirm}
        title={confirm.title}
        message={confirm.message}
        confirmText={confirm.confirmText}
        variant={confirm.variant}
        onConfirm={confirm.onConfirm || (() => {})}
        busy={confirm.busy}
      />
    </AuthenticatedLayout>
  )
}
