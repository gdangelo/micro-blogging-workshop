import { Layout } from '@/sections/index';
import { InfiniteDataList } from '@/components/index';

const Posts = () => {
  return (
    <Layout>
      <section className="text-center pt-12 sm:pt-24 pb-16">
        <h1 className="text-4xl sm:text-7xl font-bold capitalize">
          Blog posts
        </h1>
      </section>

      <InfiniteDataList queryKey="/api/posts" />
    </Layout>
  );
};

export default Posts;
