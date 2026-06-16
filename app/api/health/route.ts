import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import mongoose from 'mongoose';

// Quick DB connectivity check for deployment debugging
export async function GET() {
  const startedAt = Date.now();

  try {
    if (!process.env.MONGODB_URI) {
      return NextResponse.json(
        { ok: false, error: 'MONGODB_URI is not set' },
        { status: 500 }
      );
    }

    await dbConnect();
    const dbName = mongoose.connection.db?.databaseName ?? 'unknown';
    const userCount = await mongoose.connection.db
      ?.collection('users')
      .countDocuments();

    return NextResponse.json({
      ok: true,
      db: dbName,
      users: userCount,
      latencyMs: Date.now() - startedAt,
      hasAuthSecret: Boolean(process.env.AUTH_SECRET),
      nextAuthUrl: process.env.NEXTAUTH_URL ?? null,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      {
        ok: false,
        error: message,
        latencyMs: Date.now() - startedAt,
        hasAuthSecret: Boolean(process.env.AUTH_SECRET),
        nextAuthUrl: process.env.NEXTAUTH_URL ?? null,
      },
      { status: 500 }
    );
  }
}
