import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import dbConnect from '@/lib/mongodb';
import Reading from '@/models/Reading';
import Book from '@/models/Book';

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await dbConnect();
    
    const searchParams = request.nextUrl.searchParams;
    const period = searchParams.get('period') || 'all';
    
    // Tarih aralığını hesapla
    const now = new Date();
    let startDate = new Date(0);
    
    switch (period) {
      case 'week':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'month':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case 'year':
        startDate = new Date(now.getFullYear(), 0, 1);
        break;
    }
    
    // Okuma kayıtlarını getir (user bazlı)
    const readings = await Reading.find({
      userId: session.user.id,
      date: { $gte: startDate }
    }).sort({ date: 1 });
    
    // Kitap istatistikleri (user bazlı)
    const totalBooks = await Book.countDocuments({ userId: session.user.id });
    const completedBooks = await Book.countDocuments({ userId: session.user.id, status: 'completed' });
    const activeBooks = await Book.countDocuments({ userId: session.user.id, status: 'active' });
    
    // Toplam okunan sayfa
    const totalPagesRead = readings.reduce((sum, r) => sum + r.pagesRead, 0);
    
    // Günlük ortalama
    const uniqueDays = new Set(
      readings.map(r => r.date.toISOString().split('T')[0])
    ).size;
    const averagePerDay = uniqueDays > 0 ? Math.round(totalPagesRead / uniqueDays) : 0;
    
    // Streak hesaplama
    const streakData = calculateStreak(readings);
    
    // Günlük okuma verileri (grafik için)
    const dailyData = getDailyReadingData(readings);
    
    // Aylık ısı haritası verileri
    const heatmapData = getHeatmapData(readings);
    
    return NextResponse.json({
      success: true,
      data: {
        totalBooks,
        completedBooks,
        activeBooks,
        totalPagesRead,
        averagePerDay,
        streak: streakData,
        dailyData,
        heatmapData,
        readingCount: readings.length,
      }
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }
}

// Streak hesaplama fonksiyonu
function calculateStreak(readings: any[]) {
  if (readings.length === 0) {
    return { current: 0, longest: 0, lastReadDate: null };
  }
  
  const readingDates = new Set(
    readings.map(r => new Date(r.date).toISOString().split('T')[0])
  );
  
  const sortedDates = Array.from(readingDates).sort();
  
  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 1;
  
  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  
  const lastDate = sortedDates[sortedDates.length - 1];
  if (lastDate === today || lastDate === yesterday) {
    currentStreak = 1;
    
    for (let i = sortedDates.length - 2; i >= 0; i--) {
      const current = new Date(sortedDates[i]);
      const next = new Date(sortedDates[i + 1]);
      const diffDays = Math.round((next.getTime() - current.getTime()) / (1000 * 60 * 60 * 24));
      
      if (diffDays === 1) {
        currentStreak++;
      } else {
        break;
      }
    }
  }
  
  for (let i = 1; i < sortedDates.length; i++) {
    const current = new Date(sortedDates[i]);
    const prev = new Date(sortedDates[i - 1]);
    const diffDays = Math.round((current.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) {
      tempStreak++;
    } else {
      longestStreak = Math.max(longestStreak, tempStreak);
      tempStreak = 1;
    }
  }
  longestStreak = Math.max(longestStreak, tempStreak, currentStreak);
  
  return {
    current: currentStreak,
    longest: longestStreak,
    lastReadDate: sortedDates[sortedDates.length - 1],
  };
}

function getDailyReadingData(readings: any[]) {
  const dailyMap = new Map<string, number>();
  
  readings.forEach(reading => {
    const date = new Date(reading.date).toISOString().split('T')[0];
    dailyMap.set(date, (dailyMap.get(date) || 0) + reading.pagesRead);
  });
  
  return Array.from(dailyMap.entries())
    .map(([date, pages]) => ({ date, pages }))
    .sort((a, b) => a.date.localeCompare(b.date));
}

function getHeatmapData(readings: any[]) {
  const heatmap = new Map<string, number>();
  
  readings.forEach(reading => {
    const date = new Date(reading.date).toISOString().split('T')[0];
    heatmap.set(date, (heatmap.get(date) || 0) + reading.pagesRead);
  });
  
  return Array.from(heatmap.entries()).map(([date, count]) => ({
    date,
    count,
    level: count > 100 ? 4 : count > 50 ? 3 : count > 20 ? 2 : count > 0 ? 1 : 0,
  }));
}
