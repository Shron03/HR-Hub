import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongoMemoryServer = null;

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI;
  const isProduction = process.env.NODE_ENV === 'production';
  const allowInMemory = process.env.ALLOW_IN_MEMORY_DB === 'true';

  if (uri && uri.trim() !== '') {
    try {
      console.log(`Connecting to specified MongoDB URI: ${uri.replace(/:([^:@]+)@/, ':****@')}`);
      const conn = await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 5000,
      });
      console.log(`[DB] MongoDB Connected to external instance: ${conn.connection.host}`);
      return conn;
    } catch (err) {
      if (isProduction && !allowInMemory) {
        throw new Error(`[DB FATAL] Failed to connect to production MongoDB (${err.message}). In-memory database fallback is disabled in production to prevent data loss. Set ALLOW_IN_MEMORY_DB=true if running an ephemeral demo.`);
      }
      console.warn(`[DB WARNING] Failed to connect to external MongoDB URI (${err.message}). Falling back to Embedded In-Memory MongoDB.`);
    }
  } else if (isProduction && !allowInMemory) {
    throw new Error('[DB FATAL] MONGODB_URI is required in production environment. In-memory database fallback is disabled to prevent data loss. Set ALLOW_IN_MEMORY_DB=true if running an ephemeral demo.');
  }

  try {
    console.log('[DB] Initializing Embedded In-Memory MongoDB engine...');
    mongoMemoryServer = await MongoMemoryServer.create({
      instance: {
        dbName: 'hr_hub_db'
      }
    });
    const memoryUri = mongoMemoryServer.getUri();
    const conn = await mongoose.connect(memoryUri);
    console.log(`[DB] Embedded In-Memory MongoDB running at: ${memoryUri}`);
    return conn;
  } catch (error) {
    console.error('[DB ERROR] MongoDB Connection Error:', error);
    process.exit(1);
  }
};

export const closeDB = async () => {
  try {
    await mongoose.disconnect();
    if (mongoMemoryServer) {
      await mongoMemoryServer.stop();
    }
  } catch (error) {
    console.error('[DB ERROR] Error closing DB:', error);
  }
};
