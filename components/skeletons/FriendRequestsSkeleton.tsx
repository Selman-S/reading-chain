import { Skeleton } from '../Skeleton';

export default function FriendRequestsSkeleton() {
  return (
    <div className="space-y-6">
      {/* Pending Requests */}
      <div>
        <Skeleton variant="text" width="40%" height={24} className="mb-3" />
        <div className="space-y-3">
          {[1, 2].map((i) => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-md animate-fadeIn">
              <div className="flex items-center gap-3">
                <Skeleton variant="circular" width={40} height={40} />
                <div className="flex-1">
                  <Skeleton variant="text" width="50%" height={16} className="mb-2" />
                  <Skeleton variant="text" width="40%" height={12} />
                </div>
                <div className="flex gap-2">
                  <Skeleton variant="rounded" width={40} height={40} />
                  <Skeleton variant="rounded" width={40} height={40} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sent Requests */}
      <div>
        <Skeleton variant="text" width="50%" height={24} className="mb-3" />
        <div className="space-y-3">
          {[1, 2].map((i) => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-md animate-fadeIn">
              <div className="flex items-center gap-3">
                <Skeleton variant="circular" width={40} height={40} />
                <div className="flex-1">
                  <Skeleton variant="text" width="50%" height={16} className="mb-2" />
                  <Skeleton variant="text" width="35%" height={12} />
                </div>
                <Skeleton variant="circular" width={20} height={20} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

