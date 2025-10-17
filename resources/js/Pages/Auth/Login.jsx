import { Head, Link, useForm } from '@inertiajs/react';
import Button from '@/Components/Button';

export default function Login({ status, canResetPassword }) {
  const { data, setData, post, processing, errors } = useForm({
    email: '',
    password: '',
    remember: false,
  });

  const submit = (e) => {
    e.preventDefault();
    post(route('login'));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 via-violet-600 to-fuchsia-600 px-4">
      <Head title="Login" />

      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 space-y-6">
        <h1 className="text-2xl font-bold text-gray-900 text-center">Welcome to DevTrack</h1>
        <p className="text-gray-600 text-center">
          Manage your projects and issues efficiently
        </p>

        {status && <div className="text-sm text-green-600">{status}</div>}

        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={data.email}
              onChange={(e) => setData('email', e.target.value)}
              className="mt-1 w-full rounded-lg border px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
            {errors.email && <p className="text-xs text-red-600 mt-1">{errors.email}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              value={data.password}
              onChange={(e) => setData('password', e.target.value)}
              className="mt-1 w-full rounded-lg border px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
            {errors.password && <p className="text-xs text-red-600 mt-1">{errors.password}</p>}
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center text-sm">
              <input
                type="checkbox"
                checked={data.remember}
                onChange={(e) => setData('remember', e.target.checked)}
                className="rounded border-gray-300"
              />
              <span className="ml-2 text-gray-700">Remember me</span>
            </label>

            {canResetPassword && (
              <Link
                href={route('password.request')}
                className="text-sm text-indigo-700 hover:text-indigo-800"
              >
                Forgot your password?
              </Link>
            )}
          </div>

          <Button type="submit" className="w-full">
            {processing ? 'Logging in…' : 'Login'}
          </Button>
        </form>

        <div className="text-sm text-center text-gray-500">
          Don’t have an account?{' '}
          <Link href={route('register')} className="text-indigo-700 hover:text-indigo-800 underline">
            Register
          </Link>
        </div>
      </div>
    </div>
  );
}
