import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/client';
import { faunaQueries } from '@/lib/fauna';
import { Layout } from '@/sections/index';
import { Editor } from '@/components/index';
import toast from 'react-hot-toast';

const pageMeta = {
  title: 'Write blog post',
};

const Edit = () => {
  const router = useRouter();
  const [session, loading] = useSession();
  const [initialData, setInitialData] = useState(null);
  const [initializing, setInitializing] = useState(false);
  const [publishing, setPublishing] = useState(false);

  const id = router.query?.id ?? '';

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
        } = await faunaQueries.updatePost(id, { title, content });
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

  if (loading || !session) return null;

  return (
    <Layout pageMeta={pageMeta}>
      <div className="py-8 sm:py-12">
        {!initializing ? (
          <Editor
            initialData={initialData}
            showPublishButton={true}
            disabled={publishing}
            onPublish={handleOnPublish}
          />
        ) : null}
      </div>
    </Layout>
  );
};

export default Edit;
