import { Skeleton } from '../Skeleton';

export default function BadgesPageSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="fixed top-0 left-0 right-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-800 z-50">
        <div className="max-w-screen-sm mx-auto px-4 py-3 flex justify-end">
          <Skeleton variant="circular" width={40} height={40} />
        </div>
      </div>

      <main className="container-mobile pb-24 pt-20">
        {/* Header */}
        <div className="mb-6">
          <Skeleton variant="text" width="50%" height={36} className="mb-2" />
          <Skeleton variant="text" width="70%" height={20} />
        </div>

        {/* Stats Card */}
        <div className="bg-gradient-to-br from-yellow-100 to-orange-100 dark:from-gray-800 dark:to-gray-900 rounded-3xl p-6 shadow-xl mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <Skeleton variant="text" width={100} height={16} className="mb-2" />
              <Skeleton variant="text" width={80} height={32} className="mb-1" />
              <Skeleton variant="text" width={120} height={16} />
            </div>
            <Skeleton variant="circular" width={60} height={60} />
          </div>
          <Skeleton variant="rounded" width="100%" height={12} />
        </div>

        {/* Filters */}
        <div className="mb-6 space-y-3">
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            <Skeleton variant="circular" width={20} height={20} />
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} variant="rounded" width={80} height={40} />
            ))}
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            {[1, 2, 3, 4, 5, 6, 7].map((i) => (
              <Skeleton key={i} variant="rounded" width={100} height={40} />
            ))}
          </div>
        </div>

        {/* Badges Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-lg border-2 border-gray-300 dark:border-gray-700">
              <div className="text-center">
                <Skeleton variant="circular" width={60} height={60} className="mx-auto mb-3" />
                <Skeleton variant="text" width="80%" height={18} className="mx-auto mb-2" />
                <Skeleton variant="text" width="100%" height={14} className="mx-auto mb-3" />
                <Skeleton variant="rounded" width="100%" height={8} className="mb-1" />
                <Skeleton variant="text" width="40%" height={12} className="mx-auto mt-2" />
                <Skeleton variant="rounded" width={60} height={24} className="mx-auto mt-2" />
              </div>
            </div>
          ))}
        </div>
      </main>

      <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 z-50">
        <div className="max-w-screen-sm mx-auto">
          <div className="flex justify-around items-center h-16">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex flex-col items-center">
                <Skeleton variant="circular" width={24} height={24} className="mb-1" />
                <Skeleton variant="text" width={50} height={12} />
              </div>
            ))}
          </div>
        </div>
      </nav>
    </div>
  );
}

