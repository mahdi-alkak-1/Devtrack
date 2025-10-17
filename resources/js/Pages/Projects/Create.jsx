import AppLayout from '@/Layouts/AppLayout';
import Button from '@/Components/Button';
import { useForm } from '@inertiajs/react';

export default function Create() {
  const { data, setData, post, processing, errors } = useForm({
    name: '',
    key: '',
    description: '',
  });

  function submit(e) {
    e.preventDefault();
    post('/projects');
  }

  return (
    <AppLayout title="Create Project">
      <h1 className="text-2xl font-semibold mb-4">Create Project</h1>
      <form onSubmit={submit} className="space-y-4 max-w-md">
        <div>
          <label className="block text-sm font-medium">Name</label>
          <input
            className="mt-1 w-full border rounded px-3 py-2"
            value={data.name}
            onChange={e => setData('name', e.target.value)}
          />
          {errors.name && <p className="text-red-600 text-sm">{errors.name}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium">Key</label>
          <input
            className="mt-1 w-full border rounded px-3 py-2"
            value={data.key}
            onChange={e => setData('key', e.target.value)}
          />
          {errors.key && <p className="text-red-600 text-sm">{errors.key}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium">Description</label>
          <textarea
            className="mt-1 w-full border rounded px-3 py-2"
            value={data.description}
            onChange={e => setData('description', e.target.value)}
            rows={3}
          />
          {errors.description && <p className="text-red-600 text-sm">{errors.description}</p>}
        </div>

        <Button type="submit" disabled={processing}>{processing ? 'Creating…' : 'Create Project'}</Button>
      </form>
    </AppLayout>
  );
}
