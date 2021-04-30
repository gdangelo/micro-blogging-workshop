import { useState, useEffect } from 'react';
import { signIn, useSession } from 'next-auth/client';
import { useTheme } from 'next-themes';

import { Logo, FlyoutMenu, MobileMenu, GithubIcon } from '@/components/index';
import {
  ChevronDownIcon,
  GlobeIcon,
  PlusCircleIcon,
} from '@heroicons/react/outline';
import { MoonIcon, SunIcon } from '@heroicons/react/solid';

const links = [
  {
    text: 'Write a new post',
    icon: PlusCircleIcon,
    href: '/draft',
  },
  {
    text: 'My posts',
    icon: GlobeIcon,
    href: '/posts',
  },
];

const Header = () => {
  const [session, loading] = useSession();
  const { theme, setTheme } = useTheme();

  const [menuOpen, setMenuOpen] = useState(false);
  const [isLargeScreen, setIsLargeScreen] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia('(min-width: 640px)');

    if (mql.matches) {
      setIsLargeScreen(true);
    }

    const eventListener = event => {
      setIsLargeScreen(event.matches);
    };

    mql.addEventListener('change', eventListener);

    return () => {
      mql.removeEventListener('change', eventListener);
    };
  }, []);

  return (
    <header className="border-b border-gray-100 dark:border-gray-700">
      <div className="container mx-auto flex justify-between items-center px-4 sm:px-6 py-4">
        <Logo />

        <div className="flex items-center space-x-2 sm:space-x-3">
          <a
            href="https://github.com/gdangelo/micro-blogging-workshop"
            target="_blank"
            rel="noopener noreferrer"
          >
            <GithubIcon className="w-6 h-6" />
          </a>

          {theme === 'dark' ? (
            <SunIcon
              className="w-6 h-6"
              role="button"
              onClick={() => setTheme('light')}
            />
          ) : (
            <MoonIcon
              className="w-6 h-6"
              role="button"
              onClick={() => setTheme('dark')}
            />
          )}

          {!loading ? (
            <div>
              {/* Sign in */}
              {!session ? (
                <button
                  type="button"
                  onClick={() => signIn()}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-2 sm:px-4 py-1 sm:py-2 rounded-md focus:outline-none focus:ring-4 focus:ring-blue-600 focus:ring-opacity-50 whitespace-nowrap"
                >
                  Sign in
                </button>
              ) : (
                <div
                  className="relative flex items-center space-x-1 sm:space-x-2"
                  role="button"
                  onClick={() => setMenuOpen(prev => !prev)}
                >
                  <img
                    src={session.user.image}
                    alt={session.user.name}
                    className="rounded-full border-2 border-blue-600 w-8 h-8"
                  />
                  <p className="flex items-center sm:space-x-1">
                    <span className="hidden sm:inline-block">
                      Hello, {session.user.name?.split(' ')?.[0] ?? 'there'}
                    </span>{' '}
                    <ChevronDownIcon className="w-4 h-4 flex-shrink-0 mt-1" />
                  </p>

                  <FlyoutMenu
                    links={links}
                    show={isLargeScreen && menuOpen}
                    onClose={() => setMenuOpen(false)}
                  />
                </div>
              )}
            </div>
          ) : null}
        </div>
      </div>

      {/* Mobile menu */}
      <MobileMenu
        links={links}
        show={!isLargeScreen && menuOpen}
        onClose={() => setMenuOpen(false)}
      />
    </header>
  );
};

export default Header;
