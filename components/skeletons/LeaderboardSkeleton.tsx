import { Skeleton } from '../Skeleton';

export default function LeaderboardSkeleton() {
  return (
    <div className="space-y-3">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-md animate-fadeIn">
          <div className="flex items-center gap-3">
            {/* Rank */}
            <Skeleton variant="text" width={30} height={24} />

            {/* Avatar */}
            <Skeleton variant="circular" width={40} height={40} />

            {/* Info */}
            <div className="flex-1">
              <Skeleton variant="text" width="60%" height={18} className="mb-2" />
              <Skeleton variant="text" width="80%" height={14} />
            </div>

            {/* Score */}
            <div className="text-right">
              <Skeleton variant="text" width={50} height={24} className="mb-1" />
              <Skeleton variant="text" width={40} height={12} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

