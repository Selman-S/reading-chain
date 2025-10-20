import { Skeleton } from '../Skeleton';

export default function BooksPageSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="fixed top-0 left-0 right-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-800 z-50">
        <div className="max-w-screen-sm mx-auto px-4 py-3 flex justify-end">
          <Skeleton variant="circular" width={40} height={40} />
        </div>
      </div>

      <main className="container-mobile pb-24 pt-20">
        {/* Header */}
        <div className="mb-6 animate-fadeIn">
          <Skeleton variant="text" width="50%" height={36} className="mb-2" />
          <Skeleton variant="text" width="70%" height={20} />
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} variant="rounded" width={100} height={40} />
          ))}
        </div>

        {/* Add Button */}
        <Skeleton variant="rounded" width="100%" height={56} className="mb-6" />

        {/* Books List */}
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-md">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <Skeleton variant="text" width="70%" height={24} className="mb-2" />
                  <Skeleton variant="text" width="50%" height={16} className="mb-3" />
                  <Skeleton variant="text" width="40%" height={14} />
                </div>
                <Skeleton variant="circular" width={40} height={40} />
              </div>
              
              {/* Progress Bar */}
              <div className="mb-3">
                <Skeleton variant="rounded" width="100%" height={8} />
              </div>
              
              {/* Action Buttons */}
              <div className="flex gap-2">
                <Skeleton variant="rounded" className="flex-1" height={40} />
                <Skeleton variant="rounded" width={40} height={40} />
                <Skeleton variant="rounded" width={40} height={40} />
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Bottom Nav */}
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

