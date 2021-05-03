import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/client';
import { faunaQueries } from '@/lib/fauna';
import { Layout } from '@/sections/index';
import { Editor } from '@/components/index';
import toast from 'react-hot-toast';

const pageMeta = {
  title: 'Write blog post',
};

const Draft = () => {
  const router = useRouter();
  const [session, loading] = useSession();

  // Check if user is authenticated
  useEffect(() => {
    if (!(session || loading)) {
      router.push('/api/auth/signin');
    }
  }, [session, loading]);

  const handleOnChange = async (title, content) => {
    try {
      // Create new post and redirect
      const { ref } = await faunaQueries.createPost({
        title,
        content,
        author: session.user,
      });
      // Update the path of the current page
      router.push(`/draft/${ref.value.id}`);
    } catch (error) {
      toast.error('Unable to create post');
    }
  };

  if (loading || !session) return null;

  return (
    <Layout pageMeta={pageMeta}>
      <div className="w-full max-w-screen-lg mx-auto py-8 sm:py-12">
        <Editor initialData={null} onChange={handleOnChange} />
      </div>
    </Layout>
  );
};

export default Draft;
