'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Avatar from './Avatar';
import { BookOpen, Loader2, Users } from 'lucide-react';

interface Activity {
  _id: string;
  user: {
    _id: string;
    username: string;
    avatar: string;
  };
  book: {
    _id: string;
    title: string;
    author: string;
  };
  pagesRead: number;
  date: string;
  createdAt: string;
}

export default function FriendActivityFeed() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      const res = await fetch('/api/friends/activity?limit=10');
      const data = await res.json();
      if (data.success) {
        setActivities(data.data);
      }
    } catch (error) {
      console.error('Activity fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTimeAgo = (date: string) => {
    const now = new Date();
    const activityDate = new Date(date);
    const diff = now.getTime() - activityDate.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (days > 0) {
      return `${days} gün önce`;
    } else if (hours > 0) {
      return `${hours} saat önce`;
    } else {
      return 'Az önce';
    }
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-md">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      </div>
    );
  }

  if (activities.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-md">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          🔔 Arkadaş Aktiviteleri
        </h3>
        <div className="text-center py-8">
          <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">
            Henüz arkadaş aktivitesi yok
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
            Arkadaş ekleyince onların okuma aktivitelerini görebilirsin!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-md">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        🔔 Arkadaş Aktiviteleri
      </h3>

      <div className="space-y-4 max-h-96 overflow-y-auto">
        {activities.map((activity, index) => (
          <motion.div
            key={activity._id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className="flex gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
          >
            {/* Avatar */}
            <Avatar avatar={activity.user.avatar} size="sm" />

            {/* Content */}
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-900 dark:text-white">
                <span className="font-semibold">{activity.user.username}</span>
                {' '}
                <span className="text-gray-600 dark:text-gray-400">
                  {activity.pagesRead} sayfa okudu
                </span>
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                📖 {activity.book.title}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                {getTimeAgo(activity.date)}
              </p>
            </div>

            {/* Pages Badge */}
            <div className="flex-shrink-0 text-right">
              <div className="inline-flex items-center gap-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-2 py-1 rounded-lg text-xs font-semibold">
                <BookOpen className="w-3 h-3" />
                {activity.pagesRead}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

