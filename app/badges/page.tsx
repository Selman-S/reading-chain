'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Navigation from '@/components/Navigation';
import BadgeCard from '@/components/BadgeCard';
import BadgesPageSkeleton from '@/components/skeletons/BadgesPageSkeleton';
import { Trophy, Filter, TrendingUp, Flame, BookOpen, Zap, Star } from 'lucide-react';
import { BadgeCategory } from '@/lib/badges';

interface BadgeData {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  requirement: number;
  rarity: string;
  unlocked: boolean;
  unlockedAt?: string | null;
  progress: number;
}

function BadgesContent() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [badges, setBadges] = useState<BadgeData[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, unlocked: 0, percentage: 0 });
  const [filter, setFilter] = useState<'all' | 'unlocked' | 'locked'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (status === 'authenticated') {
      fetchBadges();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  const fetchBadges = async () => {
    try {
      const res = await fetch('/api/badges?all=true');
      const data = await res.json();
      if (data.success) {
        setBadges(data.data);
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Badges fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading' || loading) {
    return <BadgesPageSkeleton />;
  }

  if (status === 'unauthenticated') {
    return null;
  }

  // Filter badges
  const filteredBadges = badges.filter(badge => {
    if (filter === 'unlocked' && !badge.unlocked) return false;
    if (filter === 'locked' && badge.unlocked) return false;
    if (categoryFilter !== 'all' && badge.category !== categoryFilter) return false;
    return true;
  });

  const categoryIcons = {
    [BadgeCategory.STREAK]: <Flame className="w-4 h-4" />,
    [BadgeCategory.PAGES]: <BookOpen className="w-4 h-4" />,
    [BadgeCategory.BOOKS]: <Trophy className="w-4 h-4" />,
    [BadgeCategory.SPEED]: <Zap className="w-4 h-4" />,
    [BadgeCategory.CONSISTENCY]: <TrendingUp className="w-4 h-4" />,
    [BadgeCategory.SPECIAL]: <Star className="w-4 h-4" />,
  };

  return (
    <>
      <main className="container-mobile pb-24 pt-20">
        {/* Header */}
        <div className="mb-6 animate-fadeIn">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Ödüller 🏆
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Rozetlerini topla, seviyeni yükselt!
          </p>
        </div>

        {/* Stats Card */}
        <div className="bg-gradient-to-br from-yellow-100 to-orange-100 dark:from-gray-800 dark:to-gray-900 rounded-3xl p-6 shadow-xl mb-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-700 dark:text-gray-300 mb-1">İlerleme</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {stats.unlocked}/{stats.total}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                %{stats.percentage} tamamlandı
              </p>
            </div>
            <div className="text-6xl">🏆</div>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-4 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 transition-all duration-500"
              style={{ width: `${stats.percentage}%` }}
            />
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6 space-y-3">
          {/* Status Filter */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            <Filter className="w-5 h-5 text-gray-600 dark:text-gray-400 flex-shrink-0" />
            <button
              onClick={() => setFilter('all')}
              className={`
                px-4 py-2 rounded-full font-medium transition-all whitespace-nowrap
                ${filter === 'all'
                  ? 'bg-orange-600 text-white shadow-lg'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}
              `}
            >
              Tümü
            </button>
            <button
              onClick={() => setFilter('unlocked')}
              className={`
                px-4 py-2 rounded-full font-medium transition-all whitespace-nowrap
                ${filter === 'unlocked'
                  ? 'bg-orange-600 text-white shadow-lg'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}
              `}
            >
              Açılmış
            </button>
            <button
              onClick={() => setFilter('locked')}
              className={`
                px-4 py-2 rounded-full font-medium transition-all whitespace-nowrap
                ${filter === 'locked'
                  ? 'bg-orange-600 text-white shadow-lg'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}
              `}
            >
              Kilitli
            </button>
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            <button
              onClick={() => setCategoryFilter('all')}
              className={`
                px-4 py-2 rounded-full font-medium transition-all whitespace-nowrap flex items-center gap-2
                ${categoryFilter === 'all'
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}
              `}
            >
              Tüm Kategoriler
            </button>
            {Object.entries(categoryIcons).map(([category, icon]) => (
              <button
                key={category}
                onClick={() => setCategoryFilter(category)}
                className={`
                  px-4 py-2 rounded-full font-medium transition-all whitespace-nowrap flex items-center gap-2
                  ${categoryFilter === category
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}
                `}
              >
                {icon}
                {category === BadgeCategory.STREAK && 'Streak'}
                {category === BadgeCategory.PAGES && 'Sayfa'}
                {category === BadgeCategory.BOOKS && 'Kitap'}
                {category === BadgeCategory.SPEED && 'Hız'}
                {category === BadgeCategory.CONSISTENCY && 'Düzenlilik'}
                {category === BadgeCategory.SPECIAL && 'Özel'}
              </button>
            ))}
          </div>
        </div>

        {/* Badges Grid */}
        {filteredBadges.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {filteredBadges.map((badge, index) => (
              <BadgeCard key={badge.id} badge={badge} index={index} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400">
              Bu filtrede rozet bulunamadı 🤷‍♂️
            </p>
          </div>
        )}
      </main>

      <Navigation />
    </>
  );
}

export default function BadgesPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Yükleniyor...</p>
          </div>
        </div>
      }
    >
      <BadgesContent />
    </Suspense>
  );
}

