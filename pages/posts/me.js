import { useSession } from 'next-auth/client';
import { protectRoute } from '@/lib/utils';
import { Layout } from '@/sections/index';
import { InfiniteDataList } from '@/components/index';

const MyPosts = () => {
  const [session, loading] = useSession();

  const queryKey = session?.user
    ? `/api/posts?author=${session.user.email}`
    : '/api/posts';

  return (
    <Layout pageMeta={{ title: 'My posts' }}>
      <section className="text-center pt-12 sm:pt-24 pb-16">
        <h1 className="text-4xl sm:text-7xl font-bold capitalize">My posts</h1>
      </section>

      {!loading ? <InfiniteDataList queryKey={queryKey} /> : null}
    </Layout>
  );
};

export const getServerSideProps = protectRoute;

export default MyPosts;
