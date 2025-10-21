import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.join(process.cwd(), '.env.local') });

// Import models
import User from '../models/User';
import Book from '../models/Book';
import Reading from '../models/Reading';
import Friend, { FriendStatus } from '../models/Friend';
import { updateUserStats } from '../lib/statsUpdater';

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

// Test kullanıcıları
const testUsers = [
  {
    username: 'selman',
    email: 'selman@test.com',
    password: '123456',
    avatar: '🐶',
    bio: 'Kitap okumayı seven bir geliştirici',
  },
  {
    username: 'ahmet',
    email: 'ahmet@test.com',
    password: '123456',
    avatar: '🐱',
    bio: 'Klasik edebiyat tutkunu',
  },
  {
    username: 'ayse',
    email: 'ayse@test.com',
    password: '123456',
    avatar: '🦊',
    bio: 'Bilim kurgu ve fantastik roman okuyucusu',
  },
];

// Kitap verileri
const booksData = {
  selman: [
    { title: '1984', author: 'George Orwell', totalPages: 328, status: 'active' as const },
    { title: 'Suç ve Ceza', author: 'Fyodor Dostoyevski', totalPages: 671, status: 'completed' as const },
    { title: 'Simyacı', author: 'Paulo Coelho', totalPages: 208, status: 'completed' as const },
  ],
  ahmet: [
    { title: 'Sefiller', author: 'Victor Hugo', totalPages: 1232, status: 'active' as const },
    { title: 'Anna Karenina', author: 'Lev Tolstoy', totalPages: 864, status: 'completed' as const },
    { title: 'Beyaz Diş', author: 'Jack London', totalPages: 298, status: 'completed' as const },
  ],
  ayse: [
    { title: 'Dune', author: 'Frank Herbert', totalPages: 688, status: 'active' as const },
    { title: 'Yüzüklerin Efendisi', author: 'J.R.R. Tolkien', totalPages: 1178, status: 'completed' as const },
    { title: 'Harry Potter ve Felsefe Taşı', author: 'J.K. Rowling', totalPages: 223, status: 'completed' as const },
  ],
};

async function connectDB() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ MongoDB bağlantısı başarılı');
  } catch (error) {
    console.error('❌ MongoDB bağlantı hatası:', error);
    process.exit(1);
  }
}

async function clearTestData() {
  console.log('\n🗑️  Mevcut test verileri temizleniyor...');
  
  const testEmails = testUsers.map(u => u.email);
  const testUsernames = testUsers.map(u => u.username);
  
  // Email veya username ile eşleşen kullanıcıları bul
  const users = await User.find({
    $or: [
      { email: { $in: testEmails } },
      { username: { $in: testUsernames } }
    ]
  });
  const userIds = users.map(u => u._id!.toString());

  if (userIds.length > 0) {
    await Reading.deleteMany({ userId: { $in: userIds } });
    await Book.deleteMany({ userId: { $in: userIds } });
    await Friend.deleteMany({
      $or: [
        { userId: { $in: userIds } },
        { friendId: { $in: userIds } }
      ]
    });
    await User.deleteMany({ _id: { $in: userIds } });
    console.log(`   Silinen kullanıcılar: ${userIds.length}`);
  } else {
    console.log(`   Temizlenecek veri bulunamadı`);
  }
}

async function createUsers() {
  console.log('\n👥 Kullanıcılar oluşturuluyor...');
  const createdUsers = [];

  for (const userData of testUsers) {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const user = await User.create({
      ...userData,
      password: hashedPassword,
      totalPagesRead: 0,
      totalBooksCompleted: 0,
      currentStreak: 0,
      longestStreak: 0,
      profilePublic: true,
      showStatsToFriends: true,
    });
    createdUsers.push(user);
    console.log(`   ✓ ${user.username} (${user.email})`);
  }

  return createdUsers;
}

async function createFriendships(users: any[]) {
  console.log('\n🤝 Arkadaşlıklar oluşturuluyor...');
  
  // Selman -> Ahmet (kabul edilmiş)
  await Friend.create({
    userId: users[0]._id.toString(),
    friendId: users[1]._id.toString(),
    status: FriendStatus.ACCEPTED,
  });
  console.log('   ✓ selman ↔ ahmet');

  // Selman -> Ayşe (kabul edilmiş)
  await Friend.create({
    userId: users[0]._id.toString(),
    friendId: users[2]._id.toString(),
    status: FriendStatus.ACCEPTED,
  });
  console.log('   ✓ selman ↔ ayse');

  // Ahmet -> Ayşe (kabul edilmiş)
  await Friend.create({
    userId: users[1]._id.toString(),
    friendId: users[2]._id.toString(),
    status: FriendStatus.ACCEPTED,
  });
  console.log('   ✓ ahmet ↔ ayse');
}

