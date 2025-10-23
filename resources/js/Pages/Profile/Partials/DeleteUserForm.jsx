import DangerButton from '@/Components/DangerButton';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import Modal from '@/Components/Modal';
import SecondaryButton from '@/Components/SecondaryButton';
import TextInput from '@/Components/TextInput';
import { useForm } from '@inertiajs/react';
import { useRef, useState } from 'react';

export default function DeleteUserForm({ className = '' }) {
  const [confirmingUserDeletion, setConfirmingUserDeletion] = useState(false);
  const passwordInput = useRef();

  const {
    data,
    setData,
    delete: destroy,
    processing,
    reset,
    errors,
    clearErrors,
  } = useForm({
    password: '',
  });

  const confirmUserDeletion = () => {
    setConfirmingUserDeletion(true);
  };

  const deleteUser = (e) => {
    e.preventDefault();

    destroy(route('profile.destroy'), {
      preserveScroll: true,
      onSuccess: () => closeModal(),
      onError: () => passwordInput.current.focus(),
      onFinish: () => reset(),
    });
  };

  const closeModal = () => {
    setConfirmingUserDeletion(false);

    clearErrors();
    reset();
  };

  return (
    <section
      className={`overflow-hidden rounded-2xl border border-white/10 bg-[#0f1731] shadow ${className}`}
    >
      {/* Header */}
      <div className="border-b border-white/10 bg-gradient-to-r from-cyan-400/10 to-teal-400/10 px-6 py-5">
        <h2 className="text-lg font-semibold tracking-tight text-white">Delete Account</h2>
        <p className="mt-1 text-xs text-white/70">
          Once your account is deleted, all of its resources and data will be permanently removed.
          Consider downloading any information you wish to keep.
        </p>
      </div>

      {/* Body */}
      <div className="px-6 py-5">
        <DangerButton onClick={confirmUserDeletion} className="!rounded-md">
          Delete Account
        </DangerButton>
      </div>

      {/* Modal */}
      <Modal show={confirmingUserDeletion} onClose={closeModal}>
        <form onSubmit={deleteUser} className="w-full max-w-lg rounded-2xl border border-white/10 bg-[#0f1731] p-6 shadow-2xl">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-rose-500/30 to-orange-500/30 text-white">
              !
            </div>
            <div className="min-w-0">
              <h2 className="text-base font-semibold text-white">Are you sure you want to delete your account?</h2>
              <p className="mt-1 text-sm text-white/70">
                This action is permanent. Please enter your password to confirm.
              </p>
            </div>
          </div>

          <div className="mt-6">
            <InputLabel htmlFor="password" value="Password" className="text-white/80" />
            <TextInput
              id="password"
              type="password"
              name="password"
              ref={passwordInput}
              value={data.password}
              onChange={(e) => setData('password', e.target.value)}
              className="mt-1 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-white placeholder-white/30 outline-none focus:border-cyan-400/60"
              isFocused
              placeholder="••••••••"
            />
            <InputError message={errors.password} className="mt-2 text-rose-400" />
          </div>

          <div className="mt-6 flex justify-end gap-2">
            <SecondaryButton onClick={closeModal} className="rounded-md border-white/10 bg-white/5 text-white/80 hover:bg-white/10">
              Cancel
            </SecondaryButton>
            <DangerButton className="ms-1 rounded-md" disabled={processing}>
              Delete Account
            </DangerButton>
          </div>
        </form>
      </Modal>
    </section>
  );
}
