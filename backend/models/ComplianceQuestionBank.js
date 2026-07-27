import mongoose from "mongoose";

const questionBankQuestionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  options: [{ type: String }],
  answer: { type: String, required: true }, // The correct answer
  topic: { type: String },
  difficulty: { type: String, enum: ['easy', 'medium', 'hard'], default: 'medium' },
  createdAt: { type: Date, default: Date.now },
});

const complianceQuestionBankSchema = new mongoose.Schema({
  sid: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  description: { type: String },
  topic: { type: String, required: true },
  totalQuestions: { type: Number, required: true }, // Total questions in bank
  questionsPerEmployee: { type: Number, required: true }, // Questions per employee test
  passingPercentage: { type: Number, required: true, min: 0, max: 100, default: 80 }, // Custom passing criteria
  questions: [questionBankQuestionSchema],
  workspacename: { type: String, required: true },
  createdBy: { type: String, required: true }, // Super admin ID
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  // Test configuration
  testConfig: {
    title: { type: String, required: true },
    description: { type: String },
    audience: { type: String, required: true },
    dueDate: { type: String, required: true },
    driveFileNames: { type: String },
  }
});

const ComplianceQuestionBank = mongoose.model("ComplianceQuestionBank", complianceQuestionBankSchema);
export default ComplianceQuestionBank;
