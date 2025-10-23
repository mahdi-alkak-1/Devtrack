// resources/js/Pages/MyWork/Index.jsx
import { Head, Link, router } from '@inertiajs/react'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import Button from '@/Components/Button'

export default function MyWorkIndex({ issues = [] }) {
  function markDone(issue) {
    const pid = issue?.project?.id ?? issue?.project_id
    if (!pid) return alert('Missing project id for this issue.')

    router.patch(
      `/projects/${pid}/issues/${issue.id}`,
      { status: 'done' },
      { preserveScroll: true, onSuccess: () => router.reload({ only: ['issues'] }) }
    )
  }

  return (
    <AuthenticatedLayout>
      <Head title="My Work" />

      <section className="mx-auto max-w-3xl overflow-hidden rounded-2xl border border-white/10 bg-[#0f1731] shadow">
        {/* Header */}
        <div className="border-b border-white/10 bg-gradient-to-r from-cyan-400/10 to-teal-400/10 px-6 py-4">
          <h1 className="text-lg font-semibold tracking-tight text-white">My Work</h1>
          <p className="mt-1 text-xs text-white/60">Issues assigned to you across all projects.</p>
        </div>

        {/* Body */}
        <div className="p-2 sm:p-4">
          {issues.length === 0 ? (
            <div className="m-4 rounded-xl border border-white/10 bg-white/5 p-6 text-white/70">
              No issues assigned to you.
            </div>
          ) : (
            <ul className="divide-y divide-white/10 overflow-hidden rounded-xl border border-white/10 bg-white/5">
              {issues.map((i) => (
                <li key={i.id} className="p-4 hover:bg-white/5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <div className="text-xs text-white/60">
                        <span className="font-medium text-white">
                          {i.project?.key}
                        </span>{' '}
                        · {i.project?.name}
                      </div>

                      <Link
                        href={`/projects/${i.project?.id ?? i.project_id}/issues/${i.id}`}
                        className="mt-1 block truncate text-base font-medium text-white underline decoration-cyan-400/50 underline-offset-4 hover:decoration-cyan-300 focus:outline-none focus:ring-2 focus:ring-cyan-400/60"
                      >
                        {i.project?.key}-{i.number}: {i.title}
                      </Link>

                      {i.summary && (
                        <p className="mt-1 line-clamp-2 text-sm text-white/60">
                          {i.summary}
                        </p>
                      )}
                    </div>

                    <Button
                      onClick={() => markDone(i)}
                      className="shrink-0 !bg-gradient-to-r !from-cyan-400 !to-teal-400 !text-black hover:from-cyan-300 hover:to-teal-300"
                    >
                      Confirmed
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </AuthenticatedLayout>
  )
}
