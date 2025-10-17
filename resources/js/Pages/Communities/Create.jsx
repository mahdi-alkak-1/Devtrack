import AppLayout from '@/Layouts/AppLayout';
import { useForm } from '@inertiajs/react';

export default function Create() {
  const { data, setData, post, processing, errors } = useForm({ name: '' });

  function submit(e) {
    e.preventDefault();
    post(route('communities.store'));
  }

  return (
    <AppLayout title="Create Community">
      <h1 className="text-2xl font-semibold mb-4">Create Community</h1>
      <form onSubmit={submit} className="space-y-4 max-w-md">
        <div>
          <label className="block text-sm font-medium">Name</label>
          <input
            className="mt-1 w-full rounded border px-3 py-2"
            value={data.name}
            onChange={e => setData('name', e.target.value)}
          />
          {errors.name && <p className="text-sm text-red-600">{errors.name}</p>}
        </div>

        <button
          type="submit"
          disabled={processing}
          className="rounded bg-black px-4 py-2 text-white disabled:opacity-50"
        >
          {processing ? 'Creating…' : 'Create'}
        </button>
      </form>
    </AppLayout>
  );
}
