import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, useForm } from '@inertiajs/react';

export default function ForgotPassword({ status }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const submit = (e) => {
        e.preventDefault();
        console.log("Form submitted with email:", data.email); // Debugging log
        post(route('password.email'));
    };

    return (
        <GuestLayout>
            <Head title="Forgot Password" />

            {/* Main Content */}
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 via-violet-600 to-fuchsia-600 px-4">
                <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 space-y-6">
                    <h1 className="text-2xl font-bold text-gray-900 text-center">Forgot your password?</h1>
                    <p className="text-gray-600 text-center">
                        Enter your email address and we will send you a password reset link.
                    </p>

                    {/* Status Message (If any) */}
                    {status && (
                        <div className="mb-4 text-sm font-medium text-green-600">{status}</div>
                    )}

                    {/* Form */}
                    <form onSubmit={submit} className="space-y-4">
                        {/* Email Input Field */}
                        <div>
                            <InputLabel htmlFor="email" value="Email" />
                            <TextInput
                                id="email"
                                type="email"
                                name="email"
                                value={data.email}
                                className="mt-1 w-full rounded-lg border px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
                                isFocused={true}
                                onChange={(e) => setData('email', e.target.value)} // update email
                            />
                            <InputError message={errors.email} className="mt-2" /> {/* Error handling for email */}
                        </div>

                        {/* Submit Button */}
                        <div className="mt-4 flex items-center justify-end">
                            <PrimaryButton className="ms-4" disabled={processing}>
                                {processing ? 'Sending reset link…' : 'Send Reset Link'}
                            </PrimaryButton>
                        </div>
                    </form>
                </div>
            </div>
        </GuestLayout>
    );
}
