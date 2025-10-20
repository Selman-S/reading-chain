import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import dbConnect from '@/lib/mongodb';
import Friend, { FriendStatus } from '@/models/Friend';
import User from '@/models/User';

// GET - Arkadaş listesi ve bekleyen istekler
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
    const type = searchParams.get('type') || 'friends'; // friends | pending | sent

    if (type === 'friends') {
      // Kabul edilmiş arkadaşlar
      const friendships = await Friend.find({
        $or: [
          { userId: session.user.id, status: FriendStatus.ACCEPTED },
          { friendId: session.user.id, status: FriendStatus.ACCEPTED },
        ],
      });

      const friendIds = friendships.map(f =>
        f.userId === session.user.id ? f.friendId : f.userId
      );

      const friends = await User.find({ _id: { $in: friendIds } }).select(
        'username avatar totalPagesRead totalBooksCompleted currentStreak createdAt'
      );

      return NextResponse.json({
        success: true,
        data: friends,
        count: friends.length,
      });
    } else if (type === 'pending') {
      // Gelen istekler (bana gönderilmiş)
      const pendingRequests = await Friend.find({
        friendId: session.user.id,
        status: FriendStatus.PENDING,
      });

      const userIds = pendingRequests.map(f => f.userId);
      const users = await User.find({ _id: { $in: userIds } }).select(
        'username avatar createdAt'
      );

      const requestsWithUserInfo = pendingRequests.map(request => {
        const user = users.find(u => u._id.toString() === request.userId);
        return {
          _id: request._id,
          user,
          createdAt: request.createdAt,
        };
      });

      return NextResponse.json({
        success: true,
        data: requestsWithUserInfo,
        count: requestsWithUserInfo.length,
      });
    } else if (type === 'sent') {
      // Gönderilen istekler (benim gönderdiğim)
      const sentRequests = await Friend.find({
        userId: session.user.id,
        status: FriendStatus.PENDING,
      });

      const friendIds = sentRequests.map(f => f.friendId);
      const users = await User.find({ _id: { $in: friendIds } }).select(
        'username avatar createdAt'
      );

      const requestsWithUserInfo = sentRequests.map(request => {
        const user = users.find(u => u._id.toString() === request.friendId);
        return {
          _id: request._id,
          user,
          createdAt: request.createdAt,
        };
      });

      return NextResponse.json({
        success: true,
        data: requestsWithUserInfo,
        count: requestsWithUserInfo.length,
      });
    }

    return NextResponse.json(
      { success: false, error: 'Invalid type parameter' },
      { status: 400 }
    );
  } catch (error: any) {
    console.error('Friends GET error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Arkadaşlık isteği gönder
export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await dbConnect();

    const body = await req.json();
    const { friendId } = body;

    if (!friendId) {
      return NextResponse.json(
        { success: false, error: 'Friend ID gereklidir' },
        { status: 400 }
      );
    }

    // Kendine istek gönderemez
    if (friendId === session.user.id) {
      return NextResponse.json(
        { success: false, error: 'Kendine arkadaşlık isteği gönderemezsin' },
        { status: 400 }
      );
    }

    // Kullanıcı var mı?
    const targetUser = await User.findById(friendId);
    if (!targetUser) {
      return NextResponse.json(
        { success: false, error: 'Kullanıcı bulunamadı' },
        { status: 404 }
      );
    }

    // Zaten arkadaş mı?
    const existingFriendship = await Friend.findOne({
      $or: [
        { userId: session.user.id, friendId, status: FriendStatus.ACCEPTED },
        { userId: friendId, friendId: session.user.id, status: FriendStatus.ACCEPTED },
      ],
    });

    if (existingFriendship) {
      return NextResponse.json(
        { success: false, error: 'Zaten arkadaşsınız' },
        { status: 400 }
      );
    }

    // Pending istek var mı?
    const existingRequest = await Friend.findOne({
      $or: [
        { userId: session.user.id, friendId, status: FriendStatus.PENDING },
        { userId: friendId, friendId: session.user.id, status: FriendStatus.PENDING },
      ],
    });

    if (existingRequest) {
      return NextResponse.json(
        { success: false, error: 'Zaten bekleyen bir istek var' },
        { status: 400 }
      );
    }

    // Yeni istek oluştur
    const friendRequest = await Friend.create({
      userId: session.user.id,
      friendId,
      status: FriendStatus.PENDING,
    });

    return NextResponse.json(
      {
        success: true,
        data: friendRequest,
        message: 'Arkadaşlık isteği gönderildi',
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Friend request POST error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

