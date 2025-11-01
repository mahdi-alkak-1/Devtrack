// resources/js/Pages/Docs.jsx
import { Head, Link } from '@inertiajs/react'
import GuestLayout from '@/Layouts/GuestLayout'

export default function Docs() {
  return (
    <GuestLayout>
      <Head title="Docs – DevTrack" />

      <div className="mx-auto flex max-w-6xl gap-10 px-4 py-10 lg:py-14">
        {/* Side nav */}
        <aside className="hidden w-56 shrink-0 lg:block">
          <div className="sticky top-24 space-y-2 text-sm text-white/60">
            <a href="#intro" className="block rounded-md px-3 py-1 hover:bg-white/5 hover:text-white">1. What is DevTrack?</a>
            <a href="#auth" className="block rounded-md px-3 py-1 hover:bg-white/5 hover:text-white">2. Accounts & access</a>
            <a href="#communities" className="block rounded-md px-3 py-1 hover:bg-white/5 hover:text-white">3. Communities</a>
            <a href="#projects" className="block rounded-md px-3 py-1 hover:bg-white/5 hover:text-white">4. Projects</a>
            <a href="#issues" className="block rounded-md px-3 py-1 hover:bg-white/5 hover:text-white">5. Issues</a>
            <a href="#notifications" className="block rounded-md px-3 py-1 hover:bg-white/5 hover:text-white">6. Notifications</a>
            <a href="#faq" className="block rounded-md px-3 py-1 hover:bg-white/5 hover:text-white">7. FAQ</a>
          </div>
        </aside>

        {/* Content */}
        <div className="flex-1 space-y-10">
          {/* Intro */}
          <section id="intro">
            <p className="inline-flex rounded-full bg-cyan-500/10 px-3 py-1 text-xs font-medium text-cyan-200 ring-1 ring-cyan-500/20">
              Docs
            </p>
            <h1 className="mt-4 text-3xl font-bold text-white">DevTrack documentation</h1>
            <p className="mt-3 text-sm text-white/70 leading-relaxed">
              DevTrack is a small Jira-like app built with Laravel + Inertia + React. You create a community,
              invite people, create projects under that community, and then manage issues (status, priority, assignee)
              inside the project. This page explains the flow.
            </p>
            <div className="mt-4 rounded-lg bg-white/5 px-4 py-3 text-xs text-white/60">
              Tip: if you already have an account, you can go straight to the{' '}
              <Link href="/dashboard" className="text-cyan-200 hover:text-cyan-100">Dashboard</Link>.
            </div>
          </section>

          {/* Auth */}
          <section id="auth" className="space-y-3">
            <h2 className="text-xl font-semibold text-white">1. Accounts & access</h2>
            <p className="text-sm text-white/70">
              Public pages: <code className="rounded bg-white/10 px-1.5 py-0.5 text-xs">/</code>,{' '}
              <code className="rounded bg-white/10 px-1.5 py-0.5 text-xs">/docs</code>,{' '}
              <code className="rounded bg-white/10 px-1.5 py-0.5 text-xs">/about</code>
              are visible to everyone.
            </p>
            <ul className="list-disc space-y-1 pl-5 text-sm text-white/70">
              <li>To use the app, register at <code>/register</code>.</li>
              <li>After registration, the app may ask you to verify your email.</li>
              <li>Once verified, you’re redirected to <code>/dashboard</code> (the private area).</li>
            </ul>
          </section>

          {/* Communities */}
          <section id="communities" className="space-y-3">
            <h2 className="text-xl font-semibold text-white">2. Communities</h2>
            <p className="text-sm text-white/70">
              A community is your “team”. You create it, invite people, and when they accept, they can be assigned
              to issues inside projects that belong to that community.
            </p>
            <ul className="list-disc space-y-1 pl-5 text-sm text-white/70">
              <li>Only the community <strong>owner</strong> can attach projects to this community.</li>
              <li>Members with <code>accepted</code> status can be assignees on issues.</li>
              <li>Invitations appear in the right panel in the app (in the header).</li>
            </ul>
          </section>

          {/* Projects */}
          <section id="projects" className="space-y-3">
            <h2 className="text-xl font-semibold text-white">3. Projects</h2>
            <p className="text-sm text-white/70">
              A project is where issues live. When you create a project you can (optionally) link it to one of
              <strong>your</strong> communities. You can’t link to a community you don’t own.
            </p>
            <p className="text-sm text-white/70">
              Each project has:
            </p>
            <ul className="list-disc space-y-1 pl-5 text-sm text-white/70">
              <li><strong>Name</strong> — display name.</li>
              <li><strong>Key</strong> — short code like <code>WEB</code> or <code>APP</code>. This appears in issue codes (WEB-12).</li>
              <li><strong>Description</strong> — optional.</li>
              <li><strong>Community</strong> — who can be assigned.</li>
            </ul>
            <p className="text-xs text-white/40">
              Note: you removed uniqueness on project key, so multiple projects can now use the same key.
            </p>
          </section>

          {/* Issues */}
          <section id="issues" className="space-y-3">
            <h2 className="text-xl font-semibold text-white">4. Issues</h2>
            <p className="text-sm text-white/70">
              Issues are tasks/bugs/features inside a project. In DevTrack you already support:
            </p>
            <ul className="list-disc space-y-1 pl-5 text-sm text-white/70">
              <li><strong>Status</strong>: <code>todo</code>, <code>in_progress</code>, <code>done</code></li>
              <li><strong>Priority</strong>: <code>low</code>, <code>medium</code>, <code>high</code></li>
              <li><strong>Assignee</strong>: must be a member of the linked community </li>
              <li><strong>Due date</strong> (optional)</li>
              <li><strong>Description</strong></li>
            </ul>
            <p className="text-sm text-white/70">
              On the new project page you made, issues are shown in a list and you can create issues in a modal.
              You also added a hover preview for faster browsing.
            </p>
          </section>

          {/* Notifications */}
          <section id="notifications" className="space-y-3">
            <h2 className="text-xl font-semibold text-white">5. Notifications</h2>
            <p className="text-sm text-white/70">
              Notifications are stored in Laravel DB notifications. In the top-right panel you see unread count.
              When someone assigns you to an issue, you get a notification with a message and a target URL.
            </p>
          </section>

          {/* FAQ */}
          <section id="faq" className="space-y-3 pb-10">
            <h2 className="text-xl font-semibold text-white">6. FAQ</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-semibold text-white/90">Can I assign an issue to anyone?</h3>
                <p className="text-sm text-white/65">
                  No. Only users in the attached community with <code>accepted</code> status.
                </p>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white/90">Why do we have communities + projects?</h3>
                <p className="text-sm text-white/65">
                  This lets you separate ownership (project) from membership (community) and reuse the same people across projects.
                </p>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white/90">Is there an API?</h3>
                <p className="text-sm text-white/65">
                  Right now it’s web-first, but since it’s Laravel, you can expose the same controllers as API easily.
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </GuestLayout>
  )
}
