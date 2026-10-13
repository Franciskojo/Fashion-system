import dns from 'node:dns';
import mongoose from 'mongoose';

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: MongooseCache | undefined;
}

const cached: MongooseCache = global.mongooseCache || { conn: null, promise: null };

if (!global.mongooseCache) {
  global.mongooseCache = cached;
}

/** Connects to MongoDB (cached). Throws if MONGODB_URI is missing or the connection fails. */
export async function connectToDatabase(): Promise<typeof mongoose> {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('MONGODB_URI is not set. Add it to .env.local to connect to the database.');
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    if (uri.startsWith('mongodb+srv://')) {
      // Node's built-in resolver can be refused by some local/ISP DNS servers (querySrv ECONNREFUSED).
      // Use public DNS for the Atlas SRV lookup; override with MONGODB_DNS_SERVERS="ip1,ip2" if needed.
      const servers = (process.env.MONGODB_DNS_SERVERS || '8.8.8.8,1.1.1.1').split(',').map((s) => s.trim());
      dns.setServers(servers);
    }
    cached.promise = mongoose.connect(uri);
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}
