import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import Reading from '@/models/Reading';
import Friend, { FriendStatus } from '@/models/Friend';

// GET - Leaderboard (günlük, haftalık, aylık)
export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await dbConnect();

    const { searchParams } = new URL(req.url);
    const period = searchParams.get('period') || 'weekly'; // daily | weekly | monthly
    const scope = searchParams.get('scope') || 'friends'; // friends | global

    // Tarih aralığını hesapla
    const now = new Date();
    let startDate = new Date();

    if (period === 'daily') {
      startDate.setHours(0, 0, 0, 0);
    } else if (period === 'weekly') {
      startDate.setDate(now.getDate() - 7);
    } else if (period === 'monthly') {
      startDate.setMonth(now.getMonth() - 1);
    }

    // Scope'a göre kullanıcı listesini belirle
    let targetUserIds: string[] = [];

    if (scope === 'friends') {
      // Arkadaşları al
      const friendships = await Friend.find({
        $or: [
          { userId: session.user.id, status: FriendStatus.ACCEPTED },
          { friendId: session.user.id, status: FriendStatus.ACCEPTED },
        ],
      });

      targetUserIds = friendships.map(f =>
        f.userId === session.user.id ? f.friendId : f.userId
      );

      // Kendini de ekle
      targetUserIds.push(session.user.id);
    } else {
      // Global - tüm kullanıcılar (limit 100)
      const allUsers = await User.find({}).select('_id').limit(100);
      targetUserIds = allUsers.map(u => u._id.toString());
    }

    // Readings'leri al ve kullanıcıya göre topla
    const readings = await Reading.find({
      userId: { $in: targetUserIds },
      date: { $gte: startDate },
    });

    // Kullanıcı bazında toplam sayfa sayısı
    const userPageCounts: Record<string, number> = {};
    for (const reading of readings) {
      const userId = reading.userId;
      if (!userPageCounts[userId]) {
        userPageCounts[userId] = 0;
      }
      userPageCounts[userId] += reading.pagesRead;
    }

    // Kullanıcı bilgilerini al
    const users = await User.find({
      _id: { $in: Object.keys(userPageCounts) },
    }).select('username avatar currentStreak totalPagesRead');

    // Leaderboard oluştur
    const leaderboard = users
      .map(user => ({
        _id: user._id,
        username: user.username,
        avatar: user.avatar,
        currentStreak: user.currentStreak,
        totalPagesRead: user.totalPagesRead,
        periodPages: userPageCounts[user._id.toString()] || 0,
        isCurrentUser: user._id.toString() === session.user.id,
      }))
      .sort((a, b) => b.periodPages - a.periodPages);

    // Sıralama numarası ekle
    const leaderboardWithRank = leaderboard.map((entry, index) => ({
      ...entry,
      rank: index + 1,
    }));

    // Kullanıcının kendi sıralamasını bul
    const currentUserEntry = leaderboardWithRank.find(
      entry => entry._id.toString() === session.user.id
    );

    return NextResponse.json({
      success: true,
      data: leaderboardWithRank,
      currentUser: currentUserEntry || null,
      period,
      scope,
      count: leaderboardWithRank.length,
    });
  } catch (error: any) {
    console.error('Leaderboard GET error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

