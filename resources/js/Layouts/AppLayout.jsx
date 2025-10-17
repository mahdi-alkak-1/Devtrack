import { Head, Link, usePage } from '@inertiajs/react';

export default function AppLayout({ title, children }) {
  const { auth, flash } = usePage().props; // Breeze shares auth info
  const csrfToken = usePage().props.csrfToken;  // CSRF Token for logout

  return (
    <div className="min-h-screen bg-gray-50">
      <Head title={title ? `${title} · DevTrack` : 'DevTrack'} />

      {/* Top nav */}
      <header className="sticky top-0 z-10 bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 text-white shadow">
        <nav className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
          <Link href="/projects" className="text-lg font-semibold tracking-wide">
            DevTrack
          </Link>

          <div className="flex items-center gap-4 text-sm">
            <Link href="/projects" className="hover:underline/70">
              Projects
            </Link>
            {auth?.user && (
              <>
                <span className="text-white/90">{auth.user.name}</span>

                {/* Logout Form */}
                <form action="/logout" method="POST" className="inline">
                  <button
                    type="submit"
                    className="text-white hover:text-gray-200 transition"
                  >
                    Logout
                  </button>
                  <input type="hidden" name="_token" value={csrfToken} />
                </form>
              </>
            )}
          </div>
        </nav>
      </header>

      {/* Page container */}
      <main className="mx-auto max-w-6xl px-4 py-8 space-y-4">
        {/* Flash */}
        {flash?.success && (
          <div className="rounded-md border border-emerald-300 bg-emerald-50 px-4 py-2 text-sm text-emerald-800">
            {flash.success}
          </div>
        )}
        {flash?.error && (
          <div className="rounded-md border border-rose-300 bg-rose-50 px-4 py-2 text-sm text-rose-800">
            {flash.error}
          </div>
        )}

        {children}
      </main>

      {/* Footer */}
      <footer className="mt-10 border-t py-6 text-center text-xs text-gray-500">
        © {new Date().getFullYear()} DevTrack
      </footer>
    </div>
  );
}
