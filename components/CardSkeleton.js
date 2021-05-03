const CardSkeleton = () => (
  <div className="rounded-md border dark:border-gray-700 dark:bg-gray-800 p-6 animate-pulse">
    <span className="mb-4 rounded dark:bg-gray-700 bg-gray-200 h-10 w-full sm:w-5/6 block" />
    <div className="flex items-center space-x-2 mb-4">
      <span className="rounded-full dark:bg-gray-700 bg-gray-200 h-12 w-12 block" />
      <div>
        <span className="mb-1 dark:bg-gray-700 bg-gray-200 h-4 w-32 block" />
        <span className="dark:bg-gray-700 bg-gray-200 h-3 w-24 block" />
      </div>
    </div>
    <div className="space-y-2">
      <span className="mb-1 dark:bg-gray-700 bg-gray-200 h-4 w-full block" />
      <span className="mb-1 dark:bg-gray-700 bg-gray-200 h-4 w-4/5 block" />
      <span className="mb-1 dark:bg-gray-700 bg-gray-200 h-4 w-48 block" />
    </div>
  </div>
);

export default CardSkeleton;
