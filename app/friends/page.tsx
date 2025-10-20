'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Navigation from '@/components/Navigation';
import Avatar from '@/components/Avatar';
import FriendsPageSkeleton from '@/components/skeletons/FriendsPageSkeleton';
import {
  Users,
  Search,
  UserPlus,
  TrendingUp,
  Trophy,
  Clock,
  Check,
  X,
  UserMinus,
  Loader2,
} from 'lucide-react';
import { motion } from 'framer-motion';

interface User {
  _id: string;
  username: string;
  avatar: string;
  currentStreak?: number;
  totalPagesRead?: number;
  friendshipStatus?: string;
  friendshipId?: string;
}

interface LeaderboardEntry {
  _id: string;
  username: string;
  avatar: string;
  currentStreak: number;
  totalPagesRead: number;
  periodPages: number;
  rank: number;
  isCurrentUser: boolean;
}

function FriendsContent() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'friends' | 'requests' | 'search' | 'leaderboard'>(
    'leaderboard'
  );

  // Friends
  const [friends, setFriends] = useState<User[]>([]);
  const [loadingFriends, setLoadingFriends] = useState(false);

  // Requests
  const [pendingRequests, setPendingRequests] = useState<any[]>([]);
  const [sentRequests, setSentRequests] = useState<any[]>([]);
  const [loadingRequests, setLoadingRequests] = useState(false);

  // Search
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [loadingSearch, setLoadingSearch] = useState(false);

  // Leaderboard
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [leaderboardPeriod, setLeaderboardPeriod] = useState<'daily' | 'weekly' | 'monthly'>(
    'weekly'
  );
  const [leaderboardScope, setLeaderboardScope] = useState<'friends' | 'global'>('friends');
  const [loadingLeaderboard, setLoadingLeaderboard] = useState(false);
  const [currentUserRank, setCurrentUserRank] = useState<LeaderboardEntry | null>(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (status === 'authenticated') {
      fetchLeaderboard();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  useEffect(() => {
    if (activeTab === 'friends' && friends.length === 0) {
      fetchFriends();
    } else if (activeTab === 'requests' && pendingRequests.length === 0) {
      fetchRequests();
    } else if (activeTab === 'leaderboard') {
      fetchLeaderboard();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  useEffect(() => {
    if (activeTab === 'leaderboard') {
      fetchLeaderboard();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [leaderboardPeriod, leaderboardScope]);

  const fetchFriends = async () => {
    setLoadingFriends(true);
    try {
      const res = await fetch('/api/friends?type=friends');
      const data = await res.json();
      if (data.success) {
        setFriends(data.data);
      }
    } catch (error) {
      console.error('Friends fetch error:', error);
    } finally {
      setLoadingFriends(false);
    }
  };

  const fetchRequests = async () => {
    setLoadingRequests(true);
    try {
      const [pendingRes, sentRes] = await Promise.all([
        fetch('/api/friends?type=pending'),
        fetch('/api/friends?type=sent'),
      ]);

      const pendingData = await pendingRes.json();
      const sentData = await sentRes.json();

      if (pendingData.success) setPendingRequests(pendingData.data);
      if (sentData.success) setSentRequests(sentData.data);
    } catch (error) {
      console.error('Requests fetch error:', error);
    } finally {
      setLoadingRequests(false);
    }
  };

  const handleSearch = async () => {
    if (searchQuery.trim().length < 2) return;

    setLoadingSearch(true);
    try {
      const res = await fetch(`/api/users/search?q=${encodeURIComponent(searchQuery)}`);
      const data = await res.json();
      if (data.success) {
        setSearchResults(data.data);
      }
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoadingSearch(false);
    }
  };

  const sendFriendRequest = async (friendId: string) => {
    try {
      const res = await fetch('/api/friends', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ friendId }),
      });

      const data = await res.json();
      if (data.success) {
        alert('Arkadaşlık isteği gönderildi!');
        handleSearch(); // Refresh
      } else {
        alert(data.error || 'İstek gönderilemedi');
      }
    } catch (error) {
      console.error('Friend request error:', error);
      alert('Bir hata oluştu');
    }
  };

  const respondToRequest = async (requestId: string, action: 'accept' | 'reject') => {
    try {
      const res = await fetch(`/api/friends/${requestId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      });

      const data = await res.json();
      if (data.success) {
        alert(data.message);
        fetchRequests();
        fetchFriends();
      } else {
        alert(data.error || 'İşlem başarısız');
      }
    } catch (error) {
      console.error('Respond error:', error);
      alert('Bir hata oluştu');
    }
  };

  const removeFriend = async (friendshipId: string) => {
    if (!confirm('Arkadaşlıktan çıkarmak istediğinize emin misiniz?')) return;

    try {
      const res = await fetch(`/api/friends/${friendshipId}`, {
        method: 'DELETE',
      });

      const data = await res.json();
      if (data.success) {
        alert(data.message);
        fetchFriends();
      } else {
        alert(data.error || 'İşlem başarısız');
      }
    } catch (error) {
      console.error('Remove friend error:', error);
      alert('Bir hata oluştu');
    }
  };

  const fetchLeaderboard = async () => {
    setLoadingLeaderboard(true);
    try {
      const res = await fetch(
        `/api/leaderboard?period=${leaderboardPeriod}&scope=${leaderboardScope}`
      );
      const data = await res.json();
      if (data.success) {
        setLeaderboard(data.data);
        setCurrentUserRank(data.currentUser);
      }
    } catch (error) {
      console.error('Leaderboard fetch error:', error);
    } finally {
      setLoadingLeaderboard(false);
    }
  };

  if (status === 'loading') {
    return <FriendsPageSkeleton />;
  }

  if (status === 'unauthenticated') {
    return null;
  }

  return (
    <>
      <main className="container-mobile pb-24 pt-20">
        {/* Header */}
        <div className="mb-6 animate-fadeIn">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Arkadaşlar 👥</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Arkadaşlarınla yarış, rekorlarını karşılaştır!
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          <button
            onClick={() => setActiveTab('leaderboard')}
            className={`
              px-4 py-2 rounded-full font-medium transition-all whitespace-nowrap flex items-center gap-2
              ${
                activeTab === 'leaderboard'
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }
            `}
          >
            <Trophy className="w-4 h-4" />
            Sıralama
          </button>
          <button
            onClick={() => setActiveTab('friends')}
            className={`
              px-4 py-2 rounded-full font-medium transition-all whitespace-nowrap flex items-center gap-2
              ${
                activeTab === 'friends'
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }
            `}
          >
            <Users className="w-4 h-4" />
            Arkadaşlar ({friends.length})
          </button>
          <button
            onClick={() => setActiveTab('requests')}
            className={`
              px-4 py-2 rounded-full font-medium transition-all whitespace-nowrap flex items-center gap-2
              ${
                activeTab === 'requests'
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }
            `}
          >
            <Clock className="w-4 h-4" />
            İstekler ({pendingRequests.length})
          </button>
          <button
            onClick={() => setActiveTab('search')}
            className={`
              px-4 py-2 rounded-full font-medium transition-all whitespace-nowrap flex items-center gap-2
              ${
                activeTab === 'search'
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }
            `}
          >
            <Search className="w-4 h-4" />
            Ara
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'leaderboard' && (
          <LeaderboardTab
            leaderboard={leaderboard}
            period={leaderboardPeriod}
            setPeriod={setLeaderboardPeriod}
            scope={leaderboardScope}
            setScope={setLeaderboardScope}
            loading={loadingLeaderboard}
            currentUserRank={currentUserRank}
          />
        )}

        {activeTab === 'friends' && (
          <FriendsTab friends={friends} loading={loadingFriends} onRemove={removeFriend} />
        )}

        {activeTab === 'requests' && (
          <RequestsTab
            pending={pendingRequests}
            sent={sentRequests}
            loading={loadingRequests}
            onRespond={respondToRequest}
          />
        )}

        {activeTab === 'search' && (
          <SearchTab
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            onSearch={handleSearch}
            results={searchResults}
            loading={loadingSearch}
            onSendRequest={sendFriendRequest}
          />
        )}
      </main>

      <Navigation />
    </>
  );
}

// Tab Components
function LeaderboardTab({
  leaderboard,
  period,
  setPeriod,
  scope,
  setScope,
  loading,
  currentUserRank,
}: {
  leaderboard: LeaderboardEntry[];
  period: string;
  setPeriod: (p: 'daily' | 'weekly' | 'monthly') => void;
  scope: string;
  setScope: (s: 'friends' | 'global') => void;
  loading: boolean;
  currentUserRank: LeaderboardEntry | null;
}) {
  return (
    <div>
      {/* Filters */}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
        <select
          value={period}
          onChange={(e) => setPeriod(e.target.value as any)}
          className="px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-medium"
        >
          <option value="daily">Günlük</option>
          <option value="weekly">Haftalık</option>
          <option value="monthly">Aylık</option>
        </select>

        <select
          value={scope}
          onChange={(e) => setScope(e.target.value as any)}
          className="px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-medium"
        >
          <option value="friends">Arkadaşlar</option>
          <option value="global">Global</option>
        </select>
      </div>

      {/* Current User Rank */}
      {currentUserRank && (
        <div className="bg-gradient-to-br from-blue-100 to-purple-100 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-4 mb-4 shadow-lg">
          <p className="text-sm text-gray-700 dark:text-gray-300 mb-1">Senin Sıralaman</p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                #{currentUserRank.rank}
              </span>
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">
                  {currentUserRank.periodPages} sayfa
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Toplam: {currentUserRank.totalPagesRead} sayfa
                </p>
              </div>
            </div>
            <Trophy className="w-8 h-8 text-yellow-500" />
          </div>
        </div>
      )}

      {/* Leaderboard */}
      {loading ? (
        <div className="text-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-2" />
          <p className="text-gray-600 dark:text-gray-400">Yükleniyor...</p>
        </div>
      ) : leaderboard.length > 0 ? (
        <div className="space-y-3">
          {leaderboard.map((entry, index) => (
            <motion.div
              key={entry._id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`
                bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-md
                ${entry.isCurrentUser ? 'ring-2 ring-blue-500' : ''}
              `}
            >
              <div className="flex items-center gap-3">
                {/* Rank */}
                <div className="w-8 text-center">
                  {entry.rank === 1 && <span className="text-2xl">🥇</span>}
                  {entry.rank === 2 && <span className="text-2xl">🥈</span>}
                  {entry.rank === 3 && <span className="text-2xl">🥉</span>}
                  {entry.rank > 3 && (
                    <span className="text-lg font-bold text-gray-600 dark:text-gray-400">
                      #{entry.rank}
                    </span>
                  )}
                </div>

                {/* Avatar */}
                <Avatar avatar={entry.avatar} size="sm" />

                {/* Info */}
                <div className="flex-1">
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {entry.username}
                    {entry.isCurrentUser && (
                      <span className="ml-2 text-xs bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 px-2 py-1 rounded-full">
                        Sen
                      </span>
                    )}
                  </p>
                  <div className="flex items-center gap-3 text-xs text-gray-600 dark:text-gray-400 mt-1">
                    <span className="flex items-center gap-1">
                      📖 {entry.periodPages} sayfa
                    </span>
                    <span className="flex items-center gap-1">
                      🔥 {entry.currentStreak} gün
                    </span>
                  </div>
                </div>

                {/* Score */}
                <div className="text-right">
                  <p className="text-xl font-bold text-blue-600 dark:text-blue-400">
                    {entry.periodPages}
                  </p>
                  <p className="text-xs text-gray-500">sayfa</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-600 dark:text-gray-400">Henüz veri yok</p>
        </div>
      )}
    </div>
  );
}

function FriendsTab({
  friends,
  loading,
  onRemove,
}: {
  friends: User[];
  loading: boolean;
  onRemove: (id: string) => void;
}) {
  return (
    <div>
      {loading ? (
        <div className="text-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-2" />
          <p className="text-gray-600 dark:text-gray-400">Yükleniyor...</p>
        </div>
      ) : friends.length > 0 ? (
        <div className="space-y-3">
          {friends.map((friend, index) => (
            <motion.div
              key={friend._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-md"
            >
              <div className="flex items-center gap-3">
                <Avatar avatar={friend.avatar} size="md" />
                <div className="flex-1">
                  <p className="font-semibold text-gray-900 dark:text-white">{friend.username}</p>
                  <div className="flex items-center gap-3 text-xs text-gray-600 dark:text-gray-400 mt-1">
                    <span>🔥 {friend.currentStreak || 0} gün</span>
                    <span>📖 {friend.totalPagesRead || 0} sayfa</span>
                  </div>
                </div>
                <button
                  onClick={() => onRemove(friend._id)}
                  className="p-2 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-xl hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
                >
                  <UserMinus className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400 mb-2">Henüz arkadaşın yok</p>
          <p className="text-sm text-gray-500 dark:text-gray-500">Ara sekmesinden arkadaş ekle!</p>
        </div>
      )}
    </div>
  );
}

function RequestsTab({
  pending,
  sent,
  loading,
  onRespond,
}: {
  pending: any[];
  sent: any[];
  loading: boolean;
  onRespond: (id: string, action: 'accept' | 'reject') => void;
}) {
  return (
    <div className="space-y-6">
      {/* Pending Requests */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
          Gelen İstekler ({pending.length})
        </h3>
        {loading ? (
          <div className="text-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-2" />
          </div>
        ) : pending.length > 0 ? (
          <div className="space-y-3">
            {pending.map((request) => (
              <div
                key={request._id}
                className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-md"
              >
                <div className="flex items-center gap-3">
                  <Avatar avatar={request.user?.avatar} size="sm" />
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {request.user?.username}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500">
                      {new Date(request.createdAt).toLocaleDateString('tr-TR')}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => onRespond(request._id, 'accept')}
                      className="p-2 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-xl hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onRespond(request._id, 'reject')}
                      className="p-2 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-xl hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center py-6 text-gray-500 dark:text-gray-500">Gelen istek yok</p>
        )}
      </div>

      {/* Sent Requests */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
          Gönderilen İstekler ({sent.length})
        </h3>
        {sent.length > 0 ? (
          <div className="space-y-3">
            {sent.map((request) => (
              <div
                key={request._id}
                className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-md"
              >
                <div className="flex items-center gap-3">
                  <Avatar avatar={request.user?.avatar} size="sm" />
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {request.user?.username}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500">Beklemede...</p>
                  </div>
                  <Clock className="w-5 h-5 text-gray-400" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center py-6 text-gray-500 dark:text-gray-500">
            Gönderilen istek yok
          </p>
        )}
      </div>
    </div>
  );
}

function SearchTab({
  searchQuery,
  setSearchQuery,
  onSearch,
  results,
  loading,
  onSendRequest,
}: {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  onSearch: () => void;
  results: User[];
  loading: boolean;
  onSendRequest: (id: string) => void;
}) {
  return (
    <div>
      {/* Search Bar */}
      <div className="mb-6">
        <div className="flex gap-2">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && onSearch()}
            placeholder="Kullanıcı adı ara..."
            className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
          />
          <button
            onClick={onSearch}
            disabled={loading || searchQuery.trim().length < 2}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold rounded-xl transition-colors flex items-center gap-2"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Results */}
      {results.length > 0 ? (
        <div className="space-y-3">
          {results.map((user, index) => (
            <motion.div
              key={user._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-md"
            >
              <div className="flex items-center gap-3">
                <Avatar avatar={user.avatar} size="sm" />
                <div className="flex-1">
                  <p className="font-semibold text-gray-900 dark:text-white">{user.username}</p>
                  <div className="flex items-center gap-3 text-xs text-gray-600 dark:text-gray-400 mt-1">
                    <span>🔥 {user.currentStreak || 0}</span>
                    <span>📖 {user.totalPagesRead || 0}</span>
                  </div>
                </div>
                {user.friendshipStatus === 'none' && (
                  <button
                    onClick={() => onSendRequest(user._id)}
                    className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
                  >
                    <UserPlus className="w-4 h-4" />
                  </button>
                )}
                {user.friendshipStatus === 'friends' && (
                  <span className="text-xs bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300 px-3 py-1 rounded-full">
                    ✓ Arkadaş
                  </span>
                )}
                {user.friendshipStatus === 'pending_sent' && (
                  <span className="text-xs bg-yellow-100 dark:bg-yellow-900 text-yellow-600 dark:text-yellow-300 px-3 py-1 rounded-full">
                    ⏳ Beklemede
                  </span>
                )}
                {user.friendshipStatus === 'pending_received' && (
                  <span className="text-xs bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300 px-3 py-1 rounded-full">
                    📨 İstek Var
                  </span>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Kullanıcı ara</p>
          <p className="text-sm text-gray-500 dark:text-gray-500">En az 2 karakter girin</p>
        </div>
      )}
    </div>
  );
}

export default function FriendsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Yükleniyor...</p>
          </div>
        </div>
      }
    >
      <FriendsContent />
    </Suspense>
  );
}

