import mongoose, { Schema, Model } from 'mongoose';

export interface IReading {
  _id?: string;
  userId: string;
  bookId: mongoose.Types.ObjectId | string;
  date: Date;
  pagesRead: number;
  fromPage: number;
  toPage: number;
  notes?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const ReadingSchema = new Schema<IReading>(
  {
    userId: {
      type: String,
      required: [true, 'Kullanıcı ID gereklidir'],
      index: true,
    },
    bookId: {
      type: Schema.Types.ObjectId,
      ref: 'Book',
      required: [true, 'Kitap seçimi gereklidir'],
    },
    date: {
      type: Date,
      required: [true, 'Tarih gereklidir'],
      default: Date.now,
    },
    pagesRead: {
      type: Number,
      required: [true, 'Okunan sayfa sayısı gereklidir'],
      min: [1, 'En az 1 sayfa okumalısınız'],
    },
    fromPage: {
      type: Number,
      required: true,
    },
    toPage: {
      type: Number,
      required: true,
    },
    notes: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for faster queries
ReadingSchema.index({ userId: 1, date: -1 });
ReadingSchema.index({ userId: 1, bookId: 1, date: -1 });

const Reading: Model<IReading> = mongoose.models.Reading || mongoose.model<IReading>('Reading', ReadingSchema);

export default Reading;

