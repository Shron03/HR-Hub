import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongoMemoryServer = null;

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  if (uri && uri.trim() !== '') {
    try {
      console.log(`Connecting to specified MongoDB URI: ${uri.replace(/:([^:@]+)@/, ':****@')}`);
      const conn = await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 5000,
      });
      console.log(`[DB] MongoDB Connected to Atlas/External: ${conn.connection.host}`);
      return conn;
    } catch (err) {
      console.warn(`[DB WARNING] Failed to connect to external MongoDB URI (${err.message}). Falling back to Embedded In-Memory MongoDB.`);
    }
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
