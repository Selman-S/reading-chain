import { Skeleton } from '../Skeleton';

export default function HomePageSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Top Bar Skeleton */}
      <div className="fixed top-0 left-0 right-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-800 z-50">
        <div className="max-w-screen-sm mx-auto px-4 py-3 flex justify-end">
          <Skeleton variant="circular" width={40} height={40} />
        </div>
      </div>

      <main className="container-mobile pb-24 pt-20">
        {/* Header Skeleton */}
        <div className="mb-8 animate-fadeIn">
          <Skeleton variant="text" width="60%" height={36} className="mb-2" />
          <Skeleton variant="text" width="40%" height={20} />
        </div>

        {/* Stats Cards Skeleton */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-md">
              <Skeleton variant="circular" width={48} height={48} className="mb-3" />
              <Skeleton variant="text" width="70%" height={24} className="mb-1" />
              <Skeleton variant="text" width="50%" height={16} />
            </div>
          ))}
        </div>

        {/* Streak Display Skeleton */}
        <div className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-gray-800 dark:to-gray-900 rounded-3xl p-6 shadow-xl mb-8">
          <div className="flex items-center justify-between mb-4">
            <Skeleton variant="text" width="40%" height={28} />
            <Skeleton variant="circular" width={40} height={40} />
          </div>
          <Skeleton variant="rounded" width="100%" height={120} />
        </div>

        {/* Quick Reading Entry Skeleton */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
          <Skeleton variant="text" width="60%" height={24} className="mb-4" />
          <div className="space-y-4">
            <div>
              <Skeleton variant="text" width="30%" height={16} className="mb-2" />
              <Skeleton variant="rounded" width="100%" height={48} />
            </div>
            <div>
              <Skeleton variant="text" width="40%" height={16} className="mb-2" />
              <Skeleton variant="rounded" width="100%" height={48} />
            </div>
            <Skeleton variant="rounded" width="100%" height={56} />
          </div>
        </div>

        {/* Friend Activity Skeleton */}
        <div className="mt-6 bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-md">
          <Skeleton variant="text" width="50%" height={24} className="mb-4" />
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex gap-3 p-3">
                <Skeleton variant="circular" width={40} height={40} />
                <div className="flex-1">
                  <Skeleton variant="text" width="80%" height={16} className="mb-2" />
                  <Skeleton variant="text" width="60%" height={14} className="mb-1" />
                  <Skeleton variant="text" width="30%" height={12} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Bottom Navigation Skeleton */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 shadow-lg z-50">
        <div className="max-w-screen-sm mx-auto">
          <div className="flex justify-around items-center h-16">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex flex-col items-center justify-center flex-1">
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

