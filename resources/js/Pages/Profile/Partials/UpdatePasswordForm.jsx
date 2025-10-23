import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Transition } from '@headlessui/react';
import { useForm } from '@inertiajs/react';
import { useRef } from 'react';

export default function UpdatePasswordForm({ className = '' }) {
  const passwordInput = useRef();
  const currentPasswordInput = useRef();

  const {
    data,
    setData,
    errors,
    put,
    reset,
    processing,
    recentlySuccessful,
  } = useForm({
    current_password: '',
    password: '',
    password_confirmation: '',
  });

  const updatePassword = (e) => {
    e.preventDefault();

    put(route('password.update'), {
      preserveScroll: true,
      onSuccess: () => reset(),
      onError: (errors) => {
        if (errors.password) {
          reset('password', 'password_confirmation');
          passwordInput.current.focus();
        }

        if (errors.current_password) {
          reset('current_password');
          currentPasswordInput.current.focus();
        }
      },
    });
  };

  return (
    <section className={`overflow-hidden rounded-2xl border border-white/10 bg-[#0f1731] shadow ${className}`}>
      {/* Header */}
      <div className="border-b border-white/10 bg-gradient-to-r from-cyan-400/10 to-teal-400/10 px-6 py-5">
        <h2 className="text-lg font-semibold tracking-tight text-white">Update Password</h2>
        <p className="mt-1 text-xs text-white/70">Use a long, unique password to keep your account secure.</p>
      </div>

      {/* Body */}
      <form onSubmit={updatePassword} className="px-6 py-6 space-y-6">
        <div>
          <InputLabel htmlFor="current_password" value="Current Password" className="text-white/80" />
          <TextInput
            id="current_password"
            ref={currentPasswordInput}
            value={data.current_password}
            onChange={(e) => setData('current_password', e.target.value)}
            type="password"
            className="mt-1 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-white placeholder-white/30 outline-none focus:border-cyan-400/60"
            autoComplete="current-password"
            placeholder="••••••••"
          />
          <InputError message={errors.current_password} className="mt-2 text-rose-400" />
        </div>

        <div>
          <InputLabel htmlFor="password" value="New Password" className="text-white/80" />
          <TextInput
            id="password"
            ref={passwordInput}
            value={data.password}
            onChange={(e) => setData('password', e.target.value)}
            type="password"
            className="mt-1 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-white placeholder-white/30 outline-none focus:border-cyan-400/60"
            autoComplete="new-password"
            placeholder="••••••••"
          />
          <InputError message={errors.password} className="mt-2 text-rose-400" />
        </div>

        <div>
          <InputLabel htmlFor="password_confirmation" value="Confirm Password" className="text-white/80" />
          <TextInput
            id="password_confirmation"
            value={data.password_confirmation}
            onChange={(e) => setData('password_confirmation', e.target.value)}
            type="password"
            className="mt-1 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-white placeholder-white/30 outline-none focus:border-cyan-400/60"
            autoComplete="new-password"
            placeholder="••••••••"
          />
          <InputError message={errors.password_confirmation} className="mt-2 text-rose-400" />
        </div>

        <div className="flex items-center gap-4">
          <PrimaryButton disabled={processing} className="!bg-gradient-to-r !from-cyan-400 !to-teal-400 !text-black hover:from-cyan-300 hover:to-teal-300 rounded-md">
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
