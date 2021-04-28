import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { signIn, signOut, useSession } from 'next-auth/client';
import GithubIcon from '../components/GithubIcon';
import { TerminalIcon } from '@heroicons/react/outline';

export default function Home() {
  const [session, loading] = useSession();

  return (
    <div className="min-h-screen flex flex-col">
      <Head>
        <title>Micro-Blogging App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header className="h-16 border-b border-gray-100">
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

          <div className="flex items-center space-x-6">
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

            <a
              href="https://github.com/gdangelo/micro-blogging-workshop"
              target="_blank"
              rel="noopener noreferrer"
              className="opacity-60 hover:opacity-100 transition-opacity"
            >
              <GithubIcon className="w-6 h-6 flex-shrink-0" />
            </a>
          </div>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 sm:px-6 py-12 flex flex-col justify-center items-center">
        {/* Hero section */}
        <section className="flex flex-col justify-center items-center text-center space-y-10">
          {/* Headlines */}
          <div className="space-y-4 max-w-4xl mx-auto">
            <h1 className="text-4xl sm:text-7xl font-bold capitalize">
              <span className="block">The blogging platform</span>{' '}
              <span className="block">for developers</span>
            </h1>
            <h2 className="text-xl sm:text-2xl">
              Start your developer blog, share ideas, and connect with the dev
              community!
            </h2>
          </div>

          {/* CTA */}
          <div className="space-y-2">
            <button
              type="button"
              onClick={() => signIn()}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md text-lg sm:text-xl focus:outline-none focus:ring-4 focus:ring-blue-600 focus:ring-opacity-50 whitespace-nowrap"
            >
              Start your blog for free
            </button>

            <p className="text-gray-500">
              Learn more on{' '}
              <a
                href="https://screencasts.alterclass.io"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-900 hover:text-blue-600 hover:underline"
              >
                AlterClass.io
              </a>
            </p>
          </div>
        </section>
      </main>

      <footer className="px-4 sm:px-6 py-6">
        {/* Copyright */}
        <p className="text-center text-sm text-gray-500">
          © {new Date().getFullYear()} AlterClass. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
