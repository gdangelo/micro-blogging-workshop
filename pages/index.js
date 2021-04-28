import Head from 'next/head';
import Link from 'next/link';
import { TerminalIcon } from '@heroicons/react/outline';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Head>
        <title>Micro-Blogging App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header className="container mx-auto flex justify-between items-center h-16 px-4 sm:px-6 py-4 border-b border-gray-100">
        {/* Logo */}
        <Link href="/">
          <a className="flex items-center space-x-1 text-blue-600">
            <TerminalIcon className="w-8 h-8 flex-shrink-0" />
            <span className="font-bold text-lg tracking-tight">
              Blog for Dev
            </span>
          </a>
        </Link>

        {/* Sign up */}
        <button
          type="button"
          onClick={null}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md focus:outline-none focus:ring-4 focus:ring-blue-600 focus:ring-opacity-50 whitespace-nowrap"
        >
          Sign up
        </button>
      </header>

      <main className="flex-grow container mx-auto px-4 sm:px-6 py-12">
        {/* Hero section */}
        <section className="flex flex-col justify-center items-center text-center space-y-8">
          {/* Headlines */}
          <div className="space-y-2">
            <h1 className="text-3xl sm:text-4xl font-bold capitalize">
              The blogging platform for developers
            </h1>
            <h2 className="text-xl sm:text-2xl">
              Start your developer blog, share ideas, and connect with the dev
              community!
            </h2>
          </div>

          {/* CTA */}
          <button
            type="button"
            onClick={null}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md text-lg focus:outline-none focus:ring-4 focus:ring-blue-600 focus:ring-opacity-50 whitespace-nowrap"
          >
            Start your blog for free
          </button>
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
