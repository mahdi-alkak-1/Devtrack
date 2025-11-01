// resources/js/Layouts/GuestLayout.jsx
import { Link, usePage } from '@inertiajs/react'

export default function GuestLayout({ children }) {
  const { auth } = usePage().props || {}

  return (
    <div className="min-h-screen bg-[#0b1020] text-white flex flex-col">
      {/* Top Nav */}
      <header className="sticky top-0 z-20 border-b border-white/10 bg-[#0d1328]/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          {/* Brand */}
          <Link href="/" className="flex items-center gap-2">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-400 to-teal-400 text-black font-bold">
              DT
            </span>
            <span className="text-sm font-semibold tracking-tight">
              DevTrack
            </span>
          </Link>

          {/* Right side */}
          <div className="flex items-center gap-2">
            <Link href="/features" className="text-sm text-white/75 hover:text-white">Features</Link>
            <Link href="/docs" className="text-sm text-white/75 hover:text-white">Docs</Link>
            <Link href="/about" className="text-sm text-white/75 hover:text-white">About</Link>

            {auth?.user ? (
              <Link
                href="/dashboard"
                className="rounded-md bg-white/10 px-3 py-1.5 text-sm hover:bg-white/20"
              >
                Go to app
              </Link>
            ) : (
              <>
                <Link
                  href={route('login')}
                  className="rounded-md px-3 py-1.5 text-sm text-white/85 hover:bg-white/10"
                >
                  Sign in
                </Link>
                <Link
                  href={route('register')}
                  className="rounded-md bg-gradient-to-r from-cyan-400 to-teal-400 px-3 py-1.5 text-sm font-semibold text-black hover:from-cyan-300 hover:to-teal-300"
                >
                  Get started
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Page */}
      <main className="flex-1">
        {children}
      </main>

      <footer className="border-t border-white/10 py-6 text-center text-xs text-white/40">
        © {new Date().getFullYear()} DevTrack — simple issue tracking for teams
      </footer>
    </div>
  )
}
