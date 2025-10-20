import { Skeleton } from '../Skeleton';

export default function ProfilePageSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="fixed top-0 left-0 right-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-800 z-50">
        <div className="max-w-screen-sm mx-auto px-4 py-3 flex justify-end">
          <Skeleton variant="circular" width={40} height={40} />
        </div>
      </div>

      <main className="container-mobile pb-24 pt-20">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <Skeleton variant="text" width="40%" height={36} />
          <Skeleton variant="rounded" width={100} height={40} />
        </div>

        {/* Profile Card */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-xl mb-6">
          {/* Avatar */}
          <div className="flex flex-col items-center mb-6">
            <Skeleton variant="circular" width={96} height={96} className="mb-4" />
            <Skeleton variant="text" width="50%" height={28} className="mb-2" />
            <Skeleton variant="text" width="40%" height={16} />
          </div>

          {/* Bio */}
          <div className="mb-6">
            <Skeleton variant="text" width="30%" height={16} className="mb-2" />
            <Skeleton variant="text" width="100%" height={14} className="mb-1" />
            <Skeleton variant="text" width="80%" height={14} />
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-md">
              <div className="flex items-center gap-3 mb-2">
                <Skeleton variant="circular" width={40} height={40} />
                <div>
                  <Skeleton variant="text" width={60} height={24} className="mb-1" />
                  <Skeleton variant="text" width={80} height={12} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Mini Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-md mb-6">
          <Skeleton variant="text" width="40%" height={24} className="mb-4" />
          <Skeleton variant="rounded" width="100%" height={150} />
        </div>

        {/* Badges */}
        <div className="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-gray-800 dark:to-gray-900 rounded-3xl p-6 shadow-xl">
          <Skeleton variant="text" width="30%" height={24} className="mb-4" />
          <Skeleton variant="text" width="60%" height={16} />
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

