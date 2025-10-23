import InputError from '@/Components/InputError'
import InputLabel from '@/Components/InputLabel'
import PrimaryButton from '@/Components/PrimaryButton'
import TextInput from '@/Components/TextInput'
import GuestLayout from '@/Layouts/GuestLayout'
import { Head, useForm } from '@inertiajs/react'

export default function ResetPassword({ token, email }) {
  const { data, setData, post, processing, errors, reset } = useForm({
    token,
    email,
    password: '',
    password_confirmation: '',
  })

  const submit = (e) => {
    e.preventDefault()
    post(route('password.store'), {
      onFinish: () => reset('password', 'password_confirmation'),
    })
  }

  return (
    <GuestLayout>
      <Head title="Reset Password" />

      <div className="mx-auto w-full max-w-md">
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#0f1731] shadow-lg">
          {/* Accent */}
          <div className="h-1 w-full bg-gradient-to-r from-cyan-400 to-teal-400" />

          {/* Header */}
          <div className="px-6 pt-6">
            <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-white">
              {/* key icon */}
              <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" fill="none" strokeWidth="2">
                <path d="M15 7a5 5 0 1 0-4 8l-1 2h-2v2H6v2H4" />
                <circle cx="15" cy="7" r="1.5" />
              </svg>
            </div>
            <h1 className="text-lg font-semibold text-white">Create a new password</h1>
            <p className="mt-1 text-sm text-white/70">
              Enter your email and a strong password you haven't used before.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={submit} className="px-6 pb-6 pt-4">
            {/* Email */}
            <div>
              <InputLabel htmlFor="email" value="Email" className="text-white/90" />
              <TextInput
                id="email"
                type="email"
                name="email"
                value={data.email}
                className="mt-1 block w-full rounded-lg border-white/10 bg-white/5 text-white placeholder-white/40 focus:border-cyan-400/60"
                autoComplete="username"
                onChange={(e) => setData('email', e.target.value)}
                placeholder="you@example.com"
              />
              <InputError message={errors.email} className="mt-2 text-rose-400" />
            </div>

            {/* Password */}
            <div className="mt-4">
              <InputLabel htmlFor="password" value="New Password" className="text-white/90" />
              <TextInput
                id="password"
                type="password"
                name="password"
                value={data.password}
                className="mt-1 block w-full rounded-lg border-white/10 bg-white/5 text-white placeholder-white/40 focus:border-cyan-400/60"
                autoComplete="new-password"
                isFocused={true}
                onChange={(e) => setData('password', e.target.value)}
                placeholder="••••••••"
              />
              <p className="mt-1 text-xs text-white/50">Use at least 8 characters, with a mix of letters and numbers.</p>
              <InputError message={errors.password} className="mt-2 text-rose-400" />
            </div>

            {/* Confirm */}
            <div className="mt-4">
              <InputLabel htmlFor="password_confirmation" value="Confirm New Password" className="text-white/90" />
              <TextInput
                type="password"
                id="password_confirmation"
                name="password_confirmation"
                value={data.password_confirmation}
                className="mt-1 block w-full rounded-lg border-white/10 bg-white/5 text-white placeholder-white/40 focus:border-cyan-400/60"
                autoComplete="new-password"
                onChange={(e) => setData('password_confirmation', e.target.value)}
                placeholder="••••••••"
              />
              <InputError message={errors.password_confirmation} className="mt-2 text-rose-400" />
            </div>

            {/* Submit */}
            <div className="mt-6 flex items-center justify-end">
              <PrimaryButton
                className="!bg-gradient-to-r !from-cyan-400 !to-teal-400 !text-black hover:from-cyan-300 hover:to-teal-300"
                disabled={processing}
              >
                {processing ? 'Resetting…' : 'Reset Password'}
              </PrimaryButton>
            </div>
          </form>
        </div>

        <p className="mt-3 text-center text-xs text-white/50">
          If this wasn’t you, you can safely ignore this page.
        </p>
      </div>
    </GuestLayout>
  )
}
