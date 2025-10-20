import { Skeleton } from '../Skeleton';

export default function StatsPageSkeleton() {
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
          <Skeleton variant="text" width="60%" height={36} className="mb-2" />
          <Skeleton variant="text" width="50%" height={20} />
        </div>

        {/* Overview Stats */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 rounded-3xl p-6 shadow-xl mb-6">
          <Skeleton variant="text" width="40%" height={24} className="mb-4" />
          <div className="grid grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i}>
                <Skeleton variant="text" width="60%" height={32} className="mb-1" />
                <Skeleton variant="text" width="80%" height={16} />
              </div>
            ))}
          </div>
        </div>

        {/* Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-md mb-6">
          <Skeleton variant="text" width="50%" height={24} className="mb-4" />
          <Skeleton variant="rounded" width="100%" height={300} />
        </div>

        {/* Heatmap */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-md mb-6">
          <Skeleton variant="text" width="40%" height={24} className="mb-4" />
          <Skeleton variant="rounded" width="100%" height={200} />
        </div>

        {/* Recent Readings */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-md">
          <Skeleton variant="text" width="50%" height={24} className="mb-4" />
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex justify-between items-center p-3 border-b border-gray-200 dark:border-gray-700">
                <div className="flex-1">
                  <Skeleton variant="text" width="70%" height={16} className="mb-2" />
                  <Skeleton variant="text" width="50%" height={14} />
                </div>
                <Skeleton variant="text" width={60} height={24} />
              </div>
            ))}
          </div>
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

