import InputError from '@/Components/InputError'
import InputLabel from '@/Components/InputLabel'
import PrimaryButton from '@/Components/PrimaryButton'
import TextInput from '@/Components/TextInput'
import GuestLayout from '@/Layouts/GuestLayout'
import { Head, Link, useForm } from '@inertiajs/react'

export default function Register() {
  const { data, setData, post, processing, errors, reset } = useForm({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
  })

  const submit = (e) => {
    e.preventDefault()
    post(route('register'), { onFinish: () => reset('password', 'password_confirmation') })
  }

  return (
    <GuestLayout>
      <Head title="Register" />

      <div className="min-h-screen grid place-items-center bg-[#0b1228] px-4">
        <section className="w-full max-w-md overflow-hidden rounded-2xl border border-white/10 bg-[#0f1731] shadow">
          {/* Header */}
          <div className="border-b border-white/10 bg-gradient-to-r from-cyan-400/10 to-teal-400/10 px-6 py-5">
            <h1 className="text-lg font-semibold tracking-tight text-white">Create your DevTrack account</h1>
            <p className="mt-1 text-xs text-white/60">Manage your projects and issues efficiently.</p>
          </div>

          {/* Body */}
          <div className="p-6">
            <form onSubmit={submit} className="space-y-4">
              {/* Name */}
              <div>
                <InputLabel htmlFor="name" value="Name" className="text-white/80" />
                <TextInput
                  id="name"
                  name="name"
                  value={data.name}
                  onChange={(e) => setData('name', e.target.value)}
                  autoComplete="name"
                  isFocused
                  className="mt-1 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-white placeholder-white/30 outline-none focus:border-cyan-400/60"
                  placeholder="Your full name"
                  required
                />
                <InputError message={errors.name} className="mt-2 text-rose-400" />
              </div>

              {/* Email */}
              <div>
                <InputLabel htmlFor="email" value="Email" className="text-white/80" />
                <TextInput
                  id="email"
                  type="email"
                  name="email"
                  value={data.email}
                  onChange={(e) => setData('email', e.target.value)}
                  autoComplete="username"
                  className="mt-1 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-white placeholder-white/30 outline-none focus:border-cyan-400/60"
                  placeholder="you@example.com"
                  required
                />
                <InputError message={errors.email} className="mt-2 text-rose-400" />
              </div>

              {/* Password */}
              <div>
                <InputLabel htmlFor="password" value="Password" className="text-white/80" />
                <TextInput
                  id="password"
                  type="password"
                  name="password"
                  value={data.password}
                  onChange={(e) => setData('password', e.target.value)}
                  autoComplete="new-password"
                  className="mt-1 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-white placeholder-white/30 outline-none focus:border-cyan-400/60"
                  placeholder="••••••••"
                  required
                />
                <InputError message={errors.password} className="mt-2 text-rose-400" />
              </div>

              {/* Confirm Password */}
              <div>
                <InputLabel htmlFor="password_confirmation" value="Confirm Password" className="text-white/80" />
                <TextInput
                  id="password_confirmation"
                  type="password"
                  name="password_confirmation"
                  value={data.password_confirmation}
                  onChange={(e) => setData('password_confirmation', e.target.value)}
                  autoComplete="new-password"
                  className="mt-1 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-white placeholder-white/30 outline-none focus:border-cyan-400/60"
                  placeholder="••••••••"
                  required
                />
                <InputError message={errors.password_confirmation} className="mt-2 text-rose-400" />
              </div>

              {/* Actions */}
              <div className="mt-2 flex items-center justify-between">
                <Link
                  href={route('login')}
                  className="text-sm text-cyan-300 underline decoration-cyan-400/40 underline-offset-4 hover:text-cyan-200"
                >
                  Already registered?
                </Link>

                <PrimaryButton
                  disabled={processing}
                  className="!bg-gradient-to-r !from-cyan-400 !to-teal-400 !text-black hover:from-cyan-300 hover:to-teal-300"
                >
                  {processing ? 'Creating account…' : 'Register'}
                </PrimaryButton>
              </div>
            </form>
          </div>
        </section>
      </div>
    </GuestLayout>
  )
}
