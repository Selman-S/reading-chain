import mongoose, { Schema, Model } from 'mongoose';

export interface IUserBadge {
  _id?: string;
  userId: string;
  badgeId: string; // Badge tanımındaki id (örn: 'streak_7')
  unlockedAt: Date;
  progress?: number; // Opsiyonel: Badge'e ne kadar yakın (örn: 5/7 gün)
  createdAt?: Date;
  updatedAt?: Date;
}

const UserBadgeSchema = new Schema<IUserBadge>(
  {
    userId: {
      type: String,
      required: [true, 'Kullanıcı ID gereklidir'],
      index: true,
    },
    badgeId: {
      type: String,
      required: [true, 'Badge ID gereklidir'],
      index: true,
    },
    unlockedAt: {
      type: Date,
      default: Date.now,
    },
    progress: {
      type: Number,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

// Composite index - bir kullanıcı aynı badge'i sadece bir kez alabilir
UserBadgeSchema.index({ userId: 1, badgeId: 1 }, { unique: true });

const UserBadge: Model<IUserBadge> =
  mongoose.models.UserBadge || mongoose.model<IUserBadge>('UserBadge', UserBadgeSchema);

export default UserBadge;

