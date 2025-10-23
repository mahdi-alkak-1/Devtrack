import InputError from '@/Components/InputError'
import InputLabel from '@/Components/InputLabel'
import PrimaryButton from '@/Components/PrimaryButton'
import TextInput from '@/Components/TextInput'
import GuestLayout from '@/Layouts/GuestLayout'
import { Head, useForm } from '@inertiajs/react'

export default function ForgotPassword({ status }) {
  const { data, setData, post, processing, errors } = useForm({ email: '' })

  const submit = (e) => {
    e.preventDefault()
    post(route('password.email'))
  }

  return (
    <GuestLayout>
      <Head title="Forgot Password" />

      <div className="min-h-screen grid place-items-center bg-[#0b1228] px-4">
        <section className="w-full max-w-md overflow-hidden rounded-2xl border border-white/10 bg-[#0f1731] shadow">
          {/* Header */}
          <div className="border-b border-white/10 bg-gradient-to-r from-cyan-400/10 to-teal-400/10 px-6 py-5">
            <h1 className="text-lg font-semibold tracking-tight text-white">Forgot your password?</h1>
            <p className="mt-1 text-xs text-white/60">
              Enter your email and we’ll send you a reset link.
            </p>
          </div>

          {/* Body */}
          <div className="p-6 space-y-5">
            {status && (
              <div className="rounded-lg border border-emerald-400/20 bg-emerald-400/10 px-3 py-2 text-sm text-emerald-300">
                {status}
              </div>
            )}

            <form onSubmit={submit} className="space-y-4">
              <div>
                <InputLabel htmlFor="email" value="Email" className="text-white/80" />
                <TextInput
                  id="email"
                  type="email"
                  name="email"
                  value={data.email}
                  onChange={(e) => setData('email', e.target.value)}
                  isFocused
                  className="mt-1 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-white placeholder-white/30 outline-none focus:border-cyan-400/60"
                  placeholder="you@example.com"
                />
                <InputError message={errors.email} className="mt-2 text-rose-400" />
              </div>

              <div className="pt-2">
                <PrimaryButton
                  disabled={processing}
                  className="w-full !bg-gradient-to-r !from-cyan-400 !to-teal-400 !text-black hover:from-cyan-300 hover:to-teal-300"
                >
                  {processing ? 'Sending reset link…' : 'Send Reset Link'}
                </PrimaryButton>
              </div>
            </form>
          </div>
        </section>
      </div>
    </GuestLayout>
  )
}
