// resources/js/Pages/Profile/Edit.jsx
import { Head, useForm, usePage, router } from '@inertiajs/react'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { useState } from 'react'

export default function Edit() {
  const { auth, mustVerifyEmail, status } = usePage().props || {}
  const user = auth?.user

  // ----- Profile (name/email) form -----
  const {
    data: profile,
    setData: setProfile,
    patch: patchProfile,
    processing: savingProfile,
    errors: profileErrors,
  } = useForm({
    name: user?.name || '',
    email: user?.email || '',
  })

  function submitProfile(e) {
    e.preventDefault()
    patchProfile(route('profile.update'), { preserveScroll: true })
  }

  // ----- Password form -----
  const {
    data: pwd,
    setData: setPwd,
    patch: patchPwd,
    processing: savingPwd,
    errors: pwdErrors,
    reset: resetPwd,
  } = useForm({
    current_password: '',
    password: '',
    password_confirmation: '',
  })

  function submitPassword(e) {
    e.preventDefault()
    patchPwd(route('profile.password.update'), {
      preserveScroll: true,
      onSuccess: () => resetPwd('current_password', 'password', 'password_confirmation'),
    })
  }

  // ----- Resend verification -----
  const [sendingVerification, setSendingVerification] = useState(false)
  function resendVerification(e) {
    e.preventDefault()
    setSendingVerification(true)
    router.post(route('verification.send'), {}, {
      onFinish: () => setSendingVerification(false),
      preserveScroll: true,
    })
  }

  return (
    <AuthenticatedLayout>
      <Head title="Edit Profile" />

      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-white">Profile</h1>
        <p className="mt-1 text-sm text-white/60">
          Update your personal information and manage your password.
        </p>
      </div>

      {/* Global status (verification link sent) */}
      {status === 'verification-link-sent' && (
        <div className="mb-5 rounded-xl border border-amber-400/30 bg-amber-500/10 px-4 py-2 text-sm text-amber-200">
          A new verification link has been sent to your email address.
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        {/* Profile Card */}
        <section className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.03] p-6 shadow">
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-white">Profile Information</h2>
            <p className="mt-1 text-sm text-white/60">
              Your name and email as they’ll appear in the app.
            </p>
          </div>

          {mustVerifyEmail && user?.email_verified_at == null && (
            <div className="mb-4 rounded-xl border border-amber-400/30 bg-amber-500/10 p-3 text-sm text-amber-200">
              Your email address is <span className="font-semibold">unverified</span>.
              <button
                onClick={resendVerification}
                disabled={sendingVerification}
                className="ml-2 rounded-md border border-amber-400/30 bg-amber-400/10 px-2 py-1 text-amber-100 underline-offset-2 hover:bg-amber-400/20 disabled:opacity-60"
              >
                {sendingVerification ? 'Sending…' : 'Resend verification email'}
              </button>
            </div>
          )}

          <form onSubmit={submitProfile} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-white/80">Name</label>
              <input
                className="mt-1 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-white placeholder-white/30 outline-none focus:border-cyan-400/60"
                value={profile.name}
                onChange={(e) => setProfile('name', e.target.value)}
                placeholder="Your full name"
              />
              {profileErrors?.name && (
                <p className="mt-1 text-sm text-rose-400">{profileErrors.name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-white/80">Email</label>
              <input
                type="email"
                className="mt-1 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-white placeholder-white/30 outline-none focus:border-cyan-400/60"
                value={profile.email}
                onChange={(e) => setProfile('email', e.target.value)}
                placeholder="you@example.com"
              />
              {profileErrors?.email && (
                <p className="mt-1 text-sm text-rose-400">{profileErrors.email}</p>
              )}
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={savingProfile}
                className="w-full rounded-lg bg-gradient-to-r from-cyan-400 to-teal-400 px-4 py-2 text-sm font-semibold text-black transition hover:from-cyan-300 hover:to-teal-300 disabled:opacity-50"
              >
                {savingProfile ? 'Saving…' : 'Save Changes'}
              </button>
            </div>
          </form>
        </section>

        {/* Password Card */}
        <section className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.03] p-6 shadow">
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-white">Change Password</h2>
            <p className="mt-1 text-sm text-white/60">
              Use a strong password you haven’t used elsewhere.
            </p>
          </div>

          <form onSubmit={submitPassword} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-white/80">Current Password</label>
              <input
                type="password"
                className="mt-1 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-white placeholder-white/30 outline-none focus:border-cyan-400/60"
                value={pwd.current_password}
                onChange={(e) => setPwd('current_password', e.target.value)}
                placeholder="••••••••"
              />
              {pwdErrors?.current_password && (
                <p className="mt-1 text-sm text-rose-400">{pwdErrors.current_password}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-white/80">New Password</label>
              <input
                type="password"
                className="mt-1 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-white placeholder-white/30 outline-none focus:border-cyan-400/60"
                value={pwd.password}
                onChange={(e) => setPwd('password', e.target.value)}
                placeholder="At least 8 characters"
              />
              {pwdErrors?.password && (
                <p className="mt-1 text-sm text-rose-400">{pwdErrors.password}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-white/80">Confirm New Password</label>
              <input
                type="password"
                className="mt-1 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-white placeholder-white/30 outline-none focus:border-cyan-400/60"
                value={pwd.password_confirmation}
                onChange={(e) => setPwd('password_confirmation', e.target.value)}
                placeholder="Repeat new password"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={savingPwd}
                className="w-full rounded-lg bg-gradient-to-r from-cyan-400 to-teal-400 px-4 py-2 text-sm font-semibold text-black transition hover:from-cyan-300 hover:to-teal-300 disabled:opacity-50"
              >
                {savingPwd ? 'Updating…' : 'Update Password'}
              </button>
            </div>
          </form>
        </section>
      </div>
    </AuthenticatedLayout>
  )
}
