import { Head, Link } from '@inertiajs/react'
import GuestLayout from '@/Layouts/GuestLayout'

export default function Landing() {
  return (
    <GuestLayout>
      <Head title="DevTrack – simple issue tracking" />

      {/* Hero */}
      <section className="mx-auto flex max-w-6xl flex-col gap-10 px-4 py-16 md:flex-row md:items-center">
        <div className="md:w-1/2">
          <p className="inline-flex rounded-full bg-cyan-500/10 px-3 py-1 text-xs font-medium text-cyan-200 ring-1 ring-cyan-500/20">
            New • Project + Community in one
          </p>
          <h1 className="mt-5 text-4xl font-bold tracking-tight text-white md:text-5xl">
            Track issues, assign teammates, stay in sync.
          </h1>
          <p className="mt-4 text-base text-white/70">
            DevTrack lets you create projects, invite people to a community, and manage issues
            with status, priority, and notifications — in a clean dashboard.
          </p>
          <div className="mt-6 flex gap-3">
            <Link
              href={route('register')}
              className="rounded-md bg-gradient-to-r from-cyan-400 to-teal-400 px-5 py-2.5 text-sm font-semibold text-black hover:from-cyan-300 hover:to-teal-300"
            >
              Start for free
            </Link>
            <Link
              href="#features"
              className="rounded-md border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white/90 hover:bg-white/10"
            >
              View features
            </Link>
          </div>
        </div>

        {/* Fake screenshot */}
        <div className="md:w-1/2">
          <div className="rounded-2xl border border-white/10 bg-[#0f1731] p-4 shadow-2xl">
            <div className="flex items-center justify-between text-xs text-white/40">
              <span>Issues</span>
              <span>Project: Website Revamp</span>
            </div>
            <div className="mt-4 space-y-3">
              <div className="rounded-lg bg-white/5 p-3">
                <div className="text-sm text-white">WEB-12: Fix navbar overlap on mobile</div>
                <div className="mt-1 flex gap-2 text-xs">
                  <span className="rounded bg-green-100/80 px-2 py-0.5 text-[10px] font-semibold text-green-900">In progress</span>
                  <span className="rounded bg-amber-100/80 px-2 py-0.5 text-[10px] font-semibold text-amber-900">Medium</span>
                  <span className="text-white/50">Assigned to Mahdi</span>
                </div>
              </div>
              <div className="rounded-lg bg-white/5 p-3">
                <div className="text-sm text-white">WEB-13: Add community invitations panel</div>
                <div className="mt-1 flex gap-2 text-xs">
                  <span className="rounded bg-gray-100/80 px-2 py-0.5 text-[10px] font-semibold text-gray-900">To-do</span>
                  <span className="rounded bg-rose-100/80 px-2 py-0.5 text-[10px] font-semibold text-rose-900">High</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="bg-[#0d1328] py-16">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-2xl font-semibold text-white">What you get</h2>
          <p className="mt-2 text-sm text-white/60">Same features you already built 👇</p>

          <div className="mt-8 grid gap-6 md:grid-cols-3">
            <div className="rounded-xl border border-white/10 bg-white/5 p-5">
              <h3 className="text-sm font-semibold text-white">Projects & communities</h3>
              <p className="mt-2 text-xs text-white/60">
                Create a project, connect it to a community, and invite members.
              </p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 p-5">
              <h3 className="text-sm font-semibold text-white">Issues with assignees</h3>
              <p className="mt-2 text-xs text-white/60">
                Status, priority, due dates, assign only to accepted community members.
              </p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 p-5">
              <h3 className="text-sm font-semibold text-white">Notifications</h3>
              <p className="mt-2 text-xs text-white/60">
                Get notified when you’re assigned or issue status changes.
              </p>
            </div>
          </div>
        </div>
      </section>
    </GuestLayout>
  )
}
