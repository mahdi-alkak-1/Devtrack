// resources/js/Pages/About.jsx
import { Head, Link } from '@inertiajs/react'
import GuestLayout from '@/Layouts/GuestLayout'

export default function About() {
  return (
    <GuestLayout>
      <Head title="About – DevTrack" />

      <div className="mx-auto max-w-5xl px-4 py-12 space-y-10">
        {/* Hero */}
        <header>
          <h1 className="text-3xl font-bold text-white">About DevTrack</h1>
          <p className="mt-3 text-sm text-white/65 leading-relaxed">
            DevTrack started as a learning/project-management exercise: “Can we build a small Jira
            clone with Laravel, Inertia, and React, but make it friendly for teams that work in communities?”
          </p>
        </header>

        {/* Mission */}
        <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-lg font-semibold text-white">Why we built it</h2>
          <p className="mt-3 text-sm text-white/70">
            Most task tools jump immediately to boards, sprints, and 50 settings. We wanted a flow that makes sense
            for student teams, small agencies, or alumni communities:
          </p>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-white/70">
            <li><strong>Create a community</strong> → gather people in one place</li>
            <li><strong>Create a project</strong> → attach it to that community</li>
            <li><strong>Create issues</strong> → assign only to accepted members</li>
            <li><strong>Notify</strong> → so the member will get notified to solve  an issue, and owner too when its done</li>
          </ul>
          <p className="mt-3 text-sm text-white/60">
            This is also why the top bar shows invitations and notifications first — collaboration is core.
          </p>
        </section>

        {/* Tech */}
        <section className="grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-[#0f1731] p-6">
            <h3 className="text-base font-semibold text-white">Tech stack</h3>
            <ul className="mt-3 space-y-2 text-sm text-white/70">
              <li>✅ Laravel (backend, auth, notifications)</li>
              <li>✅ Inertia.js (Laravel ↔ React bridge)</li>
              <li>✅ React (pages, modals, hover cards)</li>
              <li>✅ Tailwind CSS (UI)</li>
              <li>✅ MySQL (data)</li>
            </ul>
          </div>
          <div className="rounded-2xl border border-white/10 bg-[#0f1731] p-6">
            <h3 className="text-base font-semibold text-white">Features implemented</h3>
            <ul className="mt-3 space-y-2 text-sm text-white/70">
              <li>✅ Auth + email verification</li>
              <li>✅ Community invitations panel (in header)</li>
              <li>✅ Projects linked to communities (owner only)</li>
              <li>✅ Issues with status, priority, assignee, due date</li>
              <li>✅ Real-time-ish notifications (DB)</li>
              <li>✅ Modern UI: modals, hover details, inline assign</li>
            </ul>
          </div>
        </section>

        {/* CTA */}
        <section className="rounded-2xl border border-cyan-400/20 bg-cyan-400/5 p-6 text-center">
          <h2 className="text-lg font-semibold text-white">Want to try it?</h2>
          <p className="mt-2 text-sm text-white/70">
            Create an account and start a community for your team or alumni group.
          </p>
          <div className="mt-4 flex justify-center gap-3">
            <Link
              href={route('register')}
              className="rounded-md bg-gradient-to-r from-cyan-400 to-teal-400 px-4 py-2 text-sm font-semibold text-black hover:from-cyan-300 hover:to-teal-300"
            >
              Get started
            </Link>
            <Link
              href={route('docs')}
              className="rounded-md border border-white/10 bg-white/5 px-4 py-2 text-sm text-white hover:bg-white/10"
            >
              Read the docs
            </Link>
          </div>
        </section>

        {/* Footer text */}
        <section className="pb-8">
          <p className="text-xs text-white/40">
            DevTrack is a learning/demo app. You can extend it with roles, Kanban boards, comments, or API tokens.
          </p>
        </section>
      </div>
    </GuestLayout>
  )
}
