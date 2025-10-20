import { Skeleton } from '../Skeleton';

export default function FriendsPageSkeleton() {
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

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} variant="rounded" width={120} height={40} />
          ))}
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-6">
          <Skeleton variant="rounded" width={120} height={40} />
          <Skeleton variant="rounded" width={100} height={40} />
        </div>

        {/* Current Rank Card */}
        <div className="bg-gradient-to-br from-blue-100 to-purple-100 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-4 mb-4 shadow-lg">
          <Skeleton variant="text" width="40%" height={16} className="mb-2" />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Skeleton variant="text" width={60} height={32} />
              <div>
                <Skeleton variant="text" width={100} height={20} className="mb-1" />
                <Skeleton variant="text" width={120} height={14} />
              </div>
            </div>
            <Skeleton variant="circular" width={32} height={32} />
          </div>
        </div>

        {/* Leaderboard */}
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-md">
              <div className="flex items-center gap-3">
                <Skeleton variant="text" width={30} height={24} />
                <Skeleton variant="circular" width={40} height={40} />
                <div className="flex-1">
                  <Skeleton variant="text" width="60%" height={18} className="mb-2" />
                  <Skeleton variant="text" width="80%" height={14} />
                </div>
                <div>
                  <Skeleton variant="text" width={50} height={24} className="mb-1" />
                  <Skeleton variant="text" width={40} height={12} />
                </div>
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

