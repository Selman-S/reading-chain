'use client';

import { useEffect } from 'react';

export default function RegisterServiceWorker() {
  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      // Eski SW'leri temizle
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        for (let registration of registrations) {
          registration.unregister();
        }
        // Yeni SW'yi kaydet (temizlikten sonra)
        setTimeout(() => {
          navigator.serviceWorker
            .register('/sw.js')
            .then((registration) => {
              console.log('✅ Service Worker registered (v2):', registration);
            })
            .catch((error) => {
              console.log('❌ Service Worker registration failed:', error);
            });
        }, 100);
      });
    }
  }, []);

  return null;
}

