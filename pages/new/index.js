import { useRouter } from 'next/router';
import axios from 'axios';
import useUser from '@/hooks/use-user';
import { Layout } from '@/sections/index';
import { Editor } from '@/components/index';
import toast from 'react-hot-toast';

const Drafts = () => {
  const router = useRouter();
  const { user, loading } = useUser(true);

  const handleOnChange = async (title, content) => {
    try {
      // Create new post and redirect
      const {
        data: { id },
      } = await axios.post('/api/posts', {
        title,
        content,
        author: user,
      });
      // Update the path of the current page
      router.push(`/drafts/${id}`);
    } catch (error) {
      toast.error('Unable to create post');
    }
  };

  if (loading || !user) return null;

  return (
    <Layout
      pageMeta={{
        title: 'Write blog post',
      }}
    >
      <div className="w-full max-w-screen-lg mx-auto py-8 sm:py-12">
        <Editor onChange={handleOnChange} />
      </div>
    </Layout>
  );
};

export default Drafts;
