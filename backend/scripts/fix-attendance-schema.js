/**
 * Database migration script to fix attendance schema
 * This script will:
 * 1. Drop the old employee_1_date_1 index
 * 2. Remove records with null employee field
 * 3. Ensure the new userId_1_date_1 index exists
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

async function fixAttendanceSchema() {
  try {
    // Connect to MongoDB using the same URI format as in the main app
    const mongoUri = `${process.env.MONGO_URI}/${process.env.MONGODB_NAME}`;
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB:', mongoUri);

    const db = mongoose.connection.db;
    const attendanceCollection = db.collection('attendances');

    // 1. List current indexes
    console.log('\n📋 Current indexes:');
    const indexes = await attendanceCollection.indexes();
    indexes.forEach(index => {
      console.log(`  - ${index.name}: ${JSON.stringify(index.key)}`);
    });

    // 2. Drop the old index if it exists
    try {
      await attendanceCollection.dropIndex('employee_1_date_1');
      console.log('✓ Dropped old employee_1_date_1 index');
    } catch (error) {
      console.log('ℹ Old employee_1_date_1 index does not exist or already dropped');
    }

    // 3. Drop any other old indexes that might cause conflicts
    const problematicIndexes = ['userId_1_date_1'];
    for (const indexName of problematicIndexes) {
      try {
        await attendanceCollection.dropIndex(indexName);
        console.log(`✓ Dropped old ${indexName} index`);
      } catch (error) {
        console.log(`ℹ ${indexName} index does not exist or already dropped`);
      }
    }

    // 4. Remove records with null employee field
    const deleteResult = await attendanceCollection.deleteMany({
      employee: { $exists: true }
    });
    console.log(`✓ Deleted ${deleteResult.deletedCount} records with employee field`);

    // 5. Remove records with missing userId field
    const deleteResult2 = await attendanceCollection.deleteMany({
      userId: { $exists: false }
    });
    console.log(`✓ Deleted ${deleteResult2.deletedCount} records without userId field`);

    // 6. Remove records with null userId
    const deleteResult3 = await attendanceCollection.deleteMany({
      userId: null
    });
    console.log(`✓ Deleted ${deleteResult3.deletedCount} records with null userId`);

    // 7. Ensure the new index exists
    try {
      await attendanceCollection.createIndex(
        { userId: 1, date: 1 }, 
        { unique: true, name: 'userId_date_unique' }
      );
      console.log('✓ Created new userId_date_unique index');
    } catch (error) {
      console.log('ℹ userId_date_unique index creation failed or already exists:', error.message);
    }

    // 8. List final indexes
    console.log('\n📋 Final indexes:');
    const finalIndexes = await attendanceCollection.indexes();
    finalIndexes.forEach(index => {
      console.log(`  - ${index.name}: ${JSON.stringify(index.key)}`);
    });

    // 9. Show sample documents
    const sampleDocs = await attendanceCollection.find({}).limit(3).toArray();
    console.log('\n📄 Sample documents:');
    sampleDocs.forEach((doc, idx) => {
      console.log(`  ${idx + 1}. userId: ${doc.userId}, date: ${doc.date}, checkInTime: ${doc.checkInTime}`);
    });

    console.log('\n✅ Attendance schema migration completed successfully');

  } catch (error) {
    console.error('❌ Migration failed:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
}

// Run the migration
fixAttendanceSchema();
