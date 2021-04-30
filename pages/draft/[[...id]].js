import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/client';
import { faunaQueries } from '@/lib/fauna';
import { Layout } from '@/sections/index';
import useDebounce from '@/hooks/use-debounce';
import ReactMarkdown from 'react-markdown';
import toast from 'react-hot-toast';

import {
  CloudIcon,
  EyeIcon,
  ExclamationCircleIcon,
  PencilIcon,
  LightningBoltIcon,
  RefreshIcon,
} from '@heroicons/react/outline';
import { MarkdownIcon, MDComponents } from '@/components/index';

const tabs = [
  { text: 'Write', icon: PencilIcon },
  { text: 'Preview', icon: EyeIcon },
];

const pageMeta = {
  title: 'Write blog post',
};

const Draft = () => {
  const router = useRouter();

  const [session, loading] = useSession();

  const [activeTab, setActiveTab] = useState(0);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [published, setPublished] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [savingStatus, setSavingStatus] = useState('idle');

  // Debounced values
  const debouncedTitle = useDebounce(title, 500);
  const debouncedContent = useDebounce(content, 500);

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
          setPublished(data.published);
        } else {
          // Reset fields
          setTitle('');
          setContent('');
          setPublished(false);
        }
      } catch (error) {
        // Display error message
        toast.error('Unable to retrieve post');
      }
    };
    getPost();
  }, [id]);

  useEffect(() => {
    const saveDraft = async () => {
      // Abort!
      if (!id && !debouncedTitle) return;

      try {
        setSavingStatus('loading');

        if (id) {
          // Automatic saving
          await faunaQueries.updatePost(id, {
            title: debouncedTitle,
            content: debouncedContent,
          });
        } else {
          // New post
          const { ref } = await faunaQueries.createPost(
            debouncedTitle,
            debouncedContent,
            session.user
          );
          // Update the path of the current page without rerunning
          router.push(`/draft/${ref.value.id}`, undefined, { shallow: true });
        }
        setSavingStatus('idle');
      } catch (error) {
        setSavingStatus('failed');
      }
    };

    if (!published) {
      saveDraft();
    }
  }, [debouncedTitle, debouncedContent, published]);

  const publishPost = async () => {
    let toastId;

    try {
      if (id && title) {
        // Start loading state...
        setPublishing(true);
        toastId = toast.loading('Publishing...');
        // Perform query
        const {
          data: { slug },
        } = published
          ? await faunaQueries.updatePost(id, { title, content })
          : await faunaQueries.publishPost(id);
        // Display success message
        toast.success('Redirecting...', { id: toastId });
        // Redirect to post page
        router.push(`/posts/${slug}`);
      } else {
        toast.error('Looks like you forgot to add a title!');
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
      <div className="w-full max-w-screen-lg mx-auto pt-8 sm:pt-12">
        {id ? (
          <div className="flex justify-start items-center text-gray-500 mb-6">
            <p className="flex items-center space-x-1 bg-gray-100 dark:bg-gray-800 rounded-md px-2 py-1">
              {savingStatus === 'failed' ? (
                <>
                  <ExclamationCircleIcon className="w-6 h-6 flex-shrink-0 text-red-500 dark:text-red-400" />
                  <span className="text-red-500 dark:text-red-400">
                    Saving failed
                  </span>
                </>
              ) : savingStatus === 'loading' ? (
                <>
                  <RefreshIcon className="w-6 h-6 flex-shrink-0 animate-spin" />
                  <span>Saving</span>
                </>
              ) : (
                <>
                  <CloudIcon className="w-6 h-6 flex-shrink-0" />
                  <span>Saved</span>
                </>
              )}
            </p>
          </div>
        ) : null}

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

        {/* Action tabs */}
        <div className="mt-6 flex justify-center sm:justify-between items-center space-x-2 px-2 sm:px-4 py-2 rounded bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-100 sticky top-0">
          <div className="flex items-center space-x-4">
            {tabs.map(({ text, icon: Icon }, i) => (
              <button
                key={text}
                onClick={() => setActiveTab(i)}
                disabled={publishing}
                className={`flex items-center space-x-1 transition-colors rounded-md focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed ${
                  activeTab === i
                    ? 'text-blue-600 cursor-default select-none disabled:hover:text-blue-600'
                    : 'hover:text-blue-600 disabled:hover:text-current'
                }`}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <span>{text}</span>
              </button>
            ))}

            {id ? (
              <button
                onClick={publishPost}
                disabled={publishing}
                className="flex items-center space-x-1 transition-colors rounded-md focus:outline-none hover:text-blue-600 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:text-current"
              >
                <LightningBoltIcon className="w-5 h-5 flex-shrink-0" />
                <span>Publish</span>
              </button>
            ) : null}
          </div>

          <a
            href="https://daringfireball.net/projects/markdown/"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center space-x-1 hover:text-blue-600"
          >
            <MarkdownIcon className="w-5 h-5 flex-shrink-0" />
            <span className="hidden sm:inline-block">Mardown supported</span>
          </a>
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
    </Layout>
  );
};

export default Draft;
