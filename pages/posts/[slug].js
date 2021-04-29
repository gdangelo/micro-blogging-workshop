import { useSession } from 'next-auth/client';
import { faunaQueries } from '../../fauna';
import { Layout } from '../../sections';

const Post = ({
  title = '',
  content = '',
  author = null,
  published_at = '',
}) => {
  const [session, loading] = useSession();

  return (
    <Layout>
      <article className="max-w-screen-md mx-auto py-12 space-y-16">
        <header className="space-y-8">
          <h1 className="max-w-screen-md lg:text-6xl md:text-5xl sm:text-4xl text-3xl w-full font-extrabold leading-tight">
            {title}
          </h1>

          {/* Author */}
          <div className="flex items-center space-x-2">
            <img
              src={author?.image}
              alt={author?.name}
              className="flex-shrink-0 w-16 h-16 rounded-full"
            />
            <div>
              <p className="font-semibold">{author?.name}</p>
              <p className="text-gray-500">
                {published_at &&
                  new Intl.DateTimeFormat('en', {
                    year: 'numeric',
                    month: 'short',
                    day: '2-digit',
                  }).format(new Date(published_at))}
              </p>
            </div>
          </div>
        </header>

        <main className="prose dark:prose-dark sm:prose-lg lg:prose-xl max-w-none">
          {content}
        </main>
      </article>
    </Layout>
  );
};

export async function getStaticPaths() {
  const { data } = await faunaQueries.getPosts();

  return {
    paths:
      data
        ?.filter(({ data: { slug } }) => Boolean(slug))
        ?.map(({ data: { slug } }) => ({
          params: { slug },
        })) ?? [],
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const { data } = await faunaQueries.getPostBySlug(params.slug);

  return { props: data };
}

export default Post;
