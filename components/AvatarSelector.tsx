'use client';

import { AVATARS, Avatar } from '@/lib/avatars';
import { motion } from 'framer-motion';

interface AvatarSelectorProps {
  currentAvatar: string;
  onSelect: (avatar: Avatar) => void;
  size?: 'sm' | 'md' | 'lg';
}

export default function AvatarSelector({
  currentAvatar,
  onSelect,
  size = 'md',
}: AvatarSelectorProps) {
  const sizeClasses = {
    sm: 'text-3xl w-12 h-12',
    md: 'text-4xl w-16 h-16',
    lg: 'text-5xl w-20 h-20',
  };

  return (
    <div className="grid grid-cols-4 gap-3">
      {AVATARS.map((avatar) => (
        <motion.button
          key={avatar}
          onClick={() => onSelect(avatar)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className={`
            ${sizeClasses[size]}
            rounded-2xl
            flex items-center justify-center
            transition-all duration-200
            ${
              currentAvatar === avatar
                ? 'bg-gradient-to-br from-orange-500 to-red-500 shadow-lg ring-4 ring-orange-200 dark:ring-orange-800'
                : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
            }
          `}
          aria-label={`Avatar ${avatar}`}
        >
          {avatar}
        </motion.button>
      ))}
    </div>
  );
}

