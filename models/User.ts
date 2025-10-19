import mongoose, { Schema, Model } from 'mongoose';

export interface IUser {
  _id?: string;
  username: string;
  email: string;
  password: string;
  avatar: string; // Emoji avatar
  bio?: string;
  // Cached stats (güncelleme için background job veya reading sonrası)
  totalPagesRead: number;
  totalBooksCompleted: number;
  currentStreak: number;
  longestStreak: number;
  // Privacy settings
  profilePublic: boolean; // Profil herkese açık mı?
  showStatsToFriends: boolean; // İstatistikler sadece arkadaşlara
  createdAt?: Date;
  updatedAt?: Date;
}

const UserSchema = new Schema<IUser>(
  {
    username: {
      type: String,
      required: [true, 'Kullanıcı adı gereklidir'],
      unique: true,
      trim: true,
      minlength: [3, 'Kullanıcı adı en az 3 karakter olmalıdır'],
      maxlength: [30, 'Kullanıcı adı en fazla 30 karakter olabilir'],
    },
    email: {
      type: String,
      required: [true, 'E-posta gereklidir'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Geçerli bir e-posta adresi giriniz',
      ],
    },
    password: {
      type: String,
      required: [true, 'Şifre gereklidir'],
      minlength: [6, 'Şifre en az 6 karakter olmalıdır'],
    },
    avatar: {
      type: String,
      default: '😊',
      required: false,
    },
    bio: {
      type: String,
      maxlength: [200, 'Bio en fazla 200 karakter olabilir'],
      required: false,
    },
    totalPagesRead: {
      type: Number,
      default: 0,
    },
    totalBooksCompleted: {
      type: Number,
      default: 0,
    },
    currentStreak: {
      type: Number,
      default: 0,
    },
    longestStreak: {
      type: Number,
      default: 0,
    },
    profilePublic: {
      type: Boolean,
      default: true,
    },
    showStatsToFriends: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// unique: true zaten index oluşturur, bu yüzden tekrar tanımlamaya gerek yok

const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;

