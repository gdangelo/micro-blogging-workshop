import Link from 'next/link';
import { signIn, signOut, useSession } from 'next-auth/client';
import { useTheme } from 'next-themes';

import GithubIcon from '../components/GithubIcon';
import { TerminalIcon } from '@heroicons/react/outline';
import { MoonIcon, SunIcon } from '@heroicons/react/solid';

const Header = () => {
  const [session, loading] = useSession();
  const { theme, setTheme } = useTheme();

  return (
    <header className="h-16 border-b border-gray-100 dark:border-gray-700">
      <div className="container mx-auto flex justify-between items-center px-4 sm:px-6 py-4">
        {/* Logo */}
        <Link href="/">
          <a className="flex items-center space-x-1 text-blue-600">
            <TerminalIcon className="w-8 h-8 flex-shrink-0" />
            <span className="font-bold text-lg tracking-tight">
              Blog for Dev
            </span>
          </a>
        </Link>

        <div className="flex items-center space-x-8">
          {!loading ? (
            <div>
              {/* Sign in */}
              {!session ? (
                <button
                  type="button"
                  onClick={() => signIn()}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md focus:outline-none focus:ring-4 focus:ring-blue-600 focus:ring-opacity-50 whitespace-nowrap"
                >
                  Sign in
                </button>
              ) : (
                <div className="flex items-center space-x-2">
                  <img
                    src={session.user.image}
                    width={32}
                    height={32}
                    className="rounded-full border-2 border-blue-600"
                    onClick={() => signOut()}
                  />
                  <p>
                    Hello, {session.user.name?.split(' ')?.[0] ?? 'there'}{' '}
                    <span role="img" aria-label="hello">
                      👋
                    </span>
                  </p>
                </div>
              )}
            </div>
          ) : null}

          <div className="flex items-center space-x-2">
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
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
