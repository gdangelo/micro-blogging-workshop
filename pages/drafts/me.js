import { useSession } from 'next-auth/client';
import { protectRoute } from '@/lib/util';
import { Layout } from '@/sections/index';
import { InfiniteDataList } from '@/components/index';

const MyDrafts = () => {
  const [session, loading] = useSession();

  const queryKey = session?.user
    ? `/api/drafts?author=${session.user.email}`
    : '/api/drafts';

  return (
    <Layout pageMeta={{ title: 'My drafts' }}>
      <section className="text-center pt-12 sm:pt-24 pb-16">
        <h1 className="text-4xl sm:text-7xl font-bold capitalize">My drafts</h1>
      </section>

      {!loading ? <InfiniteDataList queryKey={queryKey} /> : null}
    </Layout>
  );
};

export const getServerSideProps = protectRoute;

export default MyDrafts;