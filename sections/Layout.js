import { Header, Footer } from './index';

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 sm:px-6 py-12 flex flex-col justify-center items-center">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
