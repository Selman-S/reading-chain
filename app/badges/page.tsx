'use client';

import { useEffect, Suspense } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Navigation from '@/components/Navigation';
import { Trophy, Award, Star, Zap } from 'lucide-react';

function BadgesContent() {
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
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-600 mx-auto mb-4"></div>
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
            Ödüller 🏆
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Rozetlerini topla, seviyeni yükselt!
          </p>
        </div>

        {/* Coming Soon Card */}
        <div className="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-gray-800 dark:to-gray-900 rounded-3xl p-8 shadow-xl">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full mb-6 shadow-lg">
              <Trophy className="w-12 h-12 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Yakında Geliyor! 🎉
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-6">
              Ödül sistemi üzerinde çalışıyoruz. Çok yakında:
            </p>
            
            <div className="space-y-4 text-left max-w-md mx-auto">
              <div className="flex items-start gap-3 bg-white dark:bg-gray-800 p-4 rounded-xl">
                <Award className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">Streak Rozetleri</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Kesintisiz okuma serileri için özel rozetler
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-white dark:bg-gray-800 p-4 rounded-xl">
                <Star className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">Sayfa Rozetleri</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Toplam okuduğun sayfa sayısına göre rozetler
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-white dark:bg-gray-800 p-4 rounded-xl">
                <Zap className="w-5 h-5 text-purple-600 dark:text-purple-400 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">Özel Başarımlar</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Hızlı okuma, haftalık hedef gibi özel rozetler
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-white dark:bg-gray-800 p-4 rounded-xl">
                <Trophy className="w-5 h-5 text-green-600 dark:text-green-400 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">Seviye Sistemi</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Okudukça seviye kazan, yeni rozetleri aç
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

