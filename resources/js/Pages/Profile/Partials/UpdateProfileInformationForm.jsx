import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Transition } from '@headlessui/react';
import { Link, useForm, usePage } from '@inertiajs/react';

export default function UpdateProfileInformation({
  mustVerifyEmail,
  status,
  className = '',
}) {
  const user = usePage().props.auth.user;

  const { data, setData, patch, errors, processing, recentlySuccessful } =
    useForm({
      name: user.name,
      email: user.email,
    });

  const submit = (e) => {
    e.preventDefault();
    patch(route('profile.update'));
  };

  return (
    <section className={`overflow-hidden rounded-2xl border border-white/10 bg-[#0f1731] shadow ${className}`}>
      {/* Header */}
      <div className="border-b border-white/10 bg-gradient-to-r from-cyan-400/10 to-teal-400/10 px-6 py-5">
        <h2 className="text-lg font-semibold tracking-tight text-white">Profile Information</h2>
        <p className="mt-1 text-xs text-white/70">
          Update your profile details and email address.
        </p>
      </div>

      {/* Body */}
      <form onSubmit={submit} className="px-6 py-6 space-y-6">
        <div>
          <InputLabel htmlFor="name" value="Name" className="text-white/80" />
          <TextInput
            id="name"
            className="mt-1 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-white placeholder-white/30 outline-none focus:border-cyan-400/60"
            value={data.name}
            onChange={(e) => setData('name', e.target.value)}
            required
            isFocused
            autoComplete="name"
            placeholder="Your name"
          />
          <InputError className="mt-2 text-rose-400" message={errors.name} />
        </div>

        <div>
          <InputLabel htmlFor="email" value="Email" className="text-white/80" />
          <TextInput
            id="email"
            type="email"
            className="mt-1 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-white placeholder-white/30 outline-none focus:border-cyan-400/60"
            value={data.email}
            onChange={(e) => setData('email', e.target.value)}
            required
            autoComplete="username"
            placeholder="you@example.com"
          />
          <InputError className="mt-2 text-rose-400" message={errors.email} />
        </div>

        {mustVerifyEmail && user.email_verified_at === null && (
          <div className="rounded-lg border border-amber-400/20 bg-amber-400/10 px-3 py-3">
            <p className="text-sm text-amber-200">
              Your email address is unverified.{' '}
              <Link
                href={route('verification.send')}
                method="post"
                as="button"
                className="font-medium text-cyan-300 underline decoration-cyan-400/40 underline-offset-4 hover:text-cyan-200"
              >
                Click here to re-send the verification email.
              </Link>
            </p>

            {status === 'verification-link-sent' && (
              <div className="mt-2 text-sm font-medium text-emerald-300">
                A new verification link has been sent to your email address.
              </div>
            )}
          </div>
        )}

        <div className="flex items-center gap-4">
          <PrimaryButton
            disabled={processing}
            className="!bg-gradient-to-r !from-cyan-400 !to-teal-400 !text-black hover:from-cyan-300 hover:to-teal-300 rounded-md"
          >
            Save
          </PrimaryButton>

          <Transition
            show={recentlySuccessful}
            enter="transition ease-in-out"
            enterFrom="opacity-0 -translate-y-0.5"
            enterTo="opacity-100 translate-y-0"
            leave="transition ease-in-out"
            leaveFrom="opacity-100 translate-y-0"
            leaveTo="opacity-0 -translate-y-0.5"
          >
            <span className="inline-flex items-center rounded-full border border-emerald-400/30 bg-emerald-400/10 px-2.5 py-1 text-xs font-medium text-emerald-300">
              Saved
            </span>
          </Transition>
        </div>
      </form>
    </section>
  );
}
