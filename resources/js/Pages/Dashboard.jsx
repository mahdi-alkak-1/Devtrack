import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import Badge from '@/Components/Badge';
import Button from '@/Components/Button';
import StatCard from '@/Components/StatCard';
import StatusBadge from '@/Components/StatusBadge';
import PriorityBadge from '@/Components/PriorityBadge';

export default function Dashboard({ stats, recentIssues }) {
  return (
    <AuthenticatedLayout>
      <Head title="Dashboard" />

      {/* Header row */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold tracking-tight text-gray-900">Dashboard</h1>
        <div className="flex gap-2">
          <Link href="/projects">
            <Button>View Projects</Button>
          </Link>
          <Link href="/projects/create">
            <Button variant="outline">Create Project</Button>
          </Link>
          <Link href={route('communities.create')}>
            <Button variant="outline">Create Community</Button>
          </Link>
        </div>
      </div>

      {/* Stat cards */}
      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4 mb-6">
        <StatCard label="Projects" value={stats.projects} accent="from-indigo-500 to-indigo-600" />
        <StatCard label="Issues" value={stats.issues} accent="from-violet-500 to-violet-600" />
        <StatCard label="To-do" value={stats.issues_todo} accent="from-amber-500 to-amber-600" />
        <StatCard label="In Progress" value={stats.issues_doing} accent="from-blue-500 to-blue-600" />
      </section>

      {/* Recent Issues */}
      <section className="rounded-xl border bg-white p-5 shadow-sm">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-medium">Recent Issues</h2>
        </div>

        {recentIssues.length === 0 ? (
          <p className="text-gray-600">No issues yet. Create one from a project.</p>
        ) : (
          <ul className="divide-y divide-gray-200">
            {recentIssues.map((i) => (
              <li key={i.id} className="py-3">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-sm text-gray-500">
                      <span className="font-medium text-gray-900">{i.project.key}</span> · {i.project.name}
                    </div>
                    <Link
                      href={`/projects/${i.project.id}/issues/${i.id}`}
                      className="text-base font-medium underline decoration-indigo-600 underline-offset-2 hover:text-indigo-800"
                    >
                      {i.project.key}-{i.number}: {i.title}
                    </Link>
                    <div className="mt-2 flex flex-wrap items-center gap-2 text-sm">
                      <StatusBadge status={i.status} />
                      <PriorityBadge priority={i.priority} />
                      <span className="text-xs text-gray-500">{new Date(i.created_at).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </AuthenticatedLayout>
  );
}


/* Priority Badge Component */
