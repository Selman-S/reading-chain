'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navigation from '@/components/Navigation';
import StreakDisplay from '@/components/StreakDisplay';
import QuickReadingEntry from '@/components/QuickReadingEntry';
import FriendActivityFeed from '@/components/FriendActivityFeed';
import HomePageSkeleton from '@/components/skeletons/HomePageSkeleton';
import { TrendingUp, BookOpen, Target, Trophy, ChevronRight } from 'lucide-react';

interface Stats {
  streak: {
    current: number;
    longest: number;
    lastReadDate: string | null;
  };
  totalPagesRead: number;
  readingCount: number;
  averagePerDay: number;
  activeBooks: number;
}

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [badgeCount, setBadgeCount] = useState(0);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (status === 'authenticated') {
      fetchStats();
      fetchBadgeCount();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/stats');
      if (!res.ok) {
        throw new Error(`API Error: ${res.status}`);
      }
      const data = await res.json();
      if (data.success) {
        setStats(data.data);
      } else {
        setError(data.error || 'Veri yüklenemedi');
      }
    } catch (error: any) {
      console.error('İstatistikler yüklenemedi:', error);
      setError(error.message);
      // Hata durumunda varsayılan değerler
      setStats({
        streak: { current: 0, longest: 0, lastReadDate: null },
        totalPagesRead: 0,
        readingCount: 0,
        averagePerDay: 0,
        activeBooks: 0,
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchBadgeCount = async () => {
    try {
      const res = await fetch('/api/badges');
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.data) {
          // Count unlocked badges
          const unlockedCount = data.data.filter((b: any) => b.unlockedAt).length;
          setBadgeCount(unlockedCount);
        }
      }
    } catch (error) {
      console.error('Rozet sayısı alınamadı:', error);
    }
  };

  const handleReadingAdded = () => {
    fetchStats();
  };

  // Loading state
  if (status === 'loading' || (status === 'authenticated' && loading && !stats)) {
    return <HomePageSkeleton />;
  }

  // Unauthenticated - redirect to login
  if (status === 'unauthenticated') {
    return null;
  }

  return (
    <>
      <main className="container-mobile pb-24 pt-20">
        {/* Header */}
        <div className="mb-8 animate-fadeIn">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Hoş Geldin! 👋
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Okuma zincirine devam et!
          </p>
        </div>

        {/* Streak Display */}
        <div className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-gray-800 dark:to-gray-900 rounded-3xl p-8 mb-6 shadow-lg animate-fadeIn">
          <StreakDisplay
            current={stats?.streak.current || 0}
            longest={stats?.streak.longest || 0}
            size="lg"
          />
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-md text-center animate-fadeIn">
            <div className="bg-blue-100 dark:bg-blue-900 rounded-full w-10 h-10 flex items-center justify-center mx-auto mb-2">
              <BookOpen className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {stats?.totalPagesRead || 0}
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400">Toplam Sayfa</p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-md text-center animate-fadeIn">
            <div className="bg-green-100 dark:bg-green-900 rounded-full w-10 h-10 flex items-center justify-center mx-auto mb-2">
              <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {stats?.averagePerDay || 0}
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400">Günlük Ort.</p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-md text-center animate-fadeIn">
            <div className="bg-purple-100 dark:bg-purple-900 rounded-full w-10 h-10 flex items-center justify-center mx-auto mb-2">
              <Target className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {stats?.activeBooks || 0}
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400">Aktif Kitap</p>
          </div>
        </div>

        {/* Quick Reading Entry */}
        <div className="animate-fadeIn">
          <QuickReadingEntry onSuccess={handleReadingAdded} />
        </div>

        {/* Quick Access: Badges */}
        <Link 
          href="/badges"
          className="mt-6 bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border-2 border-yellow-200 dark:border-yellow-800 rounded-2xl p-4 flex items-center justify-between hover:scale-[1.02] transition-transform cursor-pointer animate-fadeIn"
        >
          <div className="flex items-center gap-4">
            <div className="bg-yellow-100 dark:bg-yellow-900 rounded-full w-12 h-12 flex items-center justify-center">
              <Trophy className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div>
              <p className="font-bold text-gray-900 dark:text-white">
                Rozetlerim
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {badgeCount} rozet kazandın 🏆
              </p>
            </div>
          </div>
          <ChevronRight className="w-6 h-6 text-gray-400 dark:text-gray-500" />
        </Link>

        {/* Motivational Message */}
        {stats && stats.streak.current === 0 && (
          <div className="mt-6 bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-200 dark:border-yellow-800 rounded-2xl p-4 animate-fadeIn">
            <p className="text-center text-yellow-800 dark:text-yellow-200 font-medium">
              💪 Zincirine bugün başla! Her gün okumak harika bir alışkanlık.
            </p>
          </div>
        )}

        {stats && stats.streak.current > 0 && stats.streak.current % 7 === 0 && (
          <div className="mt-6 bg-green-50 dark:bg-green-900/20 border-2 border-green-200 dark:border-green-800 rounded-2xl p-4 animate-fadeIn">
            <p className="text-center text-green-800 dark:text-green-200 font-medium">
              🎉 Tebrikler! {stats.streak.current} gündür kesintisiz okuyorsun!
            </p>
          </div>
        )}

        {/* Friend Activity Feed */}
        <div className="mt-6 animate-fadeIn">
          <FriendActivityFeed />
        </div>
      </main>

      <Navigation />
    </>
  );
}
