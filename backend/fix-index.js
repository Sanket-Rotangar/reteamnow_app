// Script to fix the unique index issue for multiple replies
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

async function fixUniqueIndex() {
  try {
    console.log('🔧 Connecting to MongoDB...');
    // Use the full URI with database name
    const mongoUri = process.env.MONGO_URI + 'reteam-now';
    console.log('🔗 Connecting to:', mongoUri.replace(/\/\/[^@]*@/, '//***:***@'));
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');
    
    const db = mongoose.connection.db;
    const collection = db.collection('adminreplies');
    
    // List current indexes
    console.log('📋 Checking current indexes...');
    const indexes = await collection.indexes();
    console.log('Current indexes:', indexes.map(idx => ({ name: idx.name, key: idx.key, unique: idx.unique })));
    
    // Drop the unique index on commentUniqueId if it exists
    try {
      console.log('🗑️ Attempting to drop unique index on commentUniqueId...');
      await collection.dropIndex('commentUniqueId_1');
      console.log('✅ Successfully dropped unique index on commentUniqueId');
    } catch (err) {
      console.log('⚠️ Index drop result:', err.message);
    }
    
    // Create a new non-unique index
    console.log('🔨 Creating new non-unique index on commentUniqueId...');
    await collection.createIndex({ commentUniqueId: 1 }, { unique: false });
    console.log('✅ Created new non-unique index on commentUniqueId');
    
    // List indexes after change
    console.log('📋 Checking new indexes...');
    const newIndexes = await collection.indexes();
    console.log('New indexes:', newIndexes.map(idx => ({ name: idx.name, key: idx.key, unique: idx.unique })));
    
    console.log('🎉 Index fix completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error fixing index:', error);
    process.exit(1);
  }
}

fixUniqueIndex();
