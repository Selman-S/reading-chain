'use client';

import { useState, useEffect, Suspense } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { BookOpen, Flame } from 'lucide-react';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (searchParams.get('registered') === 'true') {
      setSuccess('Kayıt başarılı! Şimdi giriş yapabilirsiniz.');
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await signIn('credentials', {
        username: formData.username,
        password: formData.password,
        redirect: false,
      });

      if (result?.error) {
        setError('Kullanıcı adı veya şifre hatalı');
        setLoading(false);
        return;
      }

      // Başarılı giriş - ana sayfaya yönlendir
      if (result?.ok) {
        console.log('✅ Login başarılı, yönlendiriliyor...');
        // Cookie'nin set olması için kısa bir bekleme
        await new Promise(resolve => setTimeout(resolve, 500));
        console.log('📍 Ana sayfaya yönlendirme yapılıyor...');
        // Next.js router ile yönlendir
        router.push('/');
        // Fallback: 1 saniye sonra hala yönlenmediyse hard redirect
        setTimeout(() => {
          if (window.location.pathname === '/login') {
            console.log('⚠️ Router çalışmadı, hard redirect yapılıyor');
            window.location.replace('/');
          }
        }, 1000);
      }
    } catch (err) {
      setError('Bir hata oluştu. Lütfen tekrar deneyin.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800 px-4">
      <div className="max-w-md w-full">
        {/* Logo & Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-orange-400 to-red-500 rounded-full mb-4 shadow-xl">
            <Flame className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Reading Chain
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Okuma zincirine devam et! 🔥
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-xl">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Hoş Geldin!
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Giriş yaparak okuma yolculuğuna başla
            </p>
          </div>

          {/* Success Message */}
          {success && (
            <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl">
              <p className="text-sm text-green-600 dark:text-green-400">
                {success}
              </p>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Kullanıcı Adı
              </label>
              <input
                id="username"
                type="text"
                required
                value={formData.username}
                onChange={(e) =>
                  setFormData({ ...formData, username: e.target.value })
                }
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-400 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all"
                placeholder="Kullanıcı adınız"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Şifre
              </label>
              <input
                id="password"
                type="password"
                required
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-400 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Giriş Yapılıyor...' : 'Giriş Yap'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Hesabınız yok mu?{' '}
              <Link
                href="/signup"
                className="text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 font-semibold"
              >
                Kayıt Ol
              </Link>
            </p>
          </div>

          {/* Features */}
          <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center flex-shrink-0">
                  <BookOpen className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900 dark:text-white">
                    Kitaplarını Takip Et
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Okuduğun kitapları kolayca yönet
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-900 flex items-center justify-center flex-shrink-0">
                  <Flame className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900 dark:text-white">
                    Zincirinizi Kırmayın
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Her gün okuyarak rekor kırın
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center flex-shrink-0">
                  <span className="text-lg">📊</span>
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900 dark:text-white">
                    İstatistikler
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    İlerlemenizi grafiklerle görün
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Giriş yaparak{' '}
            <span className="font-medium">kişisel verilerinizin</span> güvenliğini
            kabul etmiş olursunuz
          </p>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Yükleniyor...</p>
        </div>
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}

