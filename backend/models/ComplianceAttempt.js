import mongoose from "mongoose";

const complianceAttemptSchema = new mongoose.Schema({
  employeeId: { type: String, required: true },
  questionBankId: { type: String, required: true }, // Corresponds to the 'sid' of the ComplianceQuestionBank
  attemptNumber: { type: Number, required: true, min: 1, max: 3 },
  score: { type: Number, required: true },
  status: { type: String, enum: ['Pass', 'Fail'], required: true },
  answers: { type: mongoose.Schema.Types.Mixed }, // Stores { questionId: "selected answer" }
  timeSpent: { type: Number, default: 0 }, // Time spent in minutes
  submittedAt: { type: Date, default: Date.now },
  isLocked: { type: Boolean, default: false }, // True if user is locked after 3 failed attempts
  hrActionRequired: { type: Boolean, default: false }, // True if HR action is required after 3 failures
}, {
  timestamps: true
});

// Create compound index for efficient querying
complianceAttemptSchema.index({ employeeId: 1, questionBankId: 1 });

// Static method to check if user is locked
complianceAttemptSchema.statics.isUserLocked = async function(employeeId, questionBankId) {
  const attempts = await this.find({ employeeId, questionBankId }).sort({ attemptNumber: -1 });
  
  if (attempts.length === 0) return false;
  
  // Check if user has 3 failed attempts
  const failedAttempts = attempts.filter(attempt => attempt.status === 'Fail');
  
  if (failedAttempts.length >= 3) {
    return true;
  }
  
  // Check if user has already passed
  const passedAttempt = attempts.find(attempt => attempt.status === 'Pass');
  return passedAttempt ? false : false;
};

// Static method to get remaining attempts
complianceAttemptSchema.statics.getRemainingAttempts = async function(employeeId, questionBankId) {
  const attempts = await this.find({ employeeId, questionBankId });
  const totalAttempts = attempts.length;
  
  // If user has already passed, no more attempts needed
  const passedAttempt = attempts.find(attempt => attempt.status === 'Pass');
  if (passedAttempt) return 0;
  
  return Math.max(0, 3 - totalAttempts);
};

// Static method to get next attempt number
complianceAttemptSchema.statics.getNextAttemptNumber = async function(employeeId, questionBankId) {
  const attempts = await this.find({ employeeId, questionBankId });
  return attempts.length + 1;
};

const ComplianceAttempt = mongoose.model("ComplianceAttempt", complianceAttemptSchema);
export default ComplianceAttempt;
