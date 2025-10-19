import mongoose, { Schema, Model } from 'mongoose';

export interface IBook {
  _id?: string;
  userId: string;
  title: string;
  author: string;
  totalPages: number;
  currentPage: number;
  status: 'active' | 'completed' | 'paused';
  startDate: Date;
  completedDate?: Date;
  notes?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const BookSchema = new Schema<IBook>(
  {
    userId: {
      type: String,
      required: [true, 'Kullanıcı ID gereklidir'],
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Kitap ismi gereklidir'],
      trim: true,
    },
    author: {
      type: String,
      required: [true, 'Yazar ismi gereklidir'],
      trim: true,
    },
    totalPages: {
      type: Number,
      required: [true, 'Toplam sayfa sayısı gereklidir'],
      min: [1, 'Sayfa sayısı en az 1 olmalıdır'],
    },
    currentPage: {
      type: Number,
      default: 0,
      min: [0, 'Sayfa sayısı negatif olamaz'],
    },
    status: {
      type: String,
      enum: ['active', 'completed', 'paused'],
      default: 'active',
    },
    startDate: {
      type: Date,
      default: Date.now,
    },
    completedDate: {
      type: Date,
    },
    notes: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
BookSchema.index({ userId: 1, status: 1, updatedAt: -1 });

const Book: Model<IBook> = mongoose.models.Book || mongoose.model<IBook>('Book', BookSchema);

export default Book;

