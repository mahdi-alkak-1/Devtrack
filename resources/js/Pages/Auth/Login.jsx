import { Head, Link, useForm } from '@inertiajs/react'
import Button from '@/Components/Button'

export default function Login({ status, canResetPassword }) {
  const { data, setData, post, processing, errors } = useForm({
    email: '',
    password: '',
    remember: false,
  })

  const submit = (e) => {
    e.preventDefault()
    post(route('login'))
  }

  return (
    <div className="min-h-screen grid place-items-center bg-[#0b1228] px-4">
      <Head title="Login" />

      <section className="w-full max-w-md overflow-hidden rounded-2xl border border-white/10 bg-[#0f1731] shadow">
        {/* Header */}
        <div className="border-b border-white/10 bg-gradient-to-r from-cyan-400/10 to-teal-400/10 px-6 py-5">
          <h1 className="text-lg font-semibold tracking-tight text-white">Sign in</h1>
          <p className="mt-1 text-xs text-white/60">Welcome back to DevTrack.</p>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          {status && (
            <div className="rounded-lg border border-emerald-400/20 bg-emerald-400/10 px-3 py-2 text-sm text-emerald-300">
              {status}
            </div>
          )}

          <form onSubmit={submit} className="space-y-4">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-white/80">
                Email
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                value={data.email}
                onChange={(e) => setData('email', e.target.value)}
                className="mt-1 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-white placeholder-white/30 outline-none focus:border-cyan-400/60"
                placeholder="you@example.com"
                required
              />
              {errors.email && <p className="mt-1 text-xs text-rose-400">{errors.email}</p>}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-white/80">
                Password
              </label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                value={data.password}
                onChange={(e) => setData('password', e.target.value)}
                className="mt-1 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-white placeholder-white/30 outline-none focus:border-cyan-400/60"
                placeholder="••••••••"
                required
              />
              {errors.password && <p className="mt-1 text-xs text-rose-400">{errors.password}</p>}
            </div>

            {/* Row: remember + forgot */}
            <div className="flex items-center justify-between">
              <label className="flex items-center text-sm text-white/80">
                <input
                  type="checkbox"
                  checked={data.remember}
                  onChange={(e) => setData('remember', e.target.checked)}
                  className="rounded border-white/20 bg-white/5 text-cyan-400 focus:ring-0"
                />
                <span className="ml-2">Remember me</span>
              </label>

              {canResetPassword && (
                <Link
                  href={route('password.request')}
                  className="text-sm text-cyan-300 underline decoration-cyan-400/40 underline-offset-4 hover:text-cyan-200"
                >
                  Forgot your password?
                </Link>
              )}
            </div>

            {/* Submit */}
            <Button
              type="submit"
              disabled={processing}
              className="w-full !bg-gradient-to-r !from-cyan-400 !to-teal-400 !text-black hover:from-cyan-300 hover:to-teal-300"
            >
              {processing ? 'Logging in…' : 'Login'}
            </Button>
          </form>

          {/* Register link */}
          <p className="text-center text-sm text-white/60">
            Don’t have an account?{' '}
            <Link
              href={route('register')}
              className="text-cyan-300 underline decoration-cyan-400/40 underline-offset-4 hover:text-cyan-200"
            >
              Register
            </Link>
          </p>
        </div>
      </section>
    </div>
  )
}
