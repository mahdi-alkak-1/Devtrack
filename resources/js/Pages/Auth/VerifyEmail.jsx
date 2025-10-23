// resources/js/Pages/Auth/VerifyEmail.jsx
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { Head, Link, useForm, usePage } from '@inertiajs/react'
import Button from '@/Components/Button'

export default function VerifyEmail({ status }) {
  const { auth } = usePage().props
  const firstName = auth?.user?.name?.split(' ')[0] || 'there'
  const { post, processing } = useForm({})

  const submit = (e) => {
    e.preventDefault()
    post(route('verification.send'))
  }

  return (
    <AuthenticatedLayout>
      <Head title="Verify Email" />

      {/* Hero */}
      <section className="mb-6 overflow-hidden rounded-2xl border border-white/10 bg-[#0f1731] p-6 shadow-lg sm:p-8">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-white">
              Verify your email, {firstName} <span className="text-cyan-300">📧</span>
            </h1>
            <p className="mt-1 text-sm text-white/70">
              We’ve sent a verification link to your inbox. Click it to activate your account.
              Didn’t get it? You can resend below.
            </p>
          </div>

        </div>
      </section>

      {/* Status banner (if just sent) */}
      {status === 'verification-link-sent' && (
        <div className="mb-6 overflow-hidden rounded-xl border border-emerald-400/20 bg-emerald-900/30 shadow">
          <div className="h-1 w-full bg-gradient-to-r from-emerald-400 to-teal-400" />
          <div className="p-4 text-sm font-medium text-emerald-200">
            A new verification link has been sent to the email address you provided during registration.
          </div>
        </div>
      )}

      {/* Action card */}
      <section className="rounded-2xl border border-white/10 bg-[#0f1731] p-5 shadow">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold tracking-tight text-white">Email Verification</h2>
          <span className="text-xs text-white/50">
            Signed in as <span className="font-medium text-white/80">{auth?.user?.email}</span>
          </span>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-white/10 bg-[#0f1731]">
            <div className="h-1 w-full bg-gradient-to-r from-cyan-400 to-teal-400" />
            <div className="p-5">
              <div className="text-sm text-white/70">Resend Link</div>
              <p className="mt-1 text-white/80 text-sm">
                Didn’t receive the email? Resend a fresh verification link to your inbox.
              </p>
              <form onSubmit={submit} className="mt-4">
                <Button disabled={processing} className="!bg-gradient-to-r !from-cyan-400 !to-teal-400 !text-black hover:from-cyan-300 hover:to-teal-300">
                  {processing ? 'Sending…' : 'Resend Verification Email'}
                </Button>
              </form>
            </div>
          </div>

          <div className="rounded-xl border border-white/10 bg-[#0f1731]">
            <div className="h-1 w-full bg-gradient-to-r from-rose-400 to-amber-400" />
            <div className="p-5">
              <div className="text-sm text-white/70">Need to switch account?</div>
              <p className="mt-1 text-white/80 text-sm">
                Log out to register or sign in with a different email.
              </p>
              <form method="post" action={route('logout')} className="mt-4">
                {/* Inertia Link with method=post also works; plain form keeps it simple */}
                <Button variant="outline">Log Out</Button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </AuthenticatedLayout>
  )
}
