import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import dbConnect from '@/lib/mongodb';
import Book from '@/models/Book';

// GET - Tüm kitapları getir (user bazlı)
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
    const status = searchParams.get('status');
    
    let query: any = { userId: session.user.id };
    if (status) {
      query.status = status;
    }
    
    const books = await Book.find(query).sort({ updatedAt: -1 });
    
    return NextResponse.json({ success: true, data: books });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }
}

// POST - Yeni kitap ekle (user bazlı)
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
    const book = await Book.create({
      ...body,
      userId: session.user.id,
    });
    
    return NextResponse.json({ success: true, data: book }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }
}
