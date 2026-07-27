import mongoose from "mongoose";

const employeeTestAssignmentSchema = new mongoose.Schema({
  sid: { type: String, required: true, unique: true },
  questionBankId: { type: String, required: true }, // Reference to question bank
  employeeId: { type: String, required: true },
  assignedQuestions: [{
    questionId: { type: mongoose.Schema.Types.ObjectId, required: true },
    question: { type: String, required: true },
    options: [{ type: String }],
    answer: { type: String, required: true },
  }],
  testConfig: {
    title: { type: String, required: true },
    description: { type: String },
    audience: { type: String, required: true },
    dueDate: { type: String, required: true },
  },
  workspacename: { type: String, required: true },
  isCompleted: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

// Compound index to ensure one test per employee per question bank
employeeTestAssignmentSchema.index({ questionBankId: 1, employeeId: 1 }, { unique: true });

const EmployeeTestAssignment = mongoose.model("EmployeeTestAssignment", employeeTestAssignmentSchema);
export default EmployeeTestAssignment;
