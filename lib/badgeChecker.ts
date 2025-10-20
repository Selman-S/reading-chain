import { BADGE_DEFINITIONS, BadgeCategory } from './badges';
import User from '@/models/User';
import UserBadge from '@/models/UserBadge';
import Reading from '@/models/Reading';

interface UnlockedBadge {
  badgeId: string;
  name: string;
  icon: string;
  unlockMessage: string;
  rarity: string;
}

// Ana badge kontrol fonksiyonu - her reading kaydından sonra çağrılır
export async function checkAndUnlockBadges(userId: string): Promise<UnlockedBadge[]> {
  const newlyUnlocked: UnlockedBadge[] = [];

  try {
    // User ve mevcut badge'leri al
    const user = await User.findById(userId);
    if (!user) return newlyUnlocked;

    const existingBadges = await UserBadge.find({ userId }).select('badgeId');
    const existingBadgeIds = new Set(existingBadges.map(b => b.badgeId));

    // Her badge kategorisini kontrol et
    for (const badge of BADGE_DEFINITIONS) {
      // Zaten var mı?
      if (existingBadgeIds.has(badge.id)) continue;

      let shouldUnlock = false;

      switch (badge.category) {
        case BadgeCategory.STREAK:
          shouldUnlock = user.currentStreak >= badge.requirement;
          break;

        case BadgeCategory.PAGES:
          shouldUnlock = user.totalPagesRead >= badge.requirement;
          break;

        case BadgeCategory.BOOKS:
          shouldUnlock = user.totalBooksCompleted >= badge.requirement;
          break;

        case BadgeCategory.SPEED:
          shouldUnlock = await checkSpeedBadge(userId, badge.requirement);
          break;

        case BadgeCategory.CONSISTENCY:
          shouldUnlock = await checkConsistencyBadge(userId, badge.id);
          break;

        case BadgeCategory.SPECIAL:
          shouldUnlock = await checkSpecialBadge(userId, badge.id);
          break;

        default:
          break;
      }

      if (shouldUnlock) {
        // Badge'i unlock et
        await UserBadge.create({
          userId,
          badgeId: badge.id,
          unlockedAt: new Date(),
        });

        newlyUnlocked.push({
          badgeId: badge.id,
          name: badge.name,
          icon: badge.icon,
          unlockMessage: badge.unlockMessage,
          rarity: badge.rarity,
        });
      }
    }
  } catch (error) {
    console.error('Badge check error:', error);
  }

  return newlyUnlocked;
}

// Speed badge kontrolü - günde X sayfa oku
async function checkSpeedBadge(userId: string, requiredPages: number): Promise<boolean> {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todayReadings = await Reading.find({
      userId,
      date: { $gte: today, $lt: tomorrow },
    });

    const totalPages = todayReadings.reduce((sum, reading) => sum + reading.pagesRead, 0);
    return totalPages >= requiredPages;
  } catch (error) {
    console.error('Speed badge check error:', error);
    return false;
  }
}

// Consistency badge kontrolü
async function checkConsistencyBadge(userId: string, badgeId: string): Promise<boolean> {
  try {
    if (badgeId === 'weekly_goal_4') {
      // 4 hafta boyunca haftada 5 gün oku
      const fourWeeksAgo = new Date();
      fourWeeksAgo.setDate(fourWeeksAgo.getDate() - 28);

      const readings = await Reading.find({
        userId,
        date: { $gte: fourWeeksAgo },
      }).sort({ date: 1 });

      // Her hafta için kontrol et
      let consecutiveWeeks = 0;
      for (let week = 0; week < 4; week++) {
        const weekStart = new Date(fourWeeksAgo);
        weekStart.setDate(weekStart.getDate() + (week * 7));
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekEnd.getDate() + 7);

        const weekReadings = readings.filter(r => {
          const date = new Date(r.date);
          return date >= weekStart && date < weekEnd;
        });

        // Unique günler
        const uniqueDays = new Set(
          weekReadings.map(r => new Date(r.date).toDateString())
        );

        if (uniqueDays.size >= 5) {
          consecutiveWeeks++;
        } else {
          break;
        }
      }

      return consecutiveWeeks >= 4;
    }
    return false;
  } catch (error) {
    console.error('Consistency badge check error:', error);
    return false;
  }
}

// Special badge kontrolü
async function checkSpecialBadge(userId: string, badgeId: string): Promise<boolean> {
  try {
    if (badgeId === 'early_bird') {
      // Sabah 6-8 arasında 10 kez okuma
      const readings = await Reading.find({ userId });
      let earlyCount = 0;

      for (const reading of readings) {
        const hour = new Date(reading.createdAt || reading.date).getHours();
        if (hour >= 6 && hour < 8) {
          earlyCount++;
        }
      }

      return earlyCount >= 10;
    }

    if (badgeId === 'night_owl') {
      // Gece 22-24 arasında 10 kez okuma
      const readings = await Reading.find({ userId });
      let nightCount = 0;

      for (const reading of readings) {
        const hour = new Date(reading.createdAt || reading.date).getHours();
        if (hour >= 22 && hour < 24) {
          nightCount++;
        }
      }

      return nightCount >= 10;
    }

    if (badgeId === 'weekend_warrior') {
      // 10 hafta sonu boyunca oku
      const readings = await Reading.find({ userId });
      let weekendCount = 0;
      const weekendDates = new Set<string>();

      for (const reading of readings) {
        const date = new Date(reading.date);
        const day = date.getDay();
        if (day === 0 || day === 6) { // Pazar veya Cumartesi
          const dateStr = date.toDateString();
          if (!weekendDates.has(dateStr)) {
            weekendDates.add(dateStr);
            weekendCount++;
          }
        }
      }

      return weekendCount >= 10;
    }

    return false;
  } catch (error) {
    console.error('Special badge check error:', error);
    return false;
  }
}

// Progress hesaplama - UI'da göstermek için (badge'e ne kadar yakın?)
export async function getBadgeProgress(userId: string): Promise<Record<string, number>> {
  const progress: Record<string, number> = {};

  try {
    const user = await User.findById(userId);
    if (!user) return progress;

    const existingBadges = await UserBadge.find({ userId }).select('badgeId');
    const existingBadgeIds = new Set(existingBadges.map(b => b.badgeId));

    for (const badge of BADGE_DEFINITIONS) {
      if (existingBadgeIds.has(badge.id)) {
        progress[badge.id] = 100; // Already unlocked
        continue;
      }

      let current = 0;

      switch (badge.category) {
        case BadgeCategory.STREAK:
          current = user.currentStreak;
          break;
        case BadgeCategory.PAGES:
          current = user.totalPagesRead;
          break;
        case BadgeCategory.BOOKS:
          current = user.totalBooksCompleted;
          break;
        default:
          current = 0;
          break;
      }

      const percentage = Math.min(100, Math.round((current / badge.requirement) * 100));
      progress[badge.id] = percentage;
    }
  } catch (error) {
    console.error('Badge progress error:', error);
  }

  return progress;
}

