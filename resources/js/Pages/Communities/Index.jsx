// resources/js/Pages/Communities/Index.jsx
import AppLayout from '@/Layouts/AppLayout';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm, usePage } from '@inertiajs/react';

export default function Index({ communities }) {
  const { flash } = usePage().props;
  const { data, setData, post, processing, errors, reset } = useForm({
    community_id: '',
    user_identifier: '',
    role: '',
  });

  function invite(e) {
    e.preventDefault();
    if (!data.community_id) return;
    post(`/communities/${data.community_id}/invite`, {
      onSuccess: () => reset('user_identifier','role'),
      preserveScroll: true,
    });
  }

  return (
    <AuthenticatedLayout>
        <Head title="Communities" />
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Your Communities</h1>
        <Link href={route('communities.create')} className="underline">Create Community</Link>
      </div>

      {communities.length === 0 ? (
        <p className="text-gray-600">No communities yet.</p>
      ) : (
        <ul className="mb-8 grid gap-4 md:grid-cols-2">
          {communities.map((c) => (
            <li key={c.id} className="rounded-xl border bg-white p-5 shadow-sm">
              <div className="font-medium">{c.name}</div>
              <div className="text-xs text-gray-500">ID: {c.id}</div>
            </li>
          ))}
        </ul>
      )}

      <section className="rounded-xl border bg-white p-5 shadow-sm max-w-xl">
        <h2 className="text-lg font-medium mb-3">Quick Invite (Owner)</h2>
        <form onSubmit={invite} className="space-y-3">
          <div>
            <label className="block text-sm font-medium">Community ID (you own)</label>
            <input
              className="mt-1 w-full rounded border px-3 py-2"
              value={data.community_id}
              onChange={e => setData('community_id', e.target.value)}
              placeholder="e.g. 3"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">User Email</label>
            <input
              className="mt-1 w-full rounded border px-3 py-2"
              value={data.user_identifier}
              onChange={e => setData('user_identifier', e.target.value)}
              placeholder="user@example.com"
            />
            {errors.user_identifier && <p className="text-sm text-rose-600">{errors.user_identifier}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium">Role (optional)</label>
            <input
              className="mt-1 w-full rounded border px-3 py-2"
              value={data.role}
              onChange={e => setData('role', e.target.value)}
              placeholder="UI Dev / Backend / ..."
            />
          </div>
          <button type="submit" disabled={processing} className="rounded bg-black px-4 py-2 text-white">
            {processing ? 'Sending…' : 'Send Invitation'}
          </button>
        </form>
      </section>
    </AuthenticatedLayout>
  );
}
