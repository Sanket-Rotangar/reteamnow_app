/**
 * EVENT MODELS - Reteamnow Backend
 * 
 * This file defines the data models for:
 * 1. Event - Main event entity with sessions and attendance
 * 2. EventPhoto - Photos uploaded to event competitions
 * 
 * Features:
 * - Virtual fields for computed properties
 * - Pre-save hooks for data consistency
 * - Proper indexing for performance
 * - Data validation and constraints
 */

import mongoose from 'mongoose';

// ===== EVENT PHOTO MODEL =====

/**
 * Schema for event photo competition photos
 * Supports likes, reactions, and comments
 */
const eventPhotoSchema = new mongoose.Schema(
  {
    // Core associations
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
      required: [true, 'Event reference is required'],
      index: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', 
      required: [true, 'User reference is required'],
      index: true,
    },
    
    // Photo data
    imageUrl: {
      type: String,
      required: [true, 'Image URL is required'],
      trim: true,
    },
    caption: {
      type: String,
      trim: true,
      maxlength: [500, 'Caption cannot exceed 500 characters'],
      default: '',
    },
    
    // Engagement data
    likes: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    }],
    reactions: [{
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
      emoji: {
        type: String,
        enum: {
          values: ['❤️', '🎉', '😂'],
          message: 'Only ❤️, 🎉, 😂 emojis are allowed'
        },
        required: true,
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
    }],
    comments: [{
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
      text: {
        type: String,
        required: [true, 'Comment text is required'],
        trim: true,
        maxlength: [300, 'Comment cannot exceed 300 characters'],
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
    }],
    
    // Computed engagement metrics
    likeCount: { 
      type: Number, 
      default: 0 
    },
    commentCount: { 
      type: Number, 
      default: 0 
    },
    totalEngagement: { 
      type: Number, 
      default: 0, 
      index: true 
    },
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Pre-save hook to calculate engagement metrics
eventPhotoSchema.pre('save', function (next) {
  this.likeCount = this.likes.length;
  this.commentCount = this.comments.length;
  this.totalEngagement = this.likes.length + this.reactions.length + this.comments.length;
  next();
});

// Create compound index for efficient querying
eventPhotoSchema.index({ event: 1, createdAt: -1 });
eventPhotoSchema.index({ user: 1, createdAt: -1 });

export const EventPhoto = mongoose.model('EventPhoto', eventPhotoSchema);

// ===== EVENT ATTENDANCE MODEL =====

/**
 * Attendance schema for tracking event participation
 */
const attendanceSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User reference is required']
  },
  isAttending: {
    type: Boolean,
    required: [true, 'Attendance status is required']
  }
}, { _id: false });

export { attendanceSchema };

// ===== EVENT SESSION MODEL =====

/**
 * Session schema for event scheduling
 */
const sessionSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: [true, 'Session title is required'],
    trim: true
  },
  startTime: { 
    type: Date, 
    required: [true, 'Session start time is required']
  },
  endTime: { 
    type: Date, 
    required: [true, 'Session end time is required']
  }
}, { _id: false });

// Validation: End time must be after start time
sessionSchema.pre('validate', function(next) {
  if (this.startTime && this.endTime && this.startTime >= this.endTime) {
    next(new Error('Session end time must be after start time'));
  } else {
    next();
  }
});

// ===== MAIN EVENT MODEL =====

/**
 * Schema for events with comprehensive features
 */
const eventSchema = new mongoose.Schema({
  // Basic event information
  title: {
    type: String,
    required: [true, 'Event title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Event description is required'],
    trim: true,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  location: {
    type: String,
    trim: true,
    required: [true, 'Event location is required'],
    maxlength: [200, 'Location cannot exceed 200 characters']
  },
  
  // Event status and management
  status: {
    type: String,
    enum: {
      values: ['active', 'completed', 'cancelled'],
      message: 'Status must be active, completed, or cancelled'
    },
    default: 'active',
    index: true
  },
  cancelReason: {
    type: String,
    default: '',
    trim: true,
    maxlength: [500, 'Cancel reason cannot exceed 500 characters']
  },
  
  // Scheduling and reminders
  reminder: {
    type: Date,
    validate: {
      validator: function(v) {
        return !v || v > new Date();
      },
      message: 'Reminder date must be in the future'
    }
  },
  
  // File attachment (event banner/document)
  file: {
    type: String,
    trim: true
  },
  
  // User assignments and attendance
  userAssigned: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  sessions: [sessionSchema],
  attendance: [attendanceSchema],
  
  // Registration settings
  maxCapacity: {
    type: Number,
    min: [1, 'Capacity must be at least 1'],
    default: null
  },
  isRegistrationOpen: {
    type: Boolean,
    default: true
  },
  
  // Audit fields
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Created by user is required'],
    index: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// ===== VIRTUAL FIELDS =====

/**
 * Virtual field for registered attendee count
 */
eventSchema.virtual('registeredCount').get(function() {
  return this.attendance ? this.attendance.filter(a => a.isAttending).length : 0;
});

/**
 * Virtual field for effective status based on session timing
 */
eventSchema.virtual('effectiveStatus').get(function() {
  if (this.status === 'cancelled') return 'cancelled';
  
  const now = new Date();
  if (!this.sessions || this.sessions.length === 0) {
    return this.status;
  }

  const allCompleted = this.sessions.every(s => new Date(s.endTime) < now);
  if (allCompleted) return 'completed';

  const hasStarted = this.sessions.some(s => new Date(s.startTime) <= now);
  return hasStarted ? 'active' : this.status;
});

// ===== INSTANCE METHODS =====

/**
 * Check if a user is registered for this event
 * @param {string} userId - User ID to check
 * @returns {boolean} - True if user is registered
 */
eventSchema.methods.isUserRegistered = function(userId) {
  return this.attendance.some(a => 
    a.user.toString() === userId.toString() && a.isAttending
  );
};

/**
 * Toggle user registration for this event
 * @param {string} userId - User ID
 * @param {boolean} isAttending - Attendance status
 * @returns {Object} - Updated event
 */
eventSchema.methods.toggleUserRegistration = async function(userId, isAttending) {
  const existingIndex = this.attendance.findIndex(
    a => a.user.toString() === userId.toString()
  );

  if (existingIndex > -1) {
    this.attendance[existingIndex].isAttending = isAttending;
  } else {
    this.attendance.push({ user: userId, isAttending });
  }

  await this.save();
  return this;
};

// ===== INDEXES =====
eventSchema.index({ status: 1, createdAt: -1 });
eventSchema.index({ createdBy: 1, createdAt: -1 });
eventSchema.index({ 'userAssigned': 1 });

const Event = mongoose.model('Event', eventSchema);

export default Event;
