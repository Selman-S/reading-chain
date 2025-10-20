import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import dbConnect from '@/lib/mongodb';
import Friend, { FriendStatus } from '@/models/Friend';
import { checkAndUnlockBadges } from '@/lib/badgeChecker';

// PUT - İsteği kabul et veya reddet
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await dbConnect();

    const body = await req.json();
    const { action } = body; // 'accept' | 'reject'

    if (!action || !['accept', 'reject'].includes(action)) {
      return NextResponse.json(
        { success: false, error: 'Invalid action' },
        { status: 400 }
      );
    }

    // İsteği bul
    const friendRequest = await Friend.findById(id);
    if (!friendRequest) {
      return NextResponse.json(
        { success: false, error: 'İstek bulunamadı' },
        { status: 404 }
      );
    }

    // Yetki kontrolü - sadece istek alıcısı kabul/red edebilir
    if (friendRequest.friendId !== session.user.id) {
      return NextResponse.json(
        { success: false, error: 'Bu işlem için yetkiniz yok' },
        { status: 403 }
      );
    }

    // Status kontrolü
    if (friendRequest.status !== FriendStatus.PENDING) {
      return NextResponse.json(
        { success: false, error: 'Bu istek zaten işlenmiş' },
        { status: 400 }
      );
    }

    // Güncelle
    if (action === 'accept') {
      friendRequest.status = FriendStatus.ACCEPTED;
      await friendRequest.save();

      // Badge kontrolü (her iki taraf için)
      const newBadges1 = await checkAndUnlockBadges(session.user.id);
      const newBadges2 = await checkAndUnlockBadges(friendRequest.userId);

      return NextResponse.json({
        success: true,
        data: friendRequest,
        message: 'Arkadaşlık isteği kabul edildi',
        newBadges: newBadges1.length > 0 ? newBadges1 : undefined,
      });
    } else {
      friendRequest.status = FriendStatus.REJECTED;
      await friendRequest.save();

      return NextResponse.json({
        success: true,
        data: friendRequest,
        message: 'Arkadaşlık isteği reddedildi',
      });
    }
  } catch (error: any) {
    console.error('Friend request PUT error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE - Arkadaşlıktan çıkar veya isteği iptal et
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await dbConnect();

    // İsteği bul
    const friendRequest = await Friend.findById(id);
    if (!friendRequest) {
      return NextResponse.json(
        { success: false, error: 'İstek bulunamadı' },
        { status: 404 }
      );
    }

    // Yetki kontrolü - sadece taraflardan biri silebilir
    if (
      friendRequest.userId !== session.user.id &&
      friendRequest.friendId !== session.user.id
    ) {
      return NextResponse.json(
        { success: false, error: 'Bu işlem için yetkiniz yok' },
        { status: 403 }
      );
    }

    await Friend.findByIdAndDelete(id);

    return NextResponse.json({
      success: true,
      message: 'Arkadaşlık silindi',
    });
  } catch (error: any) {
    console.error('Friend DELETE error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

