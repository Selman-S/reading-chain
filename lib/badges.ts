export enum BadgeCategory {
  STREAK = 'streak',
  PAGES = 'pages',
  BOOKS = 'books',
  SPEED = 'speed',
  CONSISTENCY = 'consistency',
  SPECIAL = 'special',
}

export interface BadgeDefinition {
  id: string;
  name: string;
  description: string;
  icon: string; // Emoji
  category: BadgeCategory;
  requirement: number; // Gerekli değer (örn: 7 gün streak, 1000 sayfa)
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  unlockMessage: string;
}

// Tüm badge tanımları
export const BADGE_DEFINITIONS: BadgeDefinition[] = [
  // STREAK BADGES
  {
    id: 'streak_3',
    name: 'İlk Adım',
    description: '3 gün üst üste okuma',
    icon: '🔥',
    category: BadgeCategory.STREAK,
    requirement: 3,
    rarity: 'common',
    unlockMessage: 'Harika! 3 günlük okuma serisi tamamladın!',
  },
  {
    id: 'streak_7',
    name: 'Haftalık Kahraman',
    description: '7 gün üst üste okuma',
    icon: '⚡',
    category: BadgeCategory.STREAK,
    requirement: 7,
    rarity: 'common',
    unlockMessage: 'Muhteşem! Bir hafta boyunca kesintisiz okudun!',
  },
  {
    id: 'streak_30',
    name: 'Aylık Efsane',
    description: '30 gün üst üste okuma',
    icon: '🌟',
    category: BadgeCategory.STREAK,
    requirement: 30,
    rarity: 'rare',
    unlockMessage: 'İnanılmaz! 30 günlük okuma serisi!',
  },
  {
    id: 'streak_100',
    name: 'Yüzün Efendisi',
    description: '100 gün üst üste okuma',
    icon: '💎',
    category: BadgeCategory.STREAK,
    requirement: 100,
    rarity: 'epic',
    unlockMessage: 'Efsanesin! 100 günlük kesintisiz okuma!',
  },
  {
    id: 'streak_365',
    name: 'Yılın Ustası',
    description: '365 gün üst üste okuma',
    icon: '👑',
    category: BadgeCategory.STREAK,
    requirement: 365,
    rarity: 'legendary',
    unlockMessage: 'EFSANE! Tam bir yıl boyunca her gün okudun!',
  },

  // PAGES BADGES
  {
    id: 'pages_100',
    name: 'Yeni Başlangıç',
    description: 'Toplam 100 sayfa okuma',
    icon: '📖',
    category: BadgeCategory.PAGES,
    requirement: 100,
    rarity: 'common',
    unlockMessage: 'İlk 100 sayfanı tamamladın!',
  },
  {
    id: 'pages_500',
    name: 'Okuma Tutkunu',
    description: 'Toplam 500 sayfa okuma',
    icon: '📚',
    category: BadgeCategory.PAGES,
    requirement: 500,
    rarity: 'common',
    unlockMessage: '500 sayfa! Devam ediyorsun!',
  },
  {
    id: 'pages_1000',
    name: 'Bin Sayfa Kulübü',
    description: 'Toplam 1000 sayfa okuma',
    icon: '🎯',
    category: BadgeCategory.PAGES,
    requirement: 1000,
    rarity: 'rare',
    unlockMessage: 'Harika! 1000 sayfa tamamlandı!',
  },
  {
    id: 'pages_5000',
    name: 'Mega Okuyucu',
    description: 'Toplam 5000 sayfa okuma',
    icon: '🚀',
    category: BadgeCategory.PAGES,
    requirement: 5000,
    rarity: 'epic',
    unlockMessage: 'İnanılmaz! 5000 sayfa okudun!',
  },
  {
    id: 'pages_10000',
    name: 'Sayfa Efendisi',
    description: 'Toplam 10000 sayfa okuma',
    icon: '🏆',
    category: BadgeCategory.PAGES,
    requirement: 10000,
    rarity: 'legendary',
    unlockMessage: 'EFSANE! 10.000 sayfa başarısı!',
  },

  // BOOKS BADGES
  {
    id: 'books_1',
    name: 'İlk Kitap',
    description: 'İlk kitabını bitir',
    icon: '📕',
    category: BadgeCategory.BOOKS,
    requirement: 1,
    rarity: 'common',
    unlockMessage: 'Tebrikler! İlk kitabını bitirdin!',
  },
  {
    id: 'books_5',
    name: 'Kitap Kurdu',
    description: '5 kitap tamamla',
    icon: '🐛',
    category: BadgeCategory.BOOKS,
    requirement: 5,
    rarity: 'common',
    unlockMessage: '5 kitap tamamlandı! Harikasın!',
  },
  {
    id: 'books_10',
    name: 'On Kitap Ustası',
    description: '10 kitap tamamla',
    icon: '📗',
    category: BadgeCategory.BOOKS,
    requirement: 10,
    rarity: 'rare',
    unlockMessage: '10 kitap! Sen bir okuma makinesisin!',
  },
  {
    id: 'books_25',
    name: 'Kütüphane Sahibi',
    description: '25 kitap tamamla',
    icon: '🏛️',
    category: BadgeCategory.BOOKS,
    requirement: 25,
    rarity: 'epic',
    unlockMessage: '25 kitap tamamlandı! İnanılmaz!',
  },
  {
    id: 'books_50',
    name: 'Kitap Koleksiyoncusu',
    description: '50 kitap tamamla',
    icon: '🎓',
    category: BadgeCategory.BOOKS,
    requirement: 50,
    rarity: 'legendary',
    unlockMessage: 'EFSANE! 50 kitap başarısı!',
  },

  // SPEED BADGES
  {
    id: 'speed_50_day',
    name: 'Hızlı Okuyucu',
    description: 'Günde 50 sayfa oku',
    icon: '⚡',
    category: BadgeCategory.SPEED,
    requirement: 50,
    rarity: 'common',
    unlockMessage: 'Hızlısın! Günde 50 sayfa!',
  },
  {
    id: 'speed_100_day',
    name: 'Sürat Canavarı',
    description: 'Günde 100 sayfa oku',
    icon: '💨',
    category: BadgeCategory.SPEED,
    requirement: 100,
    rarity: 'rare',
    unlockMessage: 'Vay be! Günde 100 sayfa!',
  },
  {
    id: 'speed_200_day',
    name: 'Flash Okuyucu',
    description: 'Günde 200 sayfa oku',
    icon: '⚡',
    category: BadgeCategory.SPEED,
    requirement: 200,
    rarity: 'epic',
    unlockMessage: 'İnanılmaz hız! Günde 200 sayfa!',
  },

  // CONSISTENCY BADGES
  {
    id: 'weekly_goal_4',
    name: 'Haftalık Disiplin',
    description: '4 hafta boyunca haftada 5 gün oku',
    icon: '📅',
    category: BadgeCategory.CONSISTENCY,
    requirement: 4,
    rarity: 'rare',
    unlockMessage: 'Disiplinlisin! 4 hafta düzenli okuma!',
  },

  // SPECIAL BADGES
  {
    id: 'early_bird',
    name: 'Sabah Kuşu',
    description: 'Sabah 6-8 arasında 10 kez okuma kaydı',
    icon: '🌅',
    category: BadgeCategory.SPECIAL,
    requirement: 10,
    rarity: 'rare',
    unlockMessage: 'Sabah sabah okumak harika! Sabah kuşusun!',
  },
  {
    id: 'night_owl',
    name: 'Gece Baykuşu',
    description: 'Gece 22-24 arasında 10 kez okuma kaydı',
    icon: '🦉',
    category: BadgeCategory.SPECIAL,
    requirement: 10,
    rarity: 'rare',
    unlockMessage: 'Gece okumak senin işin! Gece baykuşusun!',
  },
  {
    id: 'weekend_warrior',
    name: 'Hafta Sonu Savaşçısı',
    description: '10 hafta sonu boyunca oku',
    icon: '🎮',
    category: BadgeCategory.SPECIAL,
    requirement: 10,
    rarity: 'rare',
    unlockMessage: 'Hafta sonları bile okuyorsun! Muhteşem!',
  },

  // MILESTONE BADGES
  {
    id: 'first_friend',
    name: 'İlk Arkadaş',
    description: 'İlk arkadaşını ekle',
    icon: '🤝',
    category: BadgeCategory.SPECIAL,
    requirement: 1,
    rarity: 'common',
    unlockMessage: 'İlk arkadaşını ekledin! Okuma yolculuğunda yalnız değilsin!',
  },
  {
    id: 'social_butterfly',
    name: 'Sosyal Kelebek',
    description: '10 arkadaş edinin',
    icon: '🦋',
    category: BadgeCategory.SPECIAL,
    requirement: 10,
    rarity: 'rare',
    unlockMessage: '10 arkadaş! Gerçek bir okuma topluluğu oluşturdun!',
  },
  {
    id: 'genre_explorer',
    name: 'Tür Kaşifi',
    description: '5 farklı kitap tamamla',
    icon: '🗺️',
    category: BadgeCategory.BOOKS,
    requirement: 5,
    rarity: 'common',
    unlockMessage: 'Farklı kitapları keşfediyorsun! Harika!',
  },
  {
    id: 'speed_reader',
    name: 'Hız Okuyucu',
    description: 'Bir günde 300 sayfa oku',
    icon: '⚡',
    category: BadgeCategory.SPEED,
    requirement: 300,
    rarity: 'epic',
    unlockMessage: 'WOW! Bir günde 300 sayfa! İnanılmaz hız!',
  },
  {
    id: 'marathon_reader',
    name: 'Maraton Okuyucu',
    description: 'Bir günde 500 sayfa oku',
    icon: '🏃',
    category: BadgeCategory.SPEED,
    requirement: 500,
    rarity: 'legendary',
    unlockMessage: 'EFSANE! 500 sayfa bir günde! Sen bir okuma makinessin!',
  },
  {
    id: 'consistent_reader',
    name: 'Düzenli Okuyucu',
    description: '30 gün boyunca her gün en az 10 sayfa oku',
    icon: '📆',
    category: BadgeCategory.CONSISTENCY,
    requirement: 30,
    rarity: 'epic',
    unlockMessage: '30 gün düzenli okuma! Harika bir alışkanlık!',
  },
  {
    id: 'bookworm_legend',
    name: 'Kitap Kurdu Efsanesi',
    description: '100 kitap tamamla',
    icon: '📚',
    category: BadgeCategory.BOOKS,
    requirement: 100,
    rarity: 'legendary',
    unlockMessage: 'EFSANE! 100 kitap! Sen gerçek bir kitap aşığısın!',
  },
  {
    id: 'page_master',
    name: 'Sayfa Ustası',
    description: 'Toplam 50,000 sayfa oku',
    icon: '🎖️',
    category: BadgeCategory.PAGES,
    requirement: 50000,
    rarity: 'legendary',
    unlockMessage: 'İNANILMAZ! 50,000 sayfa! Sen bir okumanın efendisisin!',
  },
  {
    id: 'year_veteran',
    name: 'Yıllık Veteran',
    description: 'Bir yıldır uygulamayı kullan',
    icon: '🎂',
    category: BadgeCategory.SPECIAL,
    requirement: 365,
    rarity: 'epic',
    unlockMessage: 'Bir yıldır birlikteyiz! Teşekkürler! 🎉',
  },
];

// Helper functions
export function getBadgeById(id: string): BadgeDefinition | undefined {
  return BADGE_DEFINITIONS.find(badge => badge.id === id);
}

export function getBadgesByCategory(category: BadgeCategory): BadgeDefinition[] {
  return BADGE_DEFINITIONS.filter(badge => badge.category === category);
}

export function getRarityColor(rarity: string): string {
  switch (rarity) {
    case 'common':
      return 'from-gray-400 to-gray-600';
    case 'rare':
      return 'from-blue-400 to-blue-600';
    case 'epic':
      return 'from-purple-400 to-purple-600';
    case 'legendary':
      return 'from-yellow-400 to-orange-500';
    default:
      return 'from-gray-400 to-gray-600';
  }
}

export function getRarityTextColor(rarity: string): string {
  switch (rarity) {
    case 'common':
      return 'text-gray-600 dark:text-gray-400';
    case 'rare':
      return 'text-blue-600 dark:text-blue-400';
    case 'epic':
      return 'text-purple-600 dark:text-purple-400';
    case 'legendary':
      return 'text-yellow-600 dark:text-yellow-400';
    default:
      return 'text-gray-600 dark:text-gray-400';
  }
}

