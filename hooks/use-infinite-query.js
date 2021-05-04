import { useSWRInfinite } from 'swr';
import { fetcher } from '@/lib/util';

export default function useInfiniteQuery(queryKey) {
  const { data, error, size, setSize } = useSWRInfinite(
    (pageIndex, previousPageData) => {
      // reached the endpoint
      if (previousPageData && !previousPageData.after) return null;
      // first page, we don't have `previousPageData`
      if (pageIndex === 0) return queryKey;
      // add the cursor to the API endpoint
      const search = queryKey.includes('?');
      return `${queryKey}${search ? '&' : '?'}cursor=${encodeURIComponent(
        JSON.stringify(previousPageData.after)
      )}`;
    },
    fetcher
  );

  const fetchNextPage = () => setSize(size => size + 1);

  const flattenPages = data?.flatMap(page => page.data) ?? [];
  const hasNextPage = Boolean(data?.[size - 1]?.after);
  const isFetchingInitialData = !data && !error;
  const isFetchingNextPage =
    isFetchingInitialData ||
    (size > 0 && data && typeof data[size - 1] === 'undefined');

  return {
    data: flattenPages,
    error,
    hasNextPage,
    fetchNextPage,
    isFetchingInitialData,
    isFetchingNextPage,
  };
}
