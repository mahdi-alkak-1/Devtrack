import Button from '@/Components/Button'
import { Head, Link } from '@inertiajs/react'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'

export default function Index({ projects }) {
  return (
    <AuthenticatedLayout>
      <Head title="Projects" />

      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-white">Your Projects</h1>
        <Link href="/projects/create">
          <Button className="!bg-gradient-to-r !from-cyan-400 !to-teal-400 !text-black hover:from-cyan-300 hover:to-teal-300">
            Create Project
          </Button>
        </Link>
      </div>

      {projects.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-[#0f1731] p-6 text-white/70">
          No projects yet. Create one to get started.
        </div>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map(p => (
            <li key={p.id} className="group overflow-hidden rounded-2xl border border-white/10 bg-[#0f1731] p-5 shadow transition hover:border-cyan-400/40">
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-sm text-white/50">{p.key}</div>
                  <div className="text-base font-medium text-white">{p.name}</div>
                </div>
              </div>

              <div className="mt-4">
                <Link href={`/projects/${p.id}`}>
                  <Button variant="outline" className="w-full border-white/20 text-white hover:border-cyan-400/60 hover:text-cyan-200">
                    Open
                  </Button>
                </Link>
              </div>
            </li>
          ))}
        </ul>
      )}
    </AuthenticatedLayout>
  )
}
