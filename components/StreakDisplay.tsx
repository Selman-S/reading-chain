'use client';

import { Flame } from 'lucide-react';
import { motion } from 'framer-motion';

interface StreakDisplayProps {
  current: number;
  longest: number;
  size?: 'sm' | 'md' | 'lg';
}

export default function StreakDisplay({ current, longest, size = 'md' }: StreakDisplayProps) {
  const sizes = {
    sm: { icon: 'w-8 h-8', text: 'text-2xl', label: 'text-xs' },
    md: { icon: 'w-12 h-12', text: 'text-4xl', label: 'text-sm' },
    lg: { icon: 'w-16 h-16', text: 'text-6xl', label: 'text-base' },
  };
  
  const isOnFire = current > 0;
  
  return (
    <div className="flex flex-col items-center">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 10 }}
        className={`relative ${isOnFire ? 'animate-pulse-glow' : ''}`}
      >
        <div className={`rounded-full bg-gradient-to-br ${
          isOnFire 
            ? 'from-orange-400 to-red-500' 
            : 'from-gray-300 to-gray-400'
        } p-4 shadow-xl`}>
          <Flame className={`${sizes[size].icon} text-white`} />
        </div>
        
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2 }}
          className="absolute -bottom-2 -right-2 bg-white dark:bg-gray-800 rounded-full px-3 py-1 shadow-lg border-2 border-blue-500"
        >
          <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
            {current}
          </span>
        </motion.div>
      </motion.div>
      
      <div className="mt-4 text-center">
        <p className={`${sizes[size].text} font-bold text-gray-900 dark:text-white`}>
          {current} Gün
        </p>
        <p className={`${sizes[size].label} text-gray-600 dark:text-gray-400 mt-1`}>
          Mevcut Zincir
        </p>
        
        {longest > 0 && (
          <div className="mt-2 flex items-center gap-2 justify-center">
            <span className="text-xs text-gray-500 dark:text-gray-400">
              En uzun: {longest} gün 🏆
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

