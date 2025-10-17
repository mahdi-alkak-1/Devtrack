import AppLayout from '@/Layouts/AppLayout';
import Button from '@/Components/Button';
import { Head, Link} from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Index({ projects }) {

  return (
    <AuthenticatedLayout >
      <Head title="All Projects"/>

      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">Your Projects</h1>
        <Link href="/projects/create">
          <Button>Create Project</Button>
        </Link>
        <Link href="/dashboard">
          <Button>Back to Dashboard</Button>
        </Link>
      </div>

      {projects.length === 0 ? (
        <p>No projects yet. Create one to get started.</p>
      ) : (
        <ul className="space-y-2">
          {projects.map(p => (
            <li key={p.id} className="p-4 border rounded flex justify-between items-center">
              <div>
                <strong>{p.name}</strong> ({p.key})
              </div>
              <Link href={`/projects/${p.id}`}>
                <Button variant="outline">Open</Button>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </AuthenticatedLayout>
  );
}
