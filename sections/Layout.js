import Head from 'next/head';
import { useRouter } from 'next/router';
import { Header, Footer } from './index';

const SITE_DOMAIN = 'https://micro-blogging-workshop.vercel.app';

const Layout = ({ children, pageMeta }) => {
  const router = useRouter();

  const meta = {
    title: 'The Blogging Platform For Developers',
    description: `Start your developer blog, share ideas, and connect with the dev community!`,
    type: 'website',
    creator: '@AlterClassIO',
    ...pageMeta,
  };

  return (
    <>
      <Head>
        <title>{meta.title}</title>
        <meta content={meta.description} name="description" />
        <meta property="author" content="AlterClass" />
        <link rel="canonical" href={`${SITE_DOMAIN}${router.asPath}`} />
        {/* Open Graph */}
        <meta property="og:url" content={`${SITE_DOMAIN}${router.asPath}`} />
        <meta property="og:type" content={meta.type} />
        <meta property="og:site_name" content="Blog for Dev" />
        <meta property="og:description" content={meta.description} />
        <meta property="og:title" content={meta.title} />
        {meta.image && <meta property="og:image" content={meta.image} />}
        {meta.date && (
          <meta property="article:published_time" content={meta.date} />
        )}
        {/* Twitter */}
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:site" content="@AlterClassIO" />
        <meta name="twitter:creator" content={meta.creator} />
        <meta name="twitter:title" content={meta.title} />
        <meta name="twitter:description" content={meta.description} />
        {meta.image && <meta name="twitter:image" content={meta.image} />}
      </Head>

      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow container mx-auto px-4 sm:px-6">
          {children}
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Layout;
