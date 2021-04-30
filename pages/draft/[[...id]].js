import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/client';
import { faunaQueries } from '@/lib/fauna';
import { Layout } from '@/sections/index';
import ReactMarkdown from 'react-markdown';
import toast from 'react-hot-toast';

import {
  EyeIcon,
  PencilIcon,
  LightningBoltIcon,
} from '@heroicons/react/outline';
import { MarkdownIcon, MDComponents } from '@/components/index';

const tabs = [
  { text: 'Write', icon: PencilIcon },
  { text: 'Preview', icon: EyeIcon },
];

const pageMeta = {
  title: 'Write blog post',
};

const Draft = props => {
  const router = useRouter();

  const [session, loading] = useSession();

  const [activeTab, setActiveTab] = useState(0);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [publishing, setPublishing] = useState(false);

  const id = router.query?.id?.[0] ?? '';

  // Check if user is authentication
  useEffect(() => {
    if (!(session || loading)) {
      router.push('/api/auth/signin');
    }
  }, [session, loading]);

  // Retrieve data from post
  useEffect(() => {
    const getPost = async () => {
      try {
        if (id) {
          // Perform query
          const { data } = await faunaQueries.getPost(id);
          // Update state
          setTitle(data.title);
          setContent(data.content);
        } else {
          // Reset fields
          setTitle('');
          setContent('');
        }
      } catch (error) {
        // Display error message
        toast.error('Unable to retrieve post');
      }
    };
    getPost();
  }, [id]);

  const publishPost = async () => {
    let toastId;

    try {
      if (title && content) {
        // Start loading state...
        setPublishing(true);
        toastId = toast.loading('Publishing...');
        // Perform query
        let slug;
        if (id) {
          const { data } = await faunaQueries.updatePost(id, {
            title,
            content,
          });
          slug = data.slug;
        } else {
          const { data } = await faunaQueries.createPost(
            title,
            content,
            session.user
          );
          slug = data.slug;
        }
        // Display success message
        toast.success('Redirecting...', { id: toastId });
        // Redirect to post page
        router.push(`/posts/${slug}`);
      }
    } catch (error) {
      // Display error message
      toast.error('Unable to publish post', { id: toastId });
      // Stop loading state
      setPublishing(false);
    }
  };

  if (loading || !session) return null;

  return (
    <Layout pageMeta={pageMeta}>
      <div className="w-full max-w-screen-lg mx-auto pt-12 space-y-6">
        {/* Blog post title */}
        <textarea
          value={title}
          onChange={e => setTitle(e.target.value)}
          maxLength="150"
          placeholder="Title…"
          disabled={publishing}
          autoFocus
          className="w-full text-3xl font-bold leading-snug bg-transparent outline-none appearance-none resize-none disabled:cursor-not-allowed"
        />

        <div>
          {/* Action tabs */}
          <div className="flex justify-between items-center space-x-2 pl-2 pr-4 sm:pl-4 sm:pr-6 py-2 rounded bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-100">
            <div className="flex items-center space-x-2">
              {tabs.map(({ text, icon: Icon }, i) => (
                <button
                  key={text}
                  onClick={() => setActiveTab(i)}
                  className={`flex items-center space-x-1 transition-colors px-2 py-1 rounded-md focus:outline-none ${
                    activeTab === i
                      ? 'text-blue-600 cursor-default select-none'
                      : 'hover:text-blue-600 bg-transparent hover:bg-blue-100 focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50'
                  }`}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  <span>{text}</span>
                </button>
              ))}

              <a
                href="https://daringfireball.net/projects/markdown/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-blue-600"
              >
                <MarkdownIcon className="w-5 h-5" />
              </a>
            </div>

            <button
              type="button"
              onClick={publishPost}
              disabled={!(title && content) || publishing}
              className="flex items-center space-x-1 transition-colors px-4 py-1 rounded-md focus:outline-none border border-blue-600 bg-blue-600 text-gray-100 hover:text-gray-700 dark:text-gray-100 hover:bg-transparent hover:border-gray-700 dark:hover:border-gray-100 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-blue-600 disabled:hover:text-gray-100 disabled:hover:border-blue-600 dark:disabled:hover:border-blue-600"
            >
              {publishing ? (
                'Publishing...'
              ) : (
                <>
                  <LightningBoltIcon className="w-5 h-5" />
                  <span>Publish</span>
                </>
              )}
            </button>
          </div>

          {/* Blog post content */}
          <div className="px-4 py-12">
            {activeTab === 0 ? (
              <textarea
                value={content}
                onChange={e => setContent(e.target.value)}
                placeholder="Tell your story..."
                disabled={publishing}
                className="w-full min-h-screen resize-none bg-transparent focus:outline-none text-xl leading-snug disabled:cursor-not-allowed"
              />
            ) : (
              <article className="prose dark:prose-dark sm:prose-lg lg:prose-xl max-w-none min-h-screen">
                {content ? (
                  <ReactMarkdown components={MDComponents} children={content} />
                ) : (
                  <p>Nothing to preview yet...</p>
                )}
              </article>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Draft;
