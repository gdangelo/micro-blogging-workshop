import Link from 'next/link';
import { signIn, useSession } from 'next-auth/client';
import { faunaQueries } from '@/lib/fauna';

import { PencilIcon } from '@heroicons/react/outline';
import { Layout } from '@/sections/index';

export default function Home({ posts = [] }) {
  const [session, loading] = useSession();

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
                <Link href="/draft">
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
          {posts?.map(data => (
            <Link
              key={data.id}
              href={`/posts/${encodeURIComponent(data?.slug)}`}
            >
              <a className="rounded-md border dark:border-gray-700 dark:bg-gray-800 hover:shadow-xl transition-shadow p-6">
                <h3 className="text-3xl font-bold leading-snug tracking-tight mb-2">
                  {data.title}
                </h3>
                {data?.author ? (
                  <div className="flex items-center space-x-2 mb-4">
                    <img
                      src={data.author?.image}
                      alt={data.author?.name}
                      className="border-2 border-blue-600 rounded-full w-12 h-12"
                    />
                    <div className="text-sm">
                      <p className="font-semibold">{data.author?.name}</p>
                      <p className="text-gray-500">
                        {data?.published_at &&
                          new Intl.DateTimeFormat('en', {
                            year: 'numeric',
                            month: 'short',
                            day: '2-digit',
                          }).format(new Date(data.published_at))}
                      </p>
                    </div>
                  </div>
                ) : null}
                <p className="text-gray-500">{data.content.slice(0, 250)}</p>
              </a>
            </Link>
          ))}
        </section>
      </Layout>
    </div>
  );
}

export async function getStaticProps() {
  // Fetch the 10 most recent posts
  const { data } = await faunaQueries.getPosts({ size: 10 });

  // Serialize data by flattening the ref property
  const posts = data?.map(({ data, ref }) => ({ ...data, id: ref.value.id }));

  return { props: { posts } };
}
