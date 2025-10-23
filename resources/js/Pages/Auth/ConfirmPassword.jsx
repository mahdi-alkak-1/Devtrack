// resources/js/Pages/Auth/ConfirmPassword.jsx
import InputError from '@/Components/InputError'
import InputLabel from '@/Components/InputLabel'
import PrimaryButton from '@/Components/PrimaryButton'
import TextInput from '@/Components/TextInput'
import GuestLayout from '@/Layouts/GuestLayout'
import { Head, useForm } from '@inertiajs/react'

export default function ConfirmPassword() {
  const { data, setData, post, processing, errors, reset } = useForm({
    password: '',
  })

  const submit = (e) => {
    e.preventDefault()
    post(route('password.confirm'), {
      onFinish: () => reset('password'),
    })
  }

  return (
    <GuestLayout>
      <Head title="Confirm Password" />

      {/* Shell */}
      <div className="mx-auto w-full max-w-md">
        {/* Card */}
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#0f1731] shadow-lg">
          {/* Accent bar */}
          <div className="h-1 w-full bg-gradient-to-r from-cyan-400 to-teal-400" />

          {/* Header */}
          <div className="px-6 pt-6">
            <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-white">
              {/* Lock icon */}
              <svg
                viewBox="0 0 24 24"
                width="18"
                height="18"
                stroke="currentColor"
                fill="none"
                strokeWidth="2"
                className="text-white"
              >
                <rect x="3" y="11" width="18" height="10" rx="2" />
                <path d="M7 11V8a5 5 0 0 1 10 0v3" />
              </svg>
            </div>

            <h1 className="text-lg font-semibold text-white">Confirm your password</h1>
            <p className="mt-1 text-sm text-white/70">
              This is a secure area of the application. Please confirm your password before continuing.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={submit} className="px-6 pb-6 pt-4">
            <div className="mt-2">
              <InputLabel htmlFor="password" value="Password" className="text-white/90" />

              <TextInput
                id="password"
                type="password"
                name="password"
                value={data.password}
                className="mt-1 block w-full rounded-lg border-white/10 bg-white/5 text-white placeholder-white/40 focus:border-cyan-400/60"
                isFocused={true}
                autoComplete="current-password"
                onChange={(e) => setData('password', e.target.value)}
                placeholder="••••••••"
              />

              <InputError message={errors.password} className="mt-2 text-rose-400" />
            </div>

            {/* Actions */}
            <div className="mt-6 flex items-center justify-end">
              <PrimaryButton
                className="!bg-gradient-to-r !from-cyan-400 !to-teal-400 !text-black hover:from-cyan-300 hover:to-teal-300"
                disabled={processing}
              >
                {processing ? 'Confirming…' : 'Confirm'}
              </PrimaryButton>
            </div>
          </form>
        </div>

        {/* Small footnote */}
        <p className="mt-3 text-center text-xs text-white/50">
          Having trouble? Make sure Caps Lock is off.
        </p>
      </div>
    </GuestLayout>
  )
}
