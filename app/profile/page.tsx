'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navigation from '@/components/Navigation';
import Avatar from '@/components/Avatar';
import AvatarSelector from '@/components/AvatarSelector';
import MiniReadingChart from '@/components/MiniReadingChart';
import ProfilePageSkeleton from '@/components/skeletons/ProfilePageSkeleton';
import { Edit2, Save, X, BookOpen, TrendingUp, Target, Calendar, Trophy } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Avatar as AvatarType } from '@/lib/avatars';

interface UserProfile {
  _id: string;
  username: string;
  avatar: string;
  bio?: string;
  totalPagesRead: number;
  totalBooksCompleted: number;
  currentStreak: number;
  longestStreak: number;
  profilePublic: boolean;
  showStatsToFriends: boolean;
  createdAt: string;
}

function ProfileContent() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [recentBadges, setRecentBadges] = useState<any[]>([]);
  const [badgeCount, setBadgeCount] = useState(0);
  
  // Edit form data
  const [editData, setEditData] = useState({
    avatar: '😊',
    bio: '',
  });

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (status === 'authenticated') {
      fetchProfile();
      fetchBadges();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  const fetchProfile = async () => {
    try {
      const res = await fetch('/api/profile');
      const data = await res.json();
      if (data.success) {
        setProfile(data.data);
        setEditData({
          avatar: data.data.avatar || '😊',
          bio: data.data.bio || '',
        });
      }
    } catch (error) {
      console.error('Profile fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchBadges = async () => {
    try {
      const res = await fetch('/api/badges');
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.data) {
          // Filter and get unlocked badges
          const unlocked = data.data.filter((b: any) => b.unlockedAt);
          setBadgeCount(unlocked.length);
          // Get most recent 3 badges
          const recent = unlocked
            .sort((a: any, b: any) => new Date(b.unlockedAt).getTime() - new Date(a.unlockedAt).getTime())
            .slice(0, 3);
          setRecentBadges(recent);
        }
      }
    } catch (error) {
      console.error('Rozet bilgisi alınamadı:', error);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editData),
      });

      const data = await res.json();
      if (data.success) {
        setProfile(data.data);
        setEditMode(false);
      } else {
        alert(data.error || 'Profil güncellenemedi');
      }
    } catch (error) {
      console.error('Profile update error:', error);
      alert('Bir hata oluştu');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (profile) {
      setEditData({
        avatar: profile.avatar || '😊',
        bio: profile.bio || '',
      });
    }
    setEditMode(false);
  };

  if (status === 'loading' || loading) {
    return <ProfilePageSkeleton />;
  }

  if (status === 'unauthenticated') {
    return null;
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-600">Profil yüklenemedi</p>
      </div>
    );
  }

  return (
    <>
      <main className="container-mobile pb-24 pt-20">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between animate-fadeIn">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Profilim 👤
          </h1>
          {!editMode && (
            <button
              onClick={() => setEditMode(true)}
              className="flex items-center gap-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-xl transition-colors"
            >
              <Edit2 className="w-4 h-4" />
              Düzenle
            </button>
          )}
        </div>

        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-xl mb-6"
        >
          {/* Avatar Section */}
          <div className="flex flex-col items-center mb-6">
            <Avatar avatar={editMode ? editData.avatar : profile.avatar} size="xl" />
            <h2 className="mt-4 text-2xl font-bold text-gray-900 dark:text-white">
              {profile.username}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Üyelik: {new Date(profile.createdAt).toLocaleDateString('tr-TR')}
            </p>
          </div>

          {/* Edit Mode - Avatar Selection */}
          <AnimatePresence>
            {editMode && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-6"
              >
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Avatar Seç
                </label>
                <AvatarSelector
                  currentAvatar={editData.avatar}
                  onSelect={(avatar: AvatarType) => setEditData({ ...editData, avatar })}
                  size="md"
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Bio Section */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Hakkımda
            </label>
            {editMode ? (
              <textarea
                value={editData.bio}
                onChange={(e) => setEditData({ ...editData, bio: e.target.value })}
                maxLength={200}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-400 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all"
                placeholder="Kendinden bahset... (max 200 karakter)"
              />
            ) : (
              <p className="text-gray-700 dark:text-gray-300 italic">
                {profile.bio || 'Henüz bir şey yazılmamış...'}
              </p>
            )}
          </div>

          {/* Edit Mode - Action Buttons */}
          <AnimatePresence>
            {editMode && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="flex gap-3 justify-end"
              >
                <button
                  onClick={handleCancel}
                  disabled={saving}
                  className="flex items-center gap-2 px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-semibold rounded-xl hover:bg-gray-300 dark:hover:bg-gray-600 transition-all disabled:opacity-50"
                >
                  <X className="w-4 h-4" />
                  İptal
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex items-center gap-2 px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-xl shadow-md transition-all disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  {saving ? 'Kaydediliyor...' : 'Kaydet'}
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-md"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-blue-100 dark:bg-blue-900 rounded-full w-10 h-10 flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {profile.totalPagesRead}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">Toplam Sayfa</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-md"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-green-100 dark:bg-green-900 rounded-full w-10 h-10 flex items-center justify-center">
                <Target className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {profile.totalBooksCompleted}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">Tamamlanan</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-md"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-orange-100 dark:bg-orange-900 rounded-full w-10 h-10 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {profile.currentStreak}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">Güncel Seri</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-md"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-purple-100 dark:bg-purple-900 rounded-full w-10 h-10 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {profile.longestStreak}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">En Uzun Seri</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Mini Reading Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <MiniReadingChart />
        </motion.div>

        {/* Badges Preview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border-2 border-yellow-200 dark:border-yellow-800 rounded-2xl p-6 shadow-lg mt-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Trophy className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                Rozetlerim
              </h3>
            </div>
            <Link
              href="/badges"
              className="text-sm font-medium text-orange-600 dark:text-orange-400 hover:underline flex items-center gap-1"
            >
              Tümünü Gör →
            </Link>
          </div>
          
          {recentBadges.length > 0 ? (
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                {badgeCount} rozet kazandın! Son kazandıklarından bazıları:
              </p>
              <div className="grid grid-cols-3 gap-3">
                {recentBadges.map((badge: any) => (
                  <div
                    key={badge.badgeId}
                    className="bg-white dark:bg-gray-800 rounded-xl p-3 text-center shadow-sm"
                  >
                    <div className="text-3xl mb-1">{badge.icon}</div>
                    <p className="text-xs font-medium text-gray-900 dark:text-white truncate">
                      {badge.name}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-gray-600 dark:text-gray-400 text-center py-4">
              Rozetlerinizi toplamaya başlayın! 🎉
            </p>
          )}
        </motion.div>
      </main>

      <Navigation />
    </>
  );
}

export default function ProfilePage() {
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
      <ProfileContent />
    </Suspense>
  );
}

