import { useState } from 'react';
import { useRouter } from 'next/router';
import useUser from '@/hooks/use-user';
import useSWR from 'swr';
import axios from 'axios';
import { fetcher } from '@/lib/util';
import { Layout } from '@/sections/index';
import { Editor } from '@/components/index';
import toast from 'react-hot-toast';

import {
  CloudIcon,
  ExclamationCircleIcon,
  RefreshIcon,
} from '@heroicons/react/outline';

const Draft = () => {
  const router = useRouter();
  const { user, loading } = useUser();
  const { data, error, mutate } = useSWR(
    () => (user ? `/api/posts/${router?.query?.id}` : null),
    fetcher
  );
  const [publishing, setPublishing] = useState(false);
  const [status, setStatus] = useState('saved');

  const handleOnPublish = async (title, content) => {
    let toastId;
    try {
      if (title) {
        setPublishing(true);
        toastId = toast.loading('Publishing...');
        // Perform query
        const { data } = await axios.patch(
          `/api/posts/publish/${router?.query?.id}`,
          {
            title,
            content,
          }
        );
        // Update cache, but disable the revalidation
        mutate(data, false);
        // Display success message
        toast.success('Redirecting...', { id: toastId });
        // Redirect to post page
        router.push(`/posts/${data.slug}`);
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
    // Saved data
    try {
      setStatus('saving');
      // Perform query
      const { data } = await axios.patch(`/api/posts/${router?.query?.id}`, {
        title,
        content,
        author: user,
      });
      // Update cache, but disable the revalidation
      mutate(data, false);
      setStatus('saved');
    } catch (error) {
      setStatus('error');
    }
  };

  if (loading || !user) return null;

  if (error) {
    toast.error('Unable to retrieve post');
  }

  return (
    <Layout pageMeta={{ title: 'Write blog post' }}>
      {data ? (
        <div className="w-full max-w-screen-lg mx-auto py-8 sm:py-12">
          <div className="flex justify-start items-center mb-6">
            <p className="flex items-center space-x-1 text-gray-500 bg-gray-100 dark:bg-gray-800 rounded-md px-2 py-1">
              {status === 'error' ? (
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

          <Editor
            initialData={data}
            showPublishButton={true}
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
