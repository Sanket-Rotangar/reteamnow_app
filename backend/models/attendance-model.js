import mongoose from 'mongoose';

const attendanceSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    date: { 
      type: String, 
      required: true,
      match: /^\d{4}-\d{2}-\d{2}$/ // YYYY-MM-DD format
    },
    checkInTime: { 
      type: String,
      default: null // Stored in 24-hour format (HH:MM:SS)
    },
    checkInTimeDisplay: { 
      type: String,
      default: null // Displayed in 12-hour format (H:MM AM/PM)
    },
    checkOutTime: { 
      type: String,
      default: null // Stored in 24-hour format (HH:MM:SS)
    },
    checkOutTimeDisplay: { 
      type: String,
      default: null // Displayed in 12-hour format (H:MM AM/PM)
    },
    totalHours: { 
      type: String,
      default: null
    },
    status: { 
      type: String, 
      enum: ['present', 'absent'], 
      default: 'present'
    },
  },
  { timestamps: true },
);

// Create a compound index to ensure unique attendance per user per day
// Using a different name to avoid conflicts with old index
attendanceSchema.index({ userId: 1, date: 1 }, { unique: true, name: 'userId_date_unique' });

const Attendance = mongoose.model('Attendance', attendanceSchema);

export default Attendance;
