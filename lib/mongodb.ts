import mongoose from 'mongoose';

// Ensure database name exists in URI (defaults to "test" without it)
function normalizeMongoUri(uri: string): string {
  const match = uri.match(/^mongodb(\+srv)?:\/\/[^/]+(\/[^?]*)?/);
  if (!match) return uri;

  const hasDbPath = match[2] && match[2].length > 1;
  if (hasDbPath) return uri;

  const [base, query] = uri.split('?');
  const cleanBase = base.endsWith('/') ? base.slice(0, -1) : base;
  const defaultQuery = 'retryWrites=true&w=majority';
  return query ? `${cleanBase}/test?${query}` : `${cleanBase}/test?${defaultQuery}`;
}

const MONGODB_URI = process.env.MONGODB_URI
  ? normalizeMongoUri(process.env.MONGODB_URI)
  : '';

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var mongoose: MongooseCache | undefined;
}

let cached: MongooseCache = global.mongoose || { conn: null, promise: null };

if (!global.mongoose) {
  global.mongoose = cached;
}

async function dbConnect() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      maxPoolSize: 10,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default dbConnect;
