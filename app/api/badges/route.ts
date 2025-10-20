import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import dbConnect from '@/lib/mongodb';
import UserBadge from '@/models/UserBadge';
import { BADGE_DEFINITIONS, getBadgeById } from '@/lib/badges';
import { getBadgeProgress } from '@/lib/badgeChecker';

// GET - Kullanıcının kazandığı badge'leri al
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

    // URL parametresi kontrol et - tüm badge'ler mi sadece kazanılanlar mı?
    const { searchParams } = new URL(req.url);
    const includeAll = searchParams.get('all') === 'true';

    if (includeAll) {
      // Tüm badge tanımları + kullanıcının progress'i
      const userBadges = await UserBadge.find({ userId: session.user.id });
      const unlockedBadgeIds = new Set(userBadges.map(b => b.badgeId));
      const progress = await getBadgeProgress(session.user.id);

      const allBadges = BADGE_DEFINITIONS.map(badge => ({
        ...badge,
        unlocked: unlockedBadgeIds.has(badge.id),
        unlockedAt: userBadges.find(b => b.badgeId === badge.id)?.unlockedAt || null,
        progress: progress[badge.id] || 0,
      }));

      return NextResponse.json({
        success: true,
        data: allBadges,
        stats: {
          total: BADGE_DEFINITIONS.length,
          unlocked: unlockedBadgeIds.size,
          percentage: Math.round((unlockedBadgeIds.size / BADGE_DEFINITIONS.length) * 100),
        },
      });
    } else {
      // Sadece kazanılan badge'ler
      const userBadges = await UserBadge.find({ userId: session.user.id }).sort({
        unlockedAt: -1,
      });

      const badgesWithDetails = userBadges.map(userBadge => {
        const badgeDefinition = getBadgeById(userBadge.badgeId);
        return {
          ...userBadge.toObject(),
          ...badgeDefinition,
        };
      });

      return NextResponse.json({
        success: true,
        data: badgesWithDetails,
        count: badgesWithDetails.length,
      });
    }
  } catch (error: any) {
    console.error('Badges GET error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

