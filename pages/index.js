import { useState, useEffect } from 'react';
import Link from 'next/link';
import { signIn, useSession } from 'next-auth/client';
import faunadb, { query as q } from 'faunadb';

import { PencilIcon } from '@heroicons/react/outline';
import { Layout } from '../sections';

const db = new faunadb.Client({
  secret: process.env.NEXT_PUBLIC_FAUNADB_SECRET,
});

export default function Home() {
  const [session, loading] = useSession();
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const getPosts = async () => {
      try {
        const { data } = await db.query(
          q.Map(
            q.Paginate(q.Match(q.Index('all_posts')), { size: 10 }),
            q.Lambda('ref', q.Get(q.Var('ref')))
          )
        );
        setPosts(data);
      } catch (error) {
        console.error(error);
      }
    };

    getPosts();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Layout>
        {/* Hero section */}
        <section className="flex flex-col justify-center items-center text-center py-24 space-y-10">
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
                <div className="space-y-3">
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
                      className="text-gray-900 dark:text-gray-100 hover:text-blue-600 hover:underline"
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

        {/* Blog posts section */}
        <section className="grid sm:grid-cols-2 gap-8 max-w-screen-lg mx-auto">
          {posts.map(({ data, ref }) => (
            <div
              key={ref.value.id}
              className="rounded-md border dark:border-gray-700 p-6 dark:bg-gray-800"
            >
              <h3 className="text-3xl font-bold leading-snug tracking-tight mb-2">
                {data.title}
              </h3>
              <p className="mb-1">{data.author}</p>
              <p className="mb-4">
                {data?.published_at?.value &&
                  new Intl.DateTimeFormat('en', {
                    year: 'numeric',
                    month: 'short',
                    day: '2-digit',
                  }).format(new Date(data.published_at.value))}
              </p>
              <p className="text-gray-500">{data.content.slice(0, 250)}</p>
            </div>
          ))}
        </section>
      </Layout>
    </div>
  );
}
