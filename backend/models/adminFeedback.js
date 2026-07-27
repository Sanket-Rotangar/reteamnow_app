import mongoose from "mongoose";

const AdminReplySchema = new mongoose.Schema({
  surveyId: { type: String, required: true, index: true },
  questionId: { type: String, required: true, index: true },
  employeeId: { type: String, required: true, index: true },
  commentUniqueId: { type: String, required: true, index: true }, // Key for linking to specific comment - removed unique constraint for multiple replies
  adminId: { type: String, required: true },
  adminName: { type: String, required: true },
  // Support for conversation threading
  replyText: { type: String, required: true },
  replyType: { type: String, enum: ['admin_reply', 'user_reply'], default: 'admin_reply' }, // Track who is replying
  replyToId: { type: String, default: null }, // Reference to the reply being responded to (for threading)
  timestamp: { type: Date, default: Date.now },
  lastEditedAt: { type: Date },
});

const AdminReply = mongoose.model("AdminReply", AdminReplySchema);
export default AdminReply;
