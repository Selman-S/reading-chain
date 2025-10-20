import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import Friend, { FriendStatus } from '@/models/Friend';

// GET - Kullanıcı ara (username)
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
    const query = searchParams.get('q');

    if (!query || query.trim().length < 2) {
      return NextResponse.json(
        { success: false, error: 'En az 2 karakter girmelisiniz' },
        { status: 400 }
      );
    }

    // Kullanıcıları ara (case-insensitive)
    const users = await User.find({
      username: { $regex: query, $options: 'i' },
      _id: { $ne: session.user.id }, // Kendini hariç tut
    })
      .select('username avatar totalPagesRead currentStreak createdAt')
      .limit(20);

    // Her kullanıcı için arkadaşlık durumunu kontrol et
    const userIds = users.map(u => u._id.toString());
    const friendships = await Friend.find({
      $or: [
        { userId: session.user.id, friendId: { $in: userIds } },
        { userId: { $in: userIds }, friendId: session.user.id },
      ],
    });

    const usersWithFriendshipStatus = users.map(user => {
      const userId = user._id.toString();
      const friendship = friendships.find(
        f =>
          (f.userId === session.user.id && f.friendId === userId) ||
          (f.friendId === session.user.id && f.userId === userId)
      );

      let friendshipStatus = 'none';
      if (friendship) {
        if (friendship.status === FriendStatus.ACCEPTED) {
          friendshipStatus = 'friends';
        } else if (friendship.status === FriendStatus.PENDING) {
          if (friendship.userId === session.user.id) {
            friendshipStatus = 'pending_sent';
          } else {
            friendshipStatus = 'pending_received';
          }
        }
      }

      return {
        ...user.toObject(),
        friendshipStatus,
        friendshipId: friendship?._id || null,
      };
    });

    return NextResponse.json({
      success: true,
      data: usersWithFriendshipStatus,
      count: usersWithFriendshipStatus.length,
    });
  } catch (error: any) {
    console.error('User search error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

