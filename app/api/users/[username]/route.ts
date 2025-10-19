import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

// GET - Başka kullanıcının profilini görüntüle
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  try {
    const { username } = await params;
    const session = await auth();
    
    await dbConnect();

    const user = await User.findOne({ username }).select('-password -email');
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    // Privacy check - profil kapalıysa sadece kendi profiline erişebilir
    if (!user.profilePublic && session?.user?.id !== user._id.toString()) {
      return NextResponse.json(
        { success: false, error: 'This profile is private' },
        { status: 403 }
      );
    }

    // Stats privacy - sadece arkadaşlar görebilir (şimdilik herkese açık)
    // TODO: Friend ilişkisi kontrolü eklenecek
    const isOwner = session?.user?.id === user._id.toString();
    const isFriend = false; // TODO: Friend kontrolü

    const publicData: any = {
      _id: user._id,
      username: user.username,
      avatar: user.avatar,
      bio: user.bio,
      profilePublic: user.profilePublic,
      createdAt: user.createdAt,
    };

    // Stats sadece owner, arkadaşlar veya showStatsToFriends=true ise göster
    if (isOwner || isFriend || !user.showStatsToFriends) {
      publicData.totalPagesRead = user.totalPagesRead;
      publicData.totalBooksCompleted = user.totalBooksCompleted;
      publicData.currentStreak = user.currentStreak;
      publicData.longestStreak = user.longestStreak;
    }

    return NextResponse.json({
      success: true,
      data: publicData,
      isOwner,
      isFriend,
    });
  } catch (error: any) {
    console.error('User profile GET error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

