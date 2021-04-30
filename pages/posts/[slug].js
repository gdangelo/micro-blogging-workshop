import ReactMarkdown from 'react-markdown';
import { useRouter } from 'next/router';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { faunaQueries } from '@/lib/fauna';
import { Layout } from '@/sections/index';
import { MDComponents } from '@/components/index';
import { PencilIcon, TrashIcon } from '@heroicons/react/outline';

const Post = ({
  id = '',
  title = '',
  content = '',
  author = null,
  published_at = '',
}) => {
  const router = useRouter();

  const deletePost = async () => {
    if (window.confirm('Do you really want to delete this post?')) {
      let toastId;
      try {
        // Display loading state...
        toastId = toast.loading('Deleting...');
        // Perform query
        await faunaQueries.deletePost(id);
        // Remove toast
        toast.dismiss(toastId);
        // Redirect to home page
        router.push(`/`);
      } catch (error) {
        // Display error message
        toast.error('Unable to delete post', { id: toastId });
      }
    }
  };

  const pageMeta = {
    type: 'article',
    title,
    description: content.slice(0, 250),
    date: published_at ? new Date(published_at).toISOString() : '',
  };

  return (
    <Layout pageMeta={pageMeta}>
      <article className="max-w-screen-lg mx-auto py-12 space-y-16">
        <header className="space-y-8">
          <h1 className="max-w-screen-md lg:text-6xl md:text-5xl sm:text-4xl text-3xl w-full font-extrabold leading-tight">
            {title}
          </h1>

          <div className="flex justify-between items-center space-x-4 border-b border-t dark:border-gray-700 py-6">
            {/* Author */}
            <div className="flex items-center space-x-2">
              <img
                src={author?.image}
                alt={author?.name}
                className="flex-shrink-0 w-16 h-16 rounded-full"
              />
              <div>
                <p className="font-semibold">{author?.name}</p>
                <p className="text-gray-500">
                  {published_at &&
                    new Intl.DateTimeFormat('en', {
                      year: 'numeric',
                      month: 'short',
                      day: '2-digit',
                    }).format(new Date(published_at))}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-2">
              <Link href={`/draft/${encodeURIComponent(id)}`}>
                <a className="bg-transparent hover:bg-gray-200 dark:hover:bg-gray-800 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50 flex items-center space-x-2">
                  <PencilIcon className="w-5 h-5 flex-shrink-0" />
                  <span>Edit</span>
                </a>
              </Link>
              <button
                type="button"
                onClick={deletePost}
                className="bg-transparent hover:bg-gray-200 dark:hover:bg-gray-800 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50 flex items-center space-x-2"
              >
                <TrashIcon className="w-5 h-5 flex-shrink-0" />
                <span>Delete</span>
              </button>
            </div>
          </div>
        </header>

        <main className="prose sm:prose-lg lg:prose-xl dark:prose-dark dark:sm:prose-lg-dark dark:lg:prose-xl-dark max-w-none">
          <ReactMarkdown components={MDComponents} children={content} />
        </main>
      </article>
    </Layout>
  );
};

export async function getStaticPaths() {
  const { data } = await faunaQueries.getPosts();

  return {
    paths:
      data
        ?.filter(({ data: { slug } }) => Boolean(slug))
        ?.map(({ data: { slug } }) => ({
          params: { slug },
        })) ?? [],
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const res = await faunaQueries.getPostBySlug(params.slug);

  // Serialize data by flattening the ref property
  const data = { id: res.ref.value.id, ...res.data };

  return { props: data };
}

export default Post;
