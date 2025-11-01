// resources/js/Pages/Features.jsx
import { Head } from '@inertiajs/react'
import GuestLayout from '@/Layouts/GuestLayout'

export default function Features() {
  return (
    <GuestLayout>
      <Head title="Features – DevTrack" />
      <div className="mx-auto max-w-5xl px-4 py-10 space-y-6">
        <h1 className="text-3xl font-bold text-white">Features</h1>
        <p className="text-sm text-white/70">
          A quick list of what’s ready today.
        </p>

        <ul className="grid gap-4 md:grid-cols-2">
          <li className="rounded-xl border border-white/10 bg-white/5 p-4">
            <h3 className="text-sm font-semibold text-white">Auth + email verify</h3>
            <p className="text-xs text-white/60 mt-1">Secure entry point.</p>
          </li>
          <li className="rounded-xl border border-white/10 bg-white/5 p-4">
            <h3 className="text-sm font-semibold text-white">Communities</h3>
            <p className="text-xs text-white/60 mt-1">Invite, accept, manage members.</p>
          </li>
          <li className="rounded-xl border border-white/10 bg-white/5 p-4">
            <h3 className="text-sm font-semibold text-white">Projects</h3>
            <p className="text-xs text-white/60 mt-1">Attach to community you own.</p>
          </li>
          <li className="rounded-xl border border-white/10 bg-white/5 p-4">
            <h3 className="text-sm font-semibold text-white">Issues</h3>
            <p className="text-xs text-white/60 mt-1">Status, priority, assignee, due date.</p>
          </li>
          <li className="rounded-xl border border-white/10 bg-white/5 p-4">
            <h3 className="text-sm font-semibold text-white">Notifications</h3>
            <p className="text-xs text-white/60 mt-1">Get alerted when assigned.</p>
          </li>
        </ul>
      </div>
    </GuestLayout>
  )
}
