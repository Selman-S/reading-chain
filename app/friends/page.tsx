'use client';

import { useEffect, Suspense } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Navigation from '@/components/Navigation';
import { Users, Search, UserPlus, TrendingUp } from 'lucide-react';

function FriendsContent() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

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

  if (status === 'unauthenticated') {
    return null;
  }

  return (
    <>
      <main className="container-mobile pb-24 pt-20">
        {/* Header */}
        <div className="mb-8 animate-fadeIn">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Arkadaşlar 👥
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Arkadaşlarınla yarış, rekorlarını karşılaştır!
          </p>
        </div>

        {/* Coming Soon Card */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 rounded-3xl p-8 shadow-xl">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full mb-6 shadow-lg">
              <Users className="w-12 h-12 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Yakında Geliyor! 🎉
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-6">
              Arkadaş sistemi üzerinde çalışıyoruz. Çok yakında:
            </p>
            
            <div className="space-y-4 text-left max-w-md mx-auto">
              <div className="flex items-start gap-3 bg-white dark:bg-gray-800 p-4 rounded-xl">
                <Search className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">Arkadaş Ara</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Kullanıcı adıyla arkadaş bulun ve ekleyin
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-white dark:bg-gray-800 p-4 rounded-xl">
                <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">Sıralama</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Günlük, haftalık ve aylık okuma sıralamaları
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-white dark:bg-gray-800 p-4 rounded-xl">
                <UserPlus className="w-5 h-5 text-purple-600 dark:text-purple-400 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">Arkadaş İstekleri</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Gelen ve giden arkadaşlık istekleri
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Navigation />
    </>
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

