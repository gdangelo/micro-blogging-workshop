import axios from 'axios';
import { getSession } from 'next-auth/client';
import { faunaQueries } from '@/lib/fauna';

export const fetcher = url => axios.get(url).then(res => res.data);

// Function to be used in getServerSideProps to check
// if user is authenticated to protect route
export const isAuthenticated = async context => {
  try {
    const session = await getSession(context);
    // User not authenticated -> redirect to sign page
    if (!session) {
      return {
        redirect: { destination: '/api/auth/signin', permanent: false },
      };
    }
    // Get posts from author
    const initialData = await faunaQueries.getPosts({
      author: session?.user?.email,
    });
    return {
      props: {
        initialData,
      },
    };
  } catch (error) {
    return {
      redirect: { destination: '/api/auth/signin', permanent: false },
    };
  }
};

// Function to be used in getServerSideProps to check
// if user is authenticated and is author of the post
export const isAuthorized = async context => {
  try {
    const session = await getSession(context);
    // Authorization
    const post = await faunaQueries.getPost(context.params.id);
    if (!session || session.user.email !== post.author.email) {
      return {
        redirect: { destination: '/api/auth/signin', permanent: false },
      };
    }
    return {
      props: { initialData: post },
    };
  } catch (error) {
    return {
      redirect: { destination: '/api/auth/signin', permanent: false },
    };
  }
};

// Check if element is visible inside the viewport
export const isInViewport = element => {
  if (!element) return false;

  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <=
      (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
};

// Format date. Example: "May 5, 2021 at 11:25 AM"
export const formatDate = dateString => {
  try {
    return new Intl.DateTimeFormat('en', {
      dateStyle: 'long',
      timeStyle: 'short',
    }).format(new Date(dateString));
  } catch (error) {
    return null;
  }
};
