import Head from 'next/head';

export default function Home() {
  return (
    <div>
      <Head>
        <title>Micro-Blogging App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1>
          Welcome to <a href="https://nextjs.org">Next.js!</a>
        </h1>
      </main>
    </div>
  );
}
