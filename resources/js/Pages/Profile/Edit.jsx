import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';

export default function Edit({ mustVerifyEmail, status }) {
  return (
    <AuthenticatedLayout>
      <Head title="Profile" />

      <div className="py-12 max-w-5xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-gray-800">Profile Settings</h1>

        {/* Update Personal Info */}
        <section className="rounded-2xl bg-white shadow-lg p-6 md:p-8">
      
          <UpdateProfileInformationForm
            mustVerifyEmail={mustVerifyEmail}
            status={status}
            className="max-w-xl"
          />
        </section>

        {/* Update Password */}
        <section className="rounded-2xl bg-white shadow-lg p-6 md:p-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Change Password</h2>
          </div>
          <UpdatePasswordForm className="max-w-xl" />
        </section>

        {/* Delete Account */}
        <section className="rounded-2xl bg-white shadow-lg p-6 md:p-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-red-600">Close Your Account</h2>
          </div>
          <DeleteUserForm className="max-w-xl" />
        </section>
      </div>
    </AuthenticatedLayout>
  );
}
