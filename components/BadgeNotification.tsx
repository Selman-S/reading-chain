'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { getRarityColor } from '@/lib/badges';

interface BadgeNotificationProps {
  badge: {
    name: string;
    icon: string;
    unlockMessage: string;
    rarity: string;
  } | null;
  onClose: () => void;
}

export default function BadgeNotification({ badge, onClose }: BadgeNotificationProps) {
  if (!badge) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -100, scale: 0.8 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -100, scale: 0.8 }}
        className="fixed top-20 left-1/2 -translate-x-1/2 z-[100] max-w-sm w-full px-4"
      >
        <div
          className={`
            bg-gradient-to-br ${getRarityColor(badge.rarity)}
            text-white rounded-2xl p-6 shadow-2xl
            border-4 border-white/30
          `}
        >
          <button
            onClick={onClose}
            className="absolute top-2 right-2 bg-white/20 hover:bg-white/30 rounded-full p-1 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="text-center">
            <div className="text-6xl mb-3">{badge.icon}</div>
            <h3 className="text-xl font-bold mb-2">🎉 Yeni Rozet!</h3>
            <p className="text-2xl font-bold mb-2">{badge.name}</p>
            <p className="text-sm opacity-90">{badge.unlockMessage}</p>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

