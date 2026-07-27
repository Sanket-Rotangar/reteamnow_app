import ComplianceQuestionBank from '../models/ComplianceQuestionBank.js';
import EmployeeTestAssignment from '../models/EmployeeTestAssignment.js';
import User from '../models/user-model.js';
import { v4 as uuidv4 } from 'uuid';

export const createQuestionBank = async (questionBankData, questions, createdBy) => {
  const questionBankId = uuidv4();
  
  const newQuestionBank = new ComplianceQuestionBank({
    sid: questionBankId,
    ...questionBankData,
    questions: questions,
    createdBy: createdBy
  });
  
  await newQuestionBank.save();
  return newQuestionBank;
};

export const getQuestionBank = async (questionBankId) => {
  const questionBank = await ComplianceQuestionBank.findOne({ sid: questionBankId });
  if (!questionBank) throw new Error('Question bank not found');
  return questionBank;
};

export const getAllQuestionBanks = async (workspacename) => {
  let query = { isActive: true };
  if (workspacename) {
    query.workspacename = workspacename;
  }
  
  const questionBanks = await ComplianceQuestionBank.find(query)
    .select('sid title description topic totalQuestions questionsPerEmployee createdAt testConfig workspacename')
    .sort({ createdAt: -1 });
  
  return questionBanks;
};

export const generateEmployeeTest = async (questionBankId, employeeId) => {
  const questionBank = await getQuestionBank(questionBankId);
  
  // Check if test already exists for this employee
  const existingTest = await EmployeeTestAssignment.findOne({ 
    questionBankId, 
    employeeId 
  });
  
  if (existingTest) {
    return existingTest;
  }
  
  // Randomly select questions for this employee
  const shuffledQuestions = [...questionBank.questions].sort(() => Math.random() - 0.5);
  const selectedQuestions = shuffledQuestions.slice(0, questionBank.questionsPerEmployee);
  
  const assignedQuestions = selectedQuestions.map(q => ({
    questionId: q._id,
    question: q.question,
    options: q.options,
    answer: q.answer
  }));
  
  const testAssignment = new EmployeeTestAssignment({
    sid: uuidv4(),
    questionBankId,
    employeeId,
    assignedQuestions,
    testConfig: questionBank.testConfig,
    workspacename: questionBank.workspacename
  });
  
  await testAssignment.save();
  return testAssignment;
};

export const getEmployeeTest = async (testId) => {
  const test = await EmployeeTestAssignment.findOne({ sid: testId });
  if (!test) throw new Error('Test not found');
  
  // Return questions without answers for the test-taking interface
  const questionsForTest = test.assignedQuestions.map(q => ({
    _id: q.questionId,
    question: q.question,
    options: q.options,
  }));
  
  return questionsForTest;
};

export const getEmployeeTestWithAnswers = async (testId) => {
  const test = await EmployeeTestAssignment.findOne({ sid: testId });
  if (!test) throw new Error('Test not found');
  return test;
};

export const markTestAsCompleted = async (testId) => {
  await EmployeeTestAssignment.findOneAndUpdate(
    { sid: testId },
    { isCompleted: true }
  );
};

export const getAvailableEmployeesForTesting = async (workspacename) => {
  // Get all users in the workspace who are not admins
  const employees = await User.find({ 
    workspaceName: workspacename,
    role: { $nin: ['admin', 'superadmin'] },
    status: 'active'
  }).select('username fname lname email');
  
  return employees;
};
