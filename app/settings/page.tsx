'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Navigation from '@/components/Navigation';
import { Bell, Moon, Sun, Target, Download, Trash2 } from 'lucide-react';

export default function SettingsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [darkMode, setDarkMode] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [notificationTime, setNotificationTime] = useState('20:00');
  const [dailyGoal, setDailyGoal] = useState(25);
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>('default');

  // Session kontrolü
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  useEffect(() => {
    // Load settings from localStorage
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    const savedNotifications = localStorage.getItem('notificationsEnabled') === 'true';
    const savedTime = localStorage.getItem('notificationTime') || '20:00';
    const savedGoal = parseInt(localStorage.getItem('dailyGoal') || '25');

    setDarkMode(savedDarkMode);
    setNotificationsEnabled(savedNotifications);
    setNotificationTime(savedTime);
    setDailyGoal(savedGoal);

    // Apply dark mode
    if (savedDarkMode) {
      document.documentElement.classList.add('dark');
    }

    // Check notification permission
    if ('Notification' in window) {
      setNotificationPermission(Notification.permission);
    }
  }, []);

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem('darkMode', String(newMode));
    
    if (newMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const requestNotificationPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      setNotificationPermission(permission);
      
      if (permission === 'granted') {
        setNotificationsEnabled(true);
        localStorage.setItem('notificationsEnabled', 'true');
        scheduleNotification();
        
        // Test notification
        new Notification('Reading Chain', {
          body: 'Bildirimler başarıyla açıldı! 🎉',
          icon: '/icon-192x192.png',
        });
      }
    }
  };

  const toggleNotifications = () => {
    if (!notificationsEnabled && notificationPermission !== 'granted') {
      requestNotificationPermission();
    } else {
      const newState = !notificationsEnabled;
      setNotificationsEnabled(newState);
      localStorage.setItem('notificationsEnabled', String(newState));
      
      if (newState) {
        scheduleNotification();
      }
    }
  };

  const scheduleNotification = () => {
    // Schedule daily notification
    const [hours, minutes] = notificationTime.split(':').map(Number);
    const now = new Date();
    const scheduledTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes);
    
    if (scheduledTime < now) {
      scheduledTime.setDate(scheduledTime.getDate() + 1);
    }
    
    const timeUntilNotification = scheduledTime.getTime() - now.getTime();
    
    setTimeout(() => {
      if (notificationsEnabled && Notification.permission === 'granted') {
        new Notification('Reading Chain - Okuma Zamanı! 📚', {
          body: 'Bugün henüz okuma yapmadınız. Zincirinizi kırmayın!',
          icon: '/icon-192x192.png',
          tag: 'daily-reminder',
        });
      }
      
      // Schedule next day
      scheduleNotification();
    }, timeUntilNotification);
  };

  const handleTimeChange = (time: string) => {
    setNotificationTime(time);
    localStorage.setItem('notificationTime', time);
    if (notificationsEnabled) {
      scheduleNotification();
    }
  };

  const handleGoalChange = (goal: number) => {
    setDailyGoal(goal);
    localStorage.setItem('dailyGoal', String(goal));
  };

  const exportData = async () => {
    try {
      // Fetch all data
      const [booksRes, readingsRes, statsRes] = await Promise.all([
        fetch('/api/books'),
        fetch('/api/readings'),
        fetch('/api/stats'),
      ]);

      const [booksData, readingsData, statsData] = await Promise.all([
        booksRes.json(),
        readingsRes.json(),
        statsRes.json(),
      ]);

      const exportData = {
        books: booksData.data,
        readings: readingsData.data,
        stats: statsData.data,
        exportDate: new Date().toISOString(),
      };

      // Create download
      const blob = new Blob([JSON.stringify(exportData, null, 2)], {
        type: 'application/json',
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `reading-chain-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Dışa aktarma hatası:', error);
      alert('Veriler dışa aktarılamadı. Lütfen tekrar deneyin.');
    }
  };

  const clearAllData = async () => {
    if (!confirm('TÜM VERİLERİNİZ SİLİNECEK! Bu işlem geri alınamaz. Emin misiniz?')) {
      return;
    }

    if (!confirm('Son uyarı! Tüm kitaplarınız, okuma kayıtlarınız ve istatistikleriniz silinecek. Devam etmek istiyor musunuz?')) {
      return;
    }

    try {
      // This would need backend implementation to clear all user data
      alert('Bu özellik henüz aktif değil. Veritabanınızı manuel olarak temizleyebilirsiniz.');
    } catch (error) {
      console.error('Veri silme hatası:', error);
      alert('Veriler silinemedi. Lütfen tekrar deneyin.');
    }
  };

  return (
    <>
      <main className="container-mobile pb-24 pt-20">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Ayarlar
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Uygulamayı özelleştirin
          </p>
        </div>

        {/* Appearance */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg mb-6">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            {darkMode ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            Görünüm
          </h3>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900 dark:text-white">Karanlık Mod</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Gözlerinizi koruyun
              </p>
            </div>
            <button
              onClick={toggleDarkMode}
              className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
                darkMode ? 'bg-blue-600' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                  darkMode ? 'translate-x-7' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg mb-6">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Bildirimler
          </h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Günlük Hatırlatıcı</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Okuma zamanı geldiğinde bildirim al
                </p>
              </div>
              <button
                onClick={toggleNotifications}
                className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
                  notificationsEnabled ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                    notificationsEnabled ? 'translate-x-7' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {notificationsEnabled && (
              <div className="animate-fadeIn">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Bildirim Saati
                </label>
                <input
                  type="time"
                  value={notificationTime}
                  onChange={(e) => handleTimeChange(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:border-blue-500 transition-all"
                />
              </div>
            )}
          </div>
        </div>

        {/* Goals */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg mb-6">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Target className="w-5 h-5" />
            Hedefler
          </h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Günlük Sayfa Hedefi
            </label>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="5"
                max="100"
                step="5"
                value={dailyGoal}
                onChange={(e) => handleGoalChange(parseInt(e.target.value))}
                className="flex-1"
              />
              <div className="bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-blue-100 px-4 py-2 rounded-lg font-bold min-w-[80px] text-center">
                {dailyGoal} sayfa
              </div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              Her gün bu kadar sayfa okumayı hedefleyin
            </p>
          </div>
        </div>

        {/* Data Management */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg mb-6">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Download className="w-5 h-5" />
            Veri Yönetimi
          </h3>
          
          <div className="space-y-3">
            <button
              onClick={exportData}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-xl font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
            >
              <Download className="w-5 h-5" />
              Verileri Dışa Aktar (JSON)
            </button>

            <button
              onClick={clearAllData}
              className="w-full bg-red-600 text-white py-3 px-4 rounded-xl font-medium hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
            >
              <Trash2 className="w-5 h-5" />
              Tüm Verileri Sil
            </button>
          </div>
        </div>

        {/* App Info */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
            Uygulama Bilgileri
          </h3>
          <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
            <p>Version: 1.0.0</p>
            <p>© 2024 Reading Chain</p>
            <p className="mt-4">
              Günlük okuma alışkanlığınızı takip edin ve zincirinizi kırmayın! 🔥
            </p>
          </div>
        </div>
      </main>

      <Navigation />
    </>
  );
}

