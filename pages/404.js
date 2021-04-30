import Link from 'next/link';
import { Layout } from '@/sections/index';

const pageMeta = {
  title: 'Oops! You found a missing page...',
};

const NotFound = () => (
  <Layout pageMeta={pageMeta}>
    <div className="container mx-auto py-16 h-full">
      <div className="space-y-12 h-full flex flex-col items-center justify-center">
        <div className="space-y-6 text-center">
          <h1 className="text-3xl sm:text-6xl">404 - Page not found</h1>
          <p className="text-xl">We can't find the page you are looking for.</p>
        </div>
        <Link href="/">
          <a className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md text-lg sm:text-xl focus:outline-none focus:ring-4 focus:ring-blue-600 focus:ring-opacity-50 whitespace-nowrap flex items-center space-x-2">
            Go back home
          </a>
        </Link>
      </div>
    </div>
  </Layout>
);

export default NotFound;
