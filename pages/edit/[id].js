import { useState } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/client';
import useSWR from 'swr';
import axios from 'axios';
import { fetcher, protectRoute } from '@/lib/util';
import { Layout } from '@/sections/index';
import { Editor } from '@/components/index';
import toast from 'react-hot-toast';

const Edit = () => {
  const router = useRouter();
  const [session] = useSession();
  const { data, error, mutate } = useSWR(
    () => (session?.user ? `/api/posts/${router?.query?.id}` : null),
    fetcher
  );
  const [publishing, setPublishing] = useState(false);

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

  if (error) {
    toast.error('Unable to retrieve post');
  }

  return (
    <Layout pageMeta={{ title: 'Write blog post' }}>
      <div className="py-8 sm:py-12">
        {data ? (
          <Editor
            initialData={data}
            showPublishButton={true}
            disabled={publishing}
            onPublish={handleOnPublish}
          />
        ) : null}
      </div>
    </Layout>
  );
};

export const getServerSideProps = protectRoute;

export default Edit;
