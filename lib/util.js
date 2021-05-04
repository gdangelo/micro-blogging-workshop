import axios from 'axios';
import { getSession } from 'next-auth/client';
import { faunaQueries } from '@/lib/fauna';

export const fetcher = url => axios.get(url).then(res => res.data);

// Function to be used in getServerSideProps to check
// if user is authenticated to protect route
export const protectRoute = async context => {
  const session = await getSession(context);
  // User not authenticated -> redirect to sign page
  if (!session) {
    return {
      redirect: { destination: '/api/auth/signin', permanent: false },
    };
  }
  // Return session as props to page
  return {
    props: { session },
  };
};

// Function to be used in getServerSideProps to check
// if user is authenticated and is author of the post
export const isAuthorized = async context => {
  const session = await getSession(context);
  // Authorization
  const post = await faunaQueries.getPost(context.params.id);
  if (!session || session.user.email !== post.author.email) {
    return {
      redirect: { destination: '/api/auth/signin', permanent: false },
    };
  }
  // Return session as props to page
  return {
    props: { session },
  };
};

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

export const formatDate = dateString => {
  try {
    return new Intl.DateTimeFormat('en', {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
    }).format(new Date(dateString));
  } catch (error) {
    return null;
  }
};

export const flattenData = obj => {
  if (!obj) return null;

  if (Array.isArray(obj.data)) {
    // recursively flatten all documents inside the data array
    return {
      ...obj,
      data: obj.data.map(e => flattenData(e)),
    };
  } else {
    // flatten the document's data
    return { ...obj.data, id: obj.ref.value.id };
  }
};
