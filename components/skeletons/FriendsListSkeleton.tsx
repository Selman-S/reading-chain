import { Skeleton } from '../Skeleton';

export default function FriendsListSkeleton() {
  return (
    <div className="space-y-3">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-md animate-fadeIn">
          <div className="flex items-center gap-3">
            <Skeleton variant="circular" width={48} height={48} />
            <div className="flex-1">
              <Skeleton variant="text" width="50%" height={18} className="mb-2" />
              <Skeleton variant="text" width="70%" height={14} />
            </div>
            <Skeleton variant="rounded" width={40} height={40} />
          </div>
        </div>
      ))}
    </div>
  );
}

