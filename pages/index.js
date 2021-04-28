import Head from 'next/head';
import Link from 'next/link';
import { signIn, useSession } from 'next-auth/client';
import { PencilIcon } from '@heroicons/react/outline';
import { Layout } from '../sections';

export default function Home() {
  const [session, loading] = useSession();

  return (
    <div className="min-h-screen flex flex-col">
      <Head>
        <title>Micro-Blogging App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Layout>
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
          {!loading ? (
            <div>
              {!session ? (
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
              ) : (
                <Link href="/write">
                  <a className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md text-lg sm:text-xl focus:outline-none focus:ring-4 focus:ring-blue-600 focus:ring-opacity-50 whitespace-nowrap flex items-center space-x-2">
                    <PencilIcon className="w-6 h-6 flex-shrink-0" />
                    <span>Write a blog post</span>
                  </a>
                </Link>
              )}
            </div>
          ) : null}
        </section>
      </Layout>
    </div>
  );
}
