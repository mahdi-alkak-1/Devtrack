// resources/js/Pages/Dashboard.jsx
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { Head, Link, usePage } from '@inertiajs/react'
import Button from '@/Components/Button'
import StatCard from '@/Components/StatCard'
import StatusBadge from '@/Components/StatusBadge'
import PriorityBadge from '@/Components/PriorityBadge'

export default function Dashboard({ stats, recentIssues }) {
  const { auth } = usePage().props
  const isNew = (stats?.projects ?? 0) === 0 && (stats?.issues ?? 0) === 0
  const firstName = auth?.user?.name?.split(' ')[0] || 'there'

  return (
    <AuthenticatedLayout>
      <Head title="Dashboard" />

      {/* Hero */}
      <section className="mb-6 overflow-hidden rounded-2xl border border-white/10 bg-[#0f1731] p-6 shadow-lg sm:p-8">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-white">
              {isNew ? 'Welcome' : 'Welcome back'}, {firstName} <span className="text-cyan-300">✨</span>
            </h1>
            <p className="mt-1 text-sm text-white/70">
              {isNew
                ? 'Spin up your first project, add issues, and invite your community.'
                : 'Here’s what’s happening across your workspace.'}
            </p>
          </div>
          <div className="flex flex-wrap items-start justify-start gap-2 sm:justify-end">
            <Link href="/projects/create">
              <Button className="!bg-gradient-to-r !from-cyan-400 !to-teal-400 !text-black hover:from-cyan-300 hover:to-teal-300">Create Project</Button>
            </Link>
            <Link href="/projects"><Button variant="outline">View Projects</Button></Link>
            <Link href={route('communities.create')}><Button variant="outline">Create Community</Button></Link>
          </div>
        </div>
      </section>

      {/* KPIs */}
      <section className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="overflow-hidden rounded-xl border border-white/10 bg-[#0f1731] shadow">
          <div className="h-1 w-full bg-gradient-to-r from-cyan-400 to-teal-400" />
          <div className="p-5">
            <div className="text-sm text-white/70">Projects</div>
            <div className="mt-1 text-3xl font-semibold text-white">{stats.projects}</div>
          </div>
        </div>
        <div className="overflow-hidden rounded-xl border border-white/10 bg-[#0f1731] shadow">
          <div className="h-1 w-full bg-gradient-to-r from-teal-400 to-cyan-400" />
          <div className="p-5">
            <div className="text-sm text-white/70">Issues</div>
            <div className="mt-1 text-3xl font-semibold text-white">{stats.issues}</div>
          </div>
        </div>
        <div className="overflow-hidden rounded-xl border border-white/10 bg-[#0f1731] shadow">
          <div className="h-1 w-full bg-gradient-to-r from-amber-400 to-rose-400" />
          <div className="p-5">
            <div className="text-sm text-white/70">To-do</div>
            <div className="mt-1 text-3xl font-semibold text-white">{stats.issues_todo}</div>
          </div>
        </div>
        <div className="overflow-hidden rounded-xl border border-white/10 bg-[#0f1731] shadow">
          <div className="h-1 w-full bg-gradient-to-r from-blue-400 to-indigo-400" />
          <div className="p-5">
            <div className="text-sm text-white/70">In Progress</div>
            <div className="mt-1 text-3xl font-semibold text-white">{stats.issues_doing}</div>
          </div>
        </div>
      </section>

      {/* Recent Issues */}
      <section className="rounded-2xl border border-white/10 bg-[#0f1731] p-5 shadow">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold tracking-tight text-white">Recent Issues</h2>
          <Link href="/projects" className="text-sm text-cyan-300 underline decoration-cyan-500/40 underline-offset-4 hover:text-cyan-200">
            Go to projects
          </Link>
        </div>

        {recentIssues.length === 0 ? (
          <p className="text-white/70">{isNew ? 'No issues yet. Create your first project.' : 'No recent activity.'}</p>
        ) : (
          <ul className="divide-y divide-white/10">
            {recentIssues.map(i => (
              <li key={i.id} className="py-3">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-xs uppercase tracking-wide text-white/50">
                      <span className="font-medium text-white/80">{i.project.key}</span> · {i.project.name}
                    </div>
                    <Link
                      href={`/projects/${i.project.id}/issues/${i.id}`}
                      className="text-[15px] font-medium text-white underline decoration-white/20 underline-offset-4 hover:decoration-cyan-400"
                    >
                      {i.project.key}-{i.number}: {i.title}
                    </Link>
                    <div className="mt-2 flex flex-wrap items-center gap-2 text-sm">
                      <StatusBadge status={i.status} />
                      <PriorityBadge priority={i.priority} />
                      <span className="text-xs text-white/50">{new Date(i.created_at).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </AuthenticatedLayout>
  )
}
