import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import dbConnect from '@/lib/mongodb';
import Friend, { FriendStatus } from '@/models/Friend';
import Reading from '@/models/Reading';
import User from '@/models/User';
import Book from '@/models/Book';

// GET - Arkadaşların son aktiviteleri
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
    const limit = parseInt(searchParams.get('limit') || '20');

    // Arkadaşları al
    const friendships = await Friend.find({
      $or: [
        { userId: session.user.id, status: FriendStatus.ACCEPTED },
        { friendId: session.user.id, status: FriendStatus.ACCEPTED },
      ],
    });

    const friendIds = friendships.map(f =>
      f.userId === session.user.id ? f.friendId : f.userId
    );

    if (friendIds.length === 0) {
      return NextResponse.json({
        success: true,
        data: [],
        count: 0,
      });
    }

    // Son 7 günün okuma kayıtları
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const readings = await Reading.find({
      userId: { $in: friendIds },
      date: { $gte: sevenDaysAgo },
    })
      .sort({ date: -1, createdAt: -1 })
      .limit(limit);

    // User ve Book bilgilerini al
    const userIds = [...new Set(readings.map(r => r.userId))];
    const bookIds = [...new Set(readings.map(r => r.bookId))];

    const users = await User.find({ _id: { $in: userIds } }).select(
      'username avatar'
    );
    const books = await Book.find({ _id: { $in: bookIds } }).select(
      'title author'
    );

    // Aktiviteleri birleştir
    const activities = readings.map(reading => {
      const user = users.find(u => u._id.toString() === reading.userId);
      const book = books.find(b => b._id.toString() === reading.bookId);

      return {
        _id: reading._id,
        user: {
          _id: user?._id,
          username: user?.username,
          avatar: user?.avatar,
        },
        book: {
          _id: book?._id,
          title: book?.title,
          author: book?.author,
        },
        pagesRead: reading.pagesRead,
        date: reading.date,
        createdAt: reading.createdAt,
      };
    });

    return NextResponse.json({
      success: true,
      data: activities,
      count: activities.length,
    });
  } catch (error: any) {
    console.error('Friend activity GET error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

