'use client';

import { getAvatarEmoji } from '@/lib/avatars';

interface AvatarProps {
  avatar?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export default function Avatar({ avatar, size = 'md', className = '' }: AvatarProps) {
  const sizeClasses = {
    xs: 'w-8 h-8 text-xl',
    sm: 'w-10 h-10 text-2xl',
    md: 'w-12 h-12 text-3xl',
    lg: 'w-16 h-16 text-4xl',
    xl: 'w-24 h-24 text-6xl',
  };

  return (
    <div
      className={`
        ${sizeClasses[size]}
        rounded-full
        bg-gradient-to-br from-orange-100 to-red-100
        dark:from-orange-900 dark:to-red-900
        flex items-center justify-center
        shadow-md
        ${className}
      `}
    >
      {getAvatarEmoji(avatar)}
    </div>
  );
}

