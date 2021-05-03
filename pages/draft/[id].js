import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/client';
import { faunaQueries } from '@/lib/fauna';
import { Layout } from '@/sections/index';
import { Editor } from '@/components/index';
import toast from 'react-hot-toast';

import {
  CloudIcon,
  ExclamationCircleIcon,
  RefreshIcon,
} from '@heroicons/react/outline';

const pageMeta = {
  title: 'Write blog post',
};

const Draft = () => {
  const router = useRouter();
  const [session, loading] = useSession();
  const [initialData, setInitialData] = useState(null);
  const [initializing, setInitializing] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [status, setStatus] = useState('saved');

  const id = router.query?.id ?? '';

  // Check if user is authenticated
  useEffect(() => {
    if (!(session || loading)) {
      router.push('/api/auth/signin');
    }
  }, [session, loading]);

  // Retrieve data from post
  useEffect(() => {
    const getPost = async () => {
      try {
        setInitializing(true);
        if (id) {
          // Perform query
          const { data } = await faunaQueries.getPost(id);
          // Update state
          setInitialData(data);
        } else {
          // Reset fields
          setInitialData(null);
        }
      } catch (error) {
        // Display error message
        toast.error('Unable to retrieve post');
        setInitialData(null);
      } finally {
        setInitializing(false);
      }
    };
    getPost();
  }, [id]);

  const handleOnPublish = async (title, content) => {
    let toastId;
    try {
      if (title) {
        setPublishing(true);
        toastId = toast.loading('Publishing...');
        // Perform query
        const {
          data: { slug },
        } = await faunaQueries.publishPost(id, { title, content });
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
      setPublishing(false);
    }
  };

  const handleOnChange = async (title, content) => {
    if (!title && !id) return;

    try {
      setStatus('saving');
      if (id) {
        // Automatic saving
        await faunaQueries.updatePost(id, {
          title,
          content,
        });
      } else {
        // New post
        const { ref } = await faunaQueries.createPost({
          title,
          content,
          author: session.user,
        });
        // Update the path of the current page
        router.push(`/draft/${ref.value.id}`);
      }
      setStatus('saved');
    } catch (error) {
      setStatus('error');
    }
  };

  if (loading || !session) return null;

  return (
    <Layout pageMeta={pageMeta}>
      {!initializing ? (
        <div className="w-full max-w-screen-lg mx-auto py-8 sm:py-12">
          {id ? (
            <div className="flex justify-start items-center mb-6">
              <p className="flex items-center space-x-1 text-gray-500 bg-gray-100 dark:bg-gray-800 rounded-md px-2 py-1">
                {status === 'failed' ? (
                  <>
                    <ExclamationCircleIcon className="w-6 h-6 flex-shrink-0 text-red-500 dark:text-red-400" />
                    <span className="text-red-500 dark:text-red-400">
                      Saving failed
                    </span>
                  </>
                ) : status === 'saving' ? (
                  <>
                    <RefreshIcon className="w-6 h-6 flex-shrink-0 animate-spin" />
                    <span>Saving</span>
                  </>
                ) : status === 'saved' ? (
                  <>
                    <CloudIcon className="w-6 h-6 flex-shrink-0" />
                    <span>Saved</span>
                  </>
                ) : null}
              </p>
            </div>
          ) : null}

          <Editor
            initialData={initialData}
            showPublishButton={Boolean(id)}
            disabled={publishing}
            onChange={handleOnChange}
            onPublish={handleOnPublish}
          />
        </div>
      ) : null}
    </Layout>
  );
};

export default Draft;