async function createBooksAndReadings(users: any[]) {
  console.log('\n📚 Kitaplar ve okuma kayıtları oluşturuluyor...');

  for (let i = 0; i < users.length; i++) {
    const user = users[i];
    const username = user.username as keyof typeof booksData;
    const userBooks = booksData[username];

    console.log(`\n   ${user.username} için:`);

    const createdBooks = [];

    for (const bookData of userBooks) {
      // Başlangıç tarihini geçmişe ayarla (1-3 ay önce)
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - Math.floor(Math.random() * 90 + 30));

      const book = await Book.create({
        userId: user._id.toString(),
        title: bookData.title,
        author: bookData.author,
        totalPages: bookData.totalPages,
        currentPage: 0,
        status: 'active',
        startDate: startDate,
      });

      console.log(`      📖 ${book.title}`);

      // Okuma kayıtları oluştur
      if (bookData.status === 'completed') {
        // Tamamlanmış kitaplar için geçmiş tarihli kayıtlar
        await createReadingHistory(user._id.toString(), book, startDate, true);
        
        // Kitabı tamamlanmış olarak işaretle
        const completedDate = new Date(startDate);
        completedDate.setDate(completedDate.getDate() + 30);
        await Book.findByIdAndUpdate(book._id, {
          status: 'completed',
          currentPage: book.totalPages,
          completedDate: completedDate,
        });
        book.status = 'completed';
      } else {
        // Aktif kitaplar için kısmi okuma kayıtları
        await createReadingHistory(user._id.toString(), book, startDate, false);
      }

      createdBooks.push(book);
    }

    // Son 7 gün için sürekli okuma ekle (streak için)
    await ensureRecentReadings(user._id.toString(), createdBooks);

    // Kullanıcı istatistiklerini güncelle
    await updateUserStats(user._id.toString());
    const updatedUser = await User.findById(user._id);
    console.log(`      📊 Stats: ${updatedUser?.totalPagesRead} sayfa, ${updatedUser?.currentStreak} gün streak`);
  }
}

async function createReadingHistory(
  userId: string,
  book: any,
  startDate: Date,
  isCompleted: boolean
) {
  const readings = [];
  let currentPage = 0;
  const targetPage = isCompleted ? book.totalPages : Math.floor(book.totalPages * (0.3 + Math.random() * 0.4));
  
  const currentDate = new Date(startDate);
  
  while (currentPage < targetPage) {
    // Günlük okuma miktarı (10-50 sayfa arası, bazen daha fazla)
    const pagesPerDay = Math.floor(Math.random() * 40 + 10);
    const pagesRead = Math.min(pagesPerDay, targetPage - currentPage);
    
    if (pagesRead > 0) {
      readings.push({
        userId,
        bookId: book._id,
        date: new Date(currentDate),
        pagesRead,
        fromPage: currentPage,
        toPage: currentPage + pagesRead,
        notes: Math.random() > 0.7 ? 'Harika bir okuma!' : undefined,
      });
      
      currentPage += pagesRead;
    }
    
    // Bir sonraki okuma günü (bazen 1 gün atlayabilir)
    const skipDays = Math.random() > 0.7 ? 2 : 1;
    currentDate.setDate(currentDate.getDate() + skipDays);
    
    // Bugünü geçmeyelim
    if (currentDate > new Date()) break;
  }

  // Tüm okumaları kaydet
  if (readings.length > 0) {
    await Reading.insertMany(readings);
    console.log(`         ✓ ${readings.length} okuma kaydı eklendi`);
  }
  
  // Kitabın currentPage'ini güncelle
  await Book.findByIdAndUpdate(book._id, { currentPage });
}

// Son 7 gün için sürekli okuma ekle (streak için)
async function ensureRecentReadings(userId: string, books: any[]) {
  const today = new Date();
  const activeBooks = books.filter(b => b.status === 'active');
  
  if (activeBooks.length === 0) return;
  
  for (let i = 6; i >= 0; i--) {
    const readingDate = new Date(today);
    readingDate.setDate(readingDate.getDate() - i);
    readingDate.setHours(0, 0, 0, 0);
    
    // Bu tarihte zaten okuma var mı kontrol et
    const existingReading = await Reading.findOne({
      userId,
      date: {
        $gte: readingDate,
        $lt: new Date(readingDate.getTime() + 24 * 60 * 60 * 1000)
      }
    });
    
    if (!existingReading) {
      // Rastgele bir aktif kitap seç
      const randomBook = activeBooks[Math.floor(Math.random() * activeBooks.length)];
      const pagesRead = Math.floor(Math.random() * 30 + 10);
      
      await Reading.create({
        userId,
        bookId: randomBook._id,
        date: readingDate,
        pagesRead,
        fromPage: randomBook.currentPage,
        toPage: Math.min(randomBook.currentPage + pagesRead, randomBook.totalPages),
      });
      
      // Kitabı güncelle
      await Book.findByIdAndUpdate(randomBook._id, {
        $inc: { currentPage: pagesRead }
      });
    }
  }
}

async function main() {
  console.log('🚀 Test verisi seed işlemi başlatılıyor...\n');

  await connectDB();
  await clearTestData();
  
  const users = await createUsers();
  await createFriendships(users);
  await createBooksAndReadings(users);

  console.log('\n✅ Seed işlemi tamamlandı!');
  console.log('\n📋 Test hesapları:');
  testUsers.forEach(u => {
    console.log(`   • ${u.username} - ${u.email} (şifre: ${u.password})`);
  });
  
  console.log('\n💡 Artık bu hesaplarla giriş yapıp uygulamayı test edebilirsiniz!\n');
  
  await mongoose.disconnect();
  process.exit(0);
}

main().catch(error => {
  console.error('❌ Seed hatası:', error);
  process.exit(1);
});

