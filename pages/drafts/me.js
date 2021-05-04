import useUser from '@/hooks/use-user';
import { Layout } from '@/sections/index';
import { InfiniteDataList } from '@/components/index';

const MyDrafts = () => {
  const { user, loading } = useUser();

  if (loading || !user) return null;

  const queryKey = user ? `/api/drafts?author=${user.email}` : '/api/drafts';

  return (
    <Layout pageMeta={{ title: 'My drafts' }}>
      <section className="text-center pt-12 sm:pt-24 pb-16">
        <h1 className="text-4xl sm:text-7xl font-bold capitalize">My drafts</h1>
      </section>

      <InfiniteDataList queryKey={queryKey} />
    </Layout>
  );
};

export default MyDrafts;
