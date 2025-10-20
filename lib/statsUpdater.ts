import User from '@/models/User';
import Reading from '@/models/Reading';
import Book from '@/models/Book';

// Reading eklendikten sonra user stats'lerini güncelle
export async function updateUserStats(userId: string): Promise<void> {
  try {
    // Toplam sayfa sayısı
    const readings = await Reading.find({ userId });
    const totalPagesRead = readings.reduce((sum, r) => sum + r.pagesRead, 0);

    // Tamamlanan kitap sayısı
    const completedBooks = await Book.countDocuments({
      userId,
      status: 'completed',
    });

    // Streak hesaplama
    const { currentStreak, longestStreak } = await calculateStreaks(userId);

    // User'ı güncelle
    await User.findByIdAndUpdate(userId, {
      $set: {
        totalPagesRead,
        totalBooksCompleted: completedBooks,
        currentStreak,
        longestStreak,
      },
    });
  } catch (error) {
    console.error('Stats update error:', error);
  }
}

// Streak hesaplama
async function calculateStreaks(userId: string): Promise<{
  currentStreak: number;
  longestStreak: number;
}> {
  try {
    const readings = await Reading.find({ userId }).sort({ date: -1 });
    
    if (readings.length === 0) {
      return { currentStreak: 0, longestStreak: 0 };
    }

    // Unique günleri al
    const uniqueDates = Array.from(
      new Set(readings.map(r => new Date(r.date).toDateString()))
    ).map(dateStr => new Date(dateStr));

    uniqueDates.sort((a, b) => b.getTime() - a.getTime());

    // Current streak hesapla
    let currentStreak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    // Bugün veya dün okuma var mı?
    const lastReadDate = uniqueDates[0];
    if (
      lastReadDate.toDateString() === today.toDateString() ||
      lastReadDate.toDateString() === yesterday.toDateString()
    ) {
      currentStreak = 1;
      let prevDate = lastReadDate;

      for (let i = 1; i < uniqueDates.length; i++) {
        const currentDate = uniqueDates[i];
        const diffDays = Math.floor(
          (prevDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24)
        );

        if (diffDays === 1) {
          currentStreak++;
          prevDate = currentDate;
        } else {
          break;
        }
      }
    }

    // Longest streak hesapla
    let longestStreak = 0;
    let tempStreak = 1;

    for (let i = 1; i < uniqueDates.length; i++) {
      const prevDate = uniqueDates[i - 1];
      const currentDate = uniqueDates[i];
      const diffDays = Math.floor(
        (prevDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24)
      );

      if (diffDays === 1) {
        tempStreak++;
      } else {
        longestStreak = Math.max(longestStreak, tempStreak);
        tempStreak = 1;
      }
    }
    longestStreak = Math.max(longestStreak, tempStreak, currentStreak);

    return { currentStreak, longestStreak };
  } catch (error) {
    console.error('Streak calculation error:', error);
    return { currentStreak: 0, longestStreak: 0 };
  }
}

