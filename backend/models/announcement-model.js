import mongoose from 'mongoose';

const AnnouncementSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    subtitle: { type: String, trim: true },
    message: { type: String, required: true, trim: true },
    mediaUrl: { type: String, trim: true },
    mediaType: { type: String, enum: ['image', 'video'], default: 'image' },
    requiresAcknowledgment: { 
      type: Boolean, 
      default: false,
      comment: 'If true, users must read this announcement before they can check in'
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    readBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  },
  { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } },
);

// helpful indexes
AnnouncementSchema.index({ createdAt: -1 });

const Announcement = mongoose.model('Announcement', AnnouncementSchema);
export default Announcement;
