'use client';

import { motion } from 'framer-motion';
import { Lock } from 'lucide-react';
import { getRarityColor, getRarityTextColor } from '@/lib/badges';

interface BadgeCardProps {
  badge: {
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
  };
  index: number;
}

export default function BadgeCard({ badge, index }: BadgeCardProps) {
  const isUnlocked = badge.unlocked;
  const progress = badge.progress;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className={`
        relative bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-lg
        border-2 transition-all duration-300
        ${
          isUnlocked
            ? 'border-transparent hover:scale-105 hover:shadow-xl'
            : 'border-gray-300 dark:border-gray-700 opacity-60'
        }
      `}
    >
      {/* Rarity Gradient Border (unlocked only) */}
      {isUnlocked && (
        <div
          className={`
            absolute inset-0 rounded-2xl opacity-50
            bg-gradient-to-br ${getRarityColor(badge.rarity)}
            -z-10 blur-sm
          `}
        />
      )}

      {/* Badge Content */}
      <div className="text-center">
        {/* Icon */}
        <div className="relative inline-block mb-3">
          <div
            className={`
              text-5xl
              ${!isUnlocked && 'filter grayscale opacity-40'}
            `}
          >
            {badge.icon}
          </div>
          {!isUnlocked && (
            <div className="absolute inset-0 flex items-center justify-center">
              <Lock className="w-8 h-8 text-gray-500 dark:text-gray-400" />
            </div>
          )}
        </div>

        {/* Name & Rarity */}
        <h3
          className={`
            font-bold text-lg mb-1
            ${isUnlocked ? getRarityTextColor(badge.rarity) : 'text-gray-600 dark:text-gray-400'}
          `}
        >
          {badge.name}
        </h3>

        {/* Description */}
        <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">
          {badge.description}
        </p>

        {/* Progress Bar (if not unlocked) */}
        {!isUnlocked && progress > 0 && (
          <div className="mt-3">
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                className={`h-full bg-gradient-to-r ${getRarityColor(badge.rarity)}`}
              />
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
              %{progress}
            </p>
          </div>
        )}

        {/* Unlocked Date */}
        {isUnlocked && badge.unlockedAt && (
          <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
            🎉 {new Date(badge.unlockedAt).toLocaleDateString('tr-TR')}
          </p>
        )}

        {/* Rarity Badge */}
        <div className="mt-2">
          <span
            className={`
              inline-block px-2 py-1 rounded-full text-xs font-semibold
              ${isUnlocked ? getRarityTextColor(badge.rarity) : 'text-gray-500 dark:text-gray-500'}
              bg-gray-100 dark:bg-gray-700
            `}
          >
            {badge.rarity === 'common' && '⚪ Common'}
            {badge.rarity === 'rare' && '🔵 Rare'}
            {badge.rarity === 'epic' && '🟣 Epic'}
            {badge.rarity === 'legendary' && '🟡 Legendary'}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

