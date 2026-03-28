import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongoServer = null;

/**
 * Enhanced database connection with fallback support
 * Dev: Uses MongoDB Memory Server (in-memory)
 * Prod: Uses Atlas/Local MongoDB
 */
export const connectDB = async () => {
  try {
    const isDev = process.env.NODE_ENV === 'development';
    let mongoUri = process.env.MONGO_URI;

    // Development: Use in-memory MongoDB
    if (isDev && !mongoUri) {
      console.log('🚀 Starting MongoDB Memory Server (Development)...');
      mongoServer = await MongoMemoryServer.create();
      mongoUri = mongoServer.getUri();
      console.log('✓ MongoDB Memory Server started');
    }

    // Fallback for missing URI
    if (!mongoUri) {
      if (isDev) {
        mongoUri = 'mongodb://localhost:27017/expense-tracker';
        console.log('⚠️  Using local MongoDB at', mongoUri);
      } else {
        throw new Error('MONGO_URI environment variable is required in production');
      }
    }

    const conn = await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📦 Database: ${conn.connection.db.databaseName}`);
    return conn;
  } catch (error) {
    console.error(`❌ Database connection failed: ${error.message}`);
    
    // Graceful exit with retry info
    if (process.env.NODE_ENV !== 'development') {
      process.exit(1);
    }
    
    console.error('💡 Hint: Ensure MongoDB is running or check MONGO_URI');
    throw error;
  }
};

/**
 * Clean disconnect with cleanup
 */
export const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
    console.log('✓ MongoDB Disconnected');

    // Cleanup memory server if it was used
    if (mongoServer) {
      await mongoServer.stop();
      console.log('✓ MongoDB Memory Server Stopped');
    }
  } catch (error) {
    console.error(`✗ Disconnection error: ${error.message}`);
    throw error;
  }
};
