'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Navigation from '@/components/Navigation';
import StreakDisplay from '@/components/StreakDisplay';
import QuickReadingEntry from '@/components/QuickReadingEntry';
import FriendActivityFeed from '@/components/FriendActivityFeed';
import { TrendingUp, BookOpen, Target } from 'lucide-react';

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

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (status === 'authenticated') {
      fetchStats();
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

  const handleReadingAdded = () => {
    fetchStats();
  };

  // Loading state
  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  // Unauthenticated - redirect to login
  if (status === 'unauthenticated') {
    return null;
  }

  // Authenticated but stats still loading
  if (status === 'authenticated' && loading && !stats) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Veriler yükleniyor...</p>
        </div>
      </div>
    );
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
