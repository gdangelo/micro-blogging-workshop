import { useEffect, useRef } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { useSWRInfinite } from 'swr';
import { useDebouncedCallback } from 'use-debounce';
import { Layout } from '@/sections/index';
import { CardSkeleton } from '@/components/index';
import { ExclamationCircleIcon } from '@heroicons/react/outline';

const fetcher = url => axios.get(url).then(res => res.data);

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

  const { data: pages, error, size, setSize } = useSWRInfinite(
    (pageIndex, previousPageData) => {
      // reached the endpoint
      if (previousPageData && !previousPageData.after) return null;

      // first page, we don't have `previousPageData`
      if (pageIndex === 0) return '/api/posts';

      // add the cursor to the API endpoint
      return `/api/posts?cursor=${encodeURIComponent(
        JSON.stringify(previousPageData.after)
      )}`;
    },
    fetcher
  );

  const posts = pages?.flatMap(page => page.data) ?? [];
  const hasMore = pages?.[size - 1]?.after ?? null;
  const isLoadingInitialData = !pages && !error;
  const isLoadingMore =
    isLoadingInitialData ||
    (size > 0 && pages && typeof pages[size - 1] === 'undefined');

  // Debounce callback
  const loadMore = useDebouncedCallback(() => setSize(size => size + 1), 500);

  useEffect(() => {
    const runLoadMore = () => {
      if (isInViewport(moreRef.current)) {
        loadMore();
      }
    };

    window.addEventListener('scroll', runLoadMore);

    return () => {
      window.removeEventListener('scroll', runLoadMore);
    };
  }, []);

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
          {posts?.map(({ data: post, ref }) => (
            <Link
              key={ref.id}
              href={
                post.published
                  ? `/posts/${encodeURIComponent(post?.slug)}`
                  : `/draft/${ref.id}`
              }
            >
              <a className="rounded-md border dark:border-gray-700 dark:bg-gray-800 hover:shadow-xl transition-shadow p-6">
                <h3 className="text-3xl font-bold leading-snug tracking-tight mb-2">
                  {post?.title || 'Untitled'}
                </h3>
                {post?.author ? (
                  <div className="flex items-center space-x-2 mb-4">
                    <img
                      src={post.author?.image}
                      alt={post.author?.name}
                      className="border-2 border-blue-600 rounded-full w-12 h-12"
                    />
                    <div className="text-sm">
                      <p className="font-semibold">{post.author?.name}</p>
                      <p className="text-gray-500">
                        {post?.published_at
                          ? new Intl.DateTimeFormat('en', {
                              year: 'numeric',
                              month: 'short',
                              day: '2-digit',
                            }).format(new Date(post.published_at))
                          : 'Not published'}
                      </p>
                    </div>
                  </div>
                ) : null}
                <p className="text-gray-500">
                  {post?.content?.slice(0, 250) || 'Nothing to preview...'}
                </p>
              </a>
            </Link>
          ))}
        </div>

        <div className="mt-8">{isLoadingMore ? renderSkeletons() : null}</div>

        {hasMore ? (
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

      {isLoadingInitialData ? renderSkeletons() : renderPosts()}
    </Layout>
  );
};

export default Posts;
