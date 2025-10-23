import { Head, useForm, usePage, router } from '@inertiajs/react'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { useState } from 'react'

export default function Edit() {
  const { auth, errors, mustVerifyEmail, status } = usePage().props || {}
  const user = auth?.user

  // ----- Profile (name/email) form -----
  const {
    data: profile,
    setData: setProfile,
    patch: patchProfile,
    processing: savingProfile,
    errors: profileErrors,
    reset: resetProfile,
  } = useForm({
    name: user?.name || '',
    email: user?.email || '',
  })

  function submitProfile(e) {
    e.preventDefault()
    patchProfile(route('profile.update'), {
      preserveScroll: true,
    })
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

  // resend email verification
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

      <h1 className="mb-6 text-2xl font-semibold">Profile</h1>

      {/* Flash success */}
      {status === 'verification-link-sent' && (
        <div className="mb-4 rounded-md border border-amber-300 bg-amber-50 px-4 py-2 text-sm text-amber-800">
          A new verification link has been sent to your email address.
        </div>
      )}

      {/* Profile Card */}
      <section className="mb-8 rounded-xl border bg-white p-6 shadow-sm">
        <h2 className="mb-3 text-lg font-medium">Profile Information</h2>
        {mustVerifyEmail && user?.email_verified_at == null && (
          <div className="mb-4 rounded-md border border-amber-300 bg-amber-50 px-4 py-2 text-sm text-amber-800">
            Your email address is unverified.
            <button
              onClick={resendVerification}
              disabled={sendingVerification}
              className="ml-3 underline hover:text-amber-900 disabled:opacity-60"
            >
              {sendingVerification ? 'Sending…' : 'Click here to re-send the verification email.'}
            </button>
          </div>
        )}

        <form onSubmit={submitProfile} className="grid grid-cols-1 gap-4 md:max-w-lg">
          <div>
            <label className="block text-sm font-medium">Name</label>
            <input
              className="mt-1 w-full rounded border px-3 py-2"
              value={profile.name}
              onChange={(e) => setProfile('name', e.target.value)}
            />
            {profileErrors?.name && <p className="mt-1 text-sm text-rose-600">{profileErrors.name}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium">Email</label>
            <input
              type="email"
              className="mt-1 w-full rounded border px-3 py-2"
              value={profile.email}
              onChange={(e) => setProfile('email', e.target.value)}
            />
            {profileErrors?.email && <p className="mt-1 text-sm text-rose-600">{profileErrors.email}</p>}
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={savingProfile}
              className="rounded bg-black px-4 py-2 text-white disabled:opacity-50"
            >
              {savingProfile ? 'Saving…' : 'Save'}
            </button>
          </div>
        </form>
      </section>

      {/* Password Card */}
      <section className="rounded-xl border bg-white p-6 shadow-sm md:max-w-lg">
        <h2 className="mb-3 text-lg font-medium">Change Password</h2>
        <form onSubmit={submitPassword} className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-sm font-medium">Current Password</label>
            <input
              type="password"
              className="mt-1 w-full rounded border px-3 py-2"
              value={pwd.current_password}
              onChange={(e) => setPwd('current_password', e.target.value)}
            />
            {pwdErrors?.current_password && (
              <p className="mt-1 text-sm text-rose-600">{pwdErrors.current_password}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium">New Password</label>
            <input
              type="password"
              className="mt-1 w-full rounded border px-3 py-2"
              value={pwd.password}
              onChange={(e) => setPwd('password', e.target.value)}
            />
            {pwdErrors?.password && <p className="mt-1 text-sm text-rose-600">{pwdErrors.password}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium">Confirm New Password</label>
            <input
              type="password"
              className="mt-1 w-full rounded border px-3 py-2"
              value={pwd.password_confirmation}
              onChange={(e) => setPwd('password_confirmation', e.target.value)}
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={savingPwd}
              className="rounded bg-black px-4 py-2 text-white disabled:opacity-50"
            >
              {savingPwd ? 'Updating…' : 'Update Password'}
            </button>
          </div>
        </form>
      </section>
    </AuthenticatedLayout>
  )
}
