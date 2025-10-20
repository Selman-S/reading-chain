import mongoose, { Schema, Model } from 'mongoose';

export enum FriendStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
  BLOCKED = 'blocked',
}

export interface IFriend {
  _id?: string;
  userId: string; // İsteği gönderen
  friendId: string; // İstek alıcısı
  status: FriendStatus;
  createdAt?: Date;
  updatedAt?: Date;
}

const FriendSchema = new Schema<IFriend>(
  {
    userId: {
      type: String,
      required: [true, 'Kullanıcı ID gereklidir'],
      index: true,
    },
    friendId: {
      type: String,
      required: [true, 'Arkadaş ID gereklidir'],
      index: true,
    },
    status: {
      type: String,
      enum: Object.values(FriendStatus),
      default: FriendStatus.PENDING,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Composite indexes
FriendSchema.index({ userId: 1, friendId: 1 }, { unique: true });
FriendSchema.index({ userId: 1, status: 1 });
FriendSchema.index({ friendId: 1, status: 1 });

const Friend: Model<IFriend> =
  mongoose.models.Friend || mongoose.model<IFriend>('Friend', FriendSchema);

export default Friend;

