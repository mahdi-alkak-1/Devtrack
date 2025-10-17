import AppLayout from '@/Layouts/AppLayout';
import { router, usePage } from '@inertiajs/react';

export default function Index({ pending }) {
  const { me, flash } = usePage().props;   // ← get current user + flash

  function respond(communityId, action) {
    if (!me?.id) return alert('Missing current user id.');
    router.patch(
      `/communities/${communityId}/members/${me.id}`,
      { action },
      { preserveScroll: true }
    );
  }
  router.patch(url, data, {
  preserveScroll: true,
  onSuccess: () => router.reload({ only: ['pending'] }),  // re-fetch pending only
    });

  return (
    <AppLayout title="Invitations">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Your Invitations</h1>
      </div>

      {/* Flash messages */}
      {flash?.success && (
        <div className="mb-3 rounded-md border border-emerald-300 bg-emerald-50 px-4 py-2 text-sm text-emerald-800">
          {flash.success}
        </div>
      )}
      {flash?.error && (
        <div className="mb-3 rounded-md border border-rose-300 bg-rose-50 px-4 py-2 text-sm text-rose-800">
          {flash.error}
        </div>
      )}

      {pending.length === 0 ? (
        <div className="rounded-xl border bg-white p-6 text-gray-600 shadow-sm">
          You have no pending invitations.
        </div>
      ) : (
        <ul className="grid gap-4 md:grid-cols-2">
          {pending.map((c) => (
            <li key={c.id} className="rounded-xl border bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-sm text-gray-500">Community</div>
                  <div className="text-lg font-medium">{c.name}</div>

                  <div className="mt-2 text-sm text-gray-700">
                    Invited as: <span className="font-medium">{c.role ?? 'Member'}</span>
                  </div>
                  {c.owner?.name && (
                    <div className="text-sm text-gray-600">
                      Owner: {c.owner.name} {c.owner.email ? `(${c.owner.email})` : ''}
                    </div>
                  )}
                  <div className="mt-2 text-xs text-gray-500">
                    Created: {new Date(c.created_at).toLocaleString()}
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => respond(c.id, 'accept')}
                    className="rounded bg-emerald-600 px-3 py-1.5 text-white hover:bg-emerald-700"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => respond(c.id, 'reject')}
                    className="rounded bg-rose-600 px-3 py-1.5 text-white hover:bg-rose-700"
                  >
                    Reject
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </AppLayout>
  );
}
