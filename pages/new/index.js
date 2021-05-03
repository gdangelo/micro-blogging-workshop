import { useRouter } from 'next/router';
import { faunaQueries } from '@/lib/fauna';
import useUser from '@/hooks/use-user';
import { Layout } from '@/sections/index';
import { Editor } from '@/components/index';
import toast from 'react-hot-toast';

const pageMeta = {
  title: 'Write blog post',
};

const Draft = () => {
  const router = useRouter();
  const { user, loading } = useUser(true);

  const handleOnChange = async (title, content) => {
    try {
      // Create new post and redirect
      const { ref } = await faunaQueries.createPost({
        title,
        content,
        author: user,
      });
      // Update the path of the current page
      router.push(`/draft/${ref.value.id}`);
    } catch (error) {
      toast.error('Unable to create post');
    }
  };

  if (loading || !user) return null;

  return (
    <Layout pageMeta={pageMeta}>
      <div className="w-full max-w-screen-lg mx-auto py-8 sm:py-12">
        <Editor debouncedDelay={1500} onChange={handleOnChange} />
      </div>
    </Layout>
  );
};

export default Draft;
