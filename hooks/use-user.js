import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/client';

export default function useUser(redirect = false) {
  const router = useRouter();
  const [session, loading] = useSession();

  // Check if user is authenticated
  useEffect(() => {
    if (!(session || loading) && redirect) {
      router.push('/api/auth/signin');
    }
  }, [session, loading]);

  return { user: session?.user, loading };
}
