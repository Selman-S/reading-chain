'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Navigation from '@/components/Navigation';
import StatsPageSkeleton from '@/components/skeletons/StatsPageSkeleton';
import Heatmap from '@/components/Heatmap';
import ReadingChart from '@/components/ReadingChart';
import { Trophy, Book, Target, TrendingUp, Calendar, Award } from 'lucide-react';

interface Stats {
  totalBooks: number;
  completedBooks: number;
  activeBooks: number;
  totalPagesRead: number;
  averagePerDay: number;
  readingCount: number;
  streak: {
    current: number;
    longest: number;
  };
  dailyData: { date: string; pages: number }[];
  heatmapData: { date: string; count: number; level: number }[];
}

export default function StatsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [chartType, setChartType] = useState<'line' | 'bar'>('line');

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
      const data = await res.json();
      if (data.success) {
        setStats(data.data);
      }
    } catch (error) {
      console.error('İstatistikler yüklenemedi:', error);
    } finally {
      setLoading(false);
    }
  };

  const achievements = [
    {
      id: 1,
      title: 'İlk Adım',
      description: 'İlk okuma kaydını ekledin',
      icon: '🎯',
      unlocked: stats ? stats.readingCount > 0 : false,
    },
    {
      id: 2,
      title: 'Haftanın Kahramanı',
      description: '7 gün üst üste okuma yaptın',
      icon: '🔥',
      unlocked: stats ? stats.streak.current >= 7 : false,
    },
    {
      id: 3,
      title: 'Ay Yıldızı',
      description: '30 gün üst üste okuma yaptın',
      icon: '⭐',
      unlocked: stats ? stats.streak.current >= 30 : false,
    },
    {
      id: 4,
      title: 'Yüz Sayfa Kulübü',
      description: 'Toplamda 100 sayfa okudun',
      icon: '📚',
      unlocked: stats ? stats.totalPagesRead >= 100 : false,
    },
    {
      id: 5,
      title: 'Kitap Kurdu',
      description: 'Toplamda 500 sayfa okudun',
      icon: '🐛',
      unlocked: stats ? stats.totalPagesRead >= 500 : false,
    },
    {
      id: 6,
      title: 'Kitap Tamamlama',
      description: 'İlk kitabını tamamladın',
      icon: '✅',
      unlocked: stats ? stats.completedBooks > 0 : false,
    },
  ];

  if (status === 'loading' || loading) {
    return <StatsPageSkeleton />;
  }

  if (status === 'unauthenticated') {
    return null;
  }

  return (
    <>
      <main className="container-mobile pb-24 pt-20">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            İstatistikler
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Okuma yolculuğuna genel bakış
          </p>
        </div>

        {/* Key Stats Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-5 text-white shadow-lg">
            <Book className="w-8 h-8 mb-2 opacity-80" />
            <p className="text-3xl font-bold">{stats?.totalPagesRead || 0}</p>
            <p className="text-sm opacity-90">Toplam Sayfa</p>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-5 text-white shadow-lg">
            <TrendingUp className="w-8 h-8 mb-2 opacity-80" />
            <p className="text-3xl font-bold">{stats?.averagePerDay || 0}</p>
            <p className="text-sm opacity-90">Günlük Ortalama</p>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-5 text-white shadow-lg">
            <Trophy className="w-8 h-8 mb-2 opacity-80" />
            <p className="text-3xl font-bold">{stats?.streak.longest || 0}</p>
            <p className="text-sm opacity-90">En Uzun Zincir</p>
          </div>

          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-5 text-white shadow-lg">
            <Target className="w-8 h-8 mb-2 opacity-80" />
            <p className="text-3xl font-bold">{stats?.completedBooks || 0}</p>
            <p className="text-sm opacity-90">Tamamlanan</p>
          </div>
        </div>

        {/* Reading Chart */}
        {stats && stats.dailyData.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                Okuma Trendi
              </h3>
              <div className="flex gap-2">
                <button
                  onClick={() => setChartType('line')}
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                    chartType === 'line'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                  }`}
                >
                  Çizgi
                </button>
                <button
                  onClick={() => setChartType('bar')}
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                    chartType === 'bar'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                  }`}
                >
                  Çubuk
                </button>
              </div>
            </div>
            <ReadingChart data={stats.dailyData} type={chartType} />
          </div>
        )}

        {/* Heatmap */}
        {stats && stats.heatmapData.length > 0 && (
          <div className="mb-6">
            <Heatmap data={stats.heatmapData} />
          </div>
        )}

        {/* Achievements */}
        <div className="mb-6">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Award className="w-6 h-6" />
            Başarımlar
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {achievements.map((achievement) => (
              <div
                key={achievement.id}
                className={`rounded-2xl p-4 transition-all ${
                  achievement.unlocked
                    ? 'bg-gradient-to-br from-yellow-400 to-orange-500 text-white shadow-lg'
                    : 'bg-gray-200 dark:bg-gray-800 text-gray-400 dark:text-gray-600'
                }`}
              >
                <div className="text-3xl mb-2 filter grayscale-0">
                  {achievement.icon}
                </div>
                <p className={`font-bold text-sm mb-1 ${
                  achievement.unlocked ? 'text-white' : 'text-gray-600 dark:text-gray-500'
                }`}>
                  {achievement.title}
                </p>
                <p className={`text-xs ${
                  achievement.unlocked ? 'text-white/90' : 'text-gray-500 dark:text-gray-600'
                }`}>
                  {achievement.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Stats Summary */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
            Özet Bilgiler
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Toplam Kitap</span>
              <span className="font-bold text-gray-900 dark:text-white">
                {stats?.totalBooks || 0}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Aktif Kitap</span>
              <span className="font-bold text-gray-900 dark:text-white">
                {stats?.activeBooks || 0}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Tamamlanan Kitap</span>
              <span className="font-bold text-gray-900 dark:text-white">
                {stats?.completedBooks || 0}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Toplam Okuma Kaydı</span>
              <span className="font-bold text-gray-900 dark:text-white">
                {stats?.readingCount || 0}
              </span>
            </div>
          </div>
        </div>
      </main>

      <Navigation />
    </>
  );
}

