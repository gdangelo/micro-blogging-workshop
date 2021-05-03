import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { faunaQueries } from '@/lib/fauna';
import { useDebouncedCallback } from 'use-debounce';
import { Layout } from '@/sections/index';
import { CardSkeleton } from '@/components/index';
import { ExclamationCircleIcon } from '@heroicons/react/outline';

function isInViewport(element) {
  if (!element) return false;

  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <=
      (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

const Posts = () => {
  const moreRef = useRef();
  const [posts, setPosts] = useState([]);
  const [initializing, setInitializing] = useState(true);
  const [after, setAfter] = useState(null);
  const [loadingMore, setLoadingMore] = useState(false);

  // Debounce callback
  const loadMore = useDebouncedCallback(
    async () => {
      try {
        setLoadingMore(true);
        // Fetch the 10 most recent posts
        const res = await faunaQueries.getPosts({
          size: 10,
          after,
        });
        // Serialize data by flattening the ref property
        const newPosts = res?.data?.map(({ data, ref }) => ({
          ...data,
          id: ref.value.id,
        }));
        // Remove the first item
        setPosts(old => [...old, ...newPosts]);
        setAfter(res?.after);
      } catch (error) {
        // do nothing!
      } finally {
        setLoadingMore(false);
      }
    },
    // delay in ms
    500
  );

  useEffect(() => {
    const getPosts = async () => {
      try {
        // Fetch the 10 most recent posts
        const res = await faunaQueries.getPosts({
          size: 10,
        });
        // Serialize data by flattening the ref property
        const posts = res?.data?.map(({ data, ref }) => ({
          ...data,
          id: ref.value.id,
        }));
        setPosts(posts);
        setAfter(res?.after);
      } catch (error) {
        setPosts([]);
        setAfter(null);
      } finally {
        setInitializing(false);
      }
    };
    getPosts();
  }, []);

  useEffect(() => {
    const runLoadMore = () => {
      if (after && isInViewport(moreRef.current)) {
        loadMore();
      }
    };

    window.addEventListener('scroll', runLoadMore);

    return () => {
      window.removeEventListener('scroll', runLoadMore);
    };
  }, [after]);

  const renderSkeletons = () => {
    return (
      <div className="grid sm:grid-cols-2 gap-8 max-w-screen-lg mx-auto">
        {[...new Array(10)].map(i => (
          <CardSkeleton key={i} />
        ))}
      </div>
    );
  };

  const renderPosts = () => {
    if (posts?.length === 0)
      return (
        <section className="flex justify-center">
          <p className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md w-full max-w-screen-sm text-center text-lg flex justify-center items-center space-x-1">
            <ExclamationCircleIcon className="w-6 h-6 flex-shrink-0" />
            <span>No blog posts yet!</span>
          </p>
        </section>
      );

    return (
      <section>
        <div className="grid sm:grid-cols-2 gap-8 max-w-screen-lg mx-auto">
          {posts?.map(data => (
            <Link
              key={data.id}
              href={
                data.published
                  ? `/posts/${encodeURIComponent(data?.slug)}`
                  : `/draft/${data.id}`
              }
            >
              <a className="rounded-md border dark:border-gray-700 dark:bg-gray-800 hover:shadow-xl transition-shadow p-6">
                <h3 className="text-3xl font-bold leading-snug tracking-tight mb-2">
                  {data?.title || 'Untitled'}
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
                        {data?.published_at
                          ? new Intl.DateTimeFormat('en', {
                              year: 'numeric',
                              month: 'short',
                              day: '2-digit',
                            }).format(new Date(data.published_at))
                          : 'Not published'}
                      </p>
                    </div>
                  </div>
                ) : null}
                <p className="text-gray-500">
                  {data?.content?.slice(0, 250) || 'Nothing to preview...'}
                </p>
              </a>
            </Link>
          ))}
        </div>

        <div className="mt-8">{loadingMore ? renderSkeletons() : null}</div>

        {after ? (
          <div ref={moreRef} />
        ) : (
          <p className="text-gray-500 text-center text-lg mt-20">
            No more posts...
          </p>
        )}
      </section>
    );
  };

  return (
    <Layout>
      <section className="text-center pt-12 sm:pt-24 pb-16">
        <h1 className="text-4xl sm:text-7xl font-bold capitalize">
          Blog posts
        </h1>
      </section>

      {initializing ? renderSkeletons() : renderPosts()}
    </Layout>
  );
};

export default Posts;
