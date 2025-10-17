import Dropdown from '@/Components/Dropdown';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import { useState } from 'react';
import { usePage } from '@inertiajs/react';

export default function AuthenticatedLayout({ header, children }) {
  const { auth, flash } = usePage().props;
  const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Modern Top Nav */}
      <header className="sticky top-0 z-20 bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 text-white shadow-md">
        <nav className="mx-auto flex h-16 max-w-6xl items-center justify-end px-6">
          {/* Right-side: User info + Dropdown */}
          {auth?.user && (
            <div className="flex items-center gap-4 text-sm">
              {/* User Name */}
              <span className="text-white font-medium">{auth.user.name}</span>

              {/* Dropdown */}
              <Dropdown>
                <Dropdown.Trigger>
                  <span className="inline-flex rounded-md">
                    <button
                      type="button"
                      className="inline-flex items-center rounded-md bg-white bg-opacity-20 px-3 py-2 text-sm font-medium text-white transition-all duration-200 hover:bg-opacity-30 focus:outline-none focus:ring-2 focus:ring-white"
                    >
                      Options
                      <svg
                        className="ml-2 h-4 w-4"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </span>
                </Dropdown.Trigger>

                <Dropdown.Content className="bg-white shadow-lg rounded-md py-1">
                  <Dropdown.Link href={route('profile.edit')} className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                    Profile
                  </Dropdown.Link>
                  <Dropdown.Link
                    href={route('logout')}
                    method="post"
                    as="button"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    Log Out
                  </Dropdown.Link>
                </Dropdown.Content>
              </Dropdown>
            </div>
          )}

          {/* Mobile menu toggle */}
          <div className="-mr-2 flex items-center sm:hidden">
            <button
              onClick={() => setShowingNavigationDropdown((prev) => !prev)}
              className="inline-flex items-center justify-center rounded-md p-2 text-white hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white transition"
            >
              <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                <path
                  className={!showingNavigationDropdown ? 'inline-flex' : 'hidden'}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
                <path
                  className={showingNavigationDropdown ? 'inline-flex' : 'hidden'}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </nav>

        {/* Mobile dropdown menu */}
        <div className={(showingNavigationDropdown ? 'block' : 'hidden') + ' sm:hidden bg-white shadow-md'}>
          <div className="px-4 py-2 border-b border-gray-200">
            <div className="text-base font-medium text-gray-800">{auth.user.name}</div>
            <div className="text-sm font-medium text-gray-500">{auth.user.email}</div>
          </div>
          <div className="space-y-1 px-4 py-2">
            <ResponsiveNavLink href={route('profile.edit')} className="block text-gray-700 hover:bg-gray-100 px-3 py-2 rounded-md">
              Profile
            </ResponsiveNavLink>
            <ResponsiveNavLink
              href={route('logout')}
              method="post"
              as="button"
              className="block text-gray-700 hover:bg-gray-100 px-3 py-2 rounded-md"
            >
              Log Out
            </ResponsiveNavLink>
          </div>
        </div>
      </header>

      {/* Optional Page Header */}
      {header && (
        <header className="bg-white shadow">
          <div className="mx-auto max-w-6xl px-4 py-6">{header}</div>
        </header>
      )}

      {/* Page Content */}
      <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>

      {/* Footer */}
      <footer className="mt-10 border-t py-6 text-center text-xs text-gray-500">
        © {new Date().getFullYear()} DevTrack
      </footer>
    </div>
  );
}
