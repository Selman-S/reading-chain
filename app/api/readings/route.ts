import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import dbConnect from '@/lib/mongodb';
import Reading from '@/models/Reading';
import Book from '@/models/Book';

// GET - Okuma kayıtlarını getir (user bazlı)
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await dbConnect();
    
    const searchParams = request.nextUrl.searchParams;
    const bookId = searchParams.get('bookId');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    
    let query: any = { userId: session.user.id };
    
    if (bookId) {
      query.bookId = bookId;
    }
    
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }
    
    const readings = await Reading.find(query)
      .populate('bookId', 'title author')
      .sort({ date: -1 });
    
    return NextResponse.json({ success: true, data: readings });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }
}

// POST - Yeni okuma kaydı ekle (user bazlı)
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await dbConnect();
    
    const body = await request.json();
    const { bookId, pagesRead, date, notes } = body;
    
    // Kitabı bul ve kullanıcının kitabı olduğunu doğrula
    const book = await Book.findOne({ _id: bookId, userId: session.user.id });
    if (!book) {
      return NextResponse.json(
        { success: false, error: 'Kitap bulunamadı' },
        { status: 404 }
      );
    }
    
    // Sayfa hesaplamaları
    const fromPage = book.currentPage;
    const toPage = Math.min(fromPage + pagesRead, book.totalPages);
    const actualPagesRead = toPage - fromPage;
    
    // Okuma kaydı oluştur
    const reading = await Reading.create({
      userId: session.user.id,
      bookId,
      date: date || new Date(),
      pagesRead: actualPagesRead,
      fromPage,
      toPage,
      notes,
    });
    
    // Kitabın mevcut sayfasını güncelle
    book.currentPage = toPage;
    
    // Kitap tamamlandıysa durumu güncelle
    if (toPage >= book.totalPages) {
      book.status = 'completed';
      book.completedDate = new Date();
    }
    
    await book.save();
    
    return NextResponse.json(
      { success: true, data: reading, book },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }
}
