import Head from 'next/head';
import { Header, Footer } from './index';

const Layout = ({ children }) => {
  return (
    <>
      <Head>
        <title>Micro-Blogging App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen flex flex-col overflow-hidden">
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
