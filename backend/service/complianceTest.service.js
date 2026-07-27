import ComplianceResponse from '../models/ComplianceResponse.js';
import EmployeeTestAssignment from '../models/EmployeeTestAssignment.js';
import User from '../models/user-model.js';
import * as questionBankService from './questionBank.service.js';

// All compliance tests are now question bank based
// Use questionBank.service.js for creating new tests

export const getTestForUser = async (testId, employeeId = null) => {
  // First, check if this is a question bank ID
  try {
    const questionBank = await questionBankService.getQuestionBank(testId);
    
    if (questionBank && employeeId) {
      // Generate or get existing test assignment for this employee
      const testAssignment = await questionBankService.generateEmployeeTest(testId, employeeId);
      
      // Return questions without answers for the test-taking interface
      const questionsForTest = testAssignment.assignedQuestions.map(q => ({
        _id: q.questionId,
        question: q.question,
        options: q.options,
      }));
      
      // Also return the test assignment ID for submission
      return { 
        questions: questionsForTest,
        testAssignmentId: testAssignment.sid 
      };
    }
  } catch (error) {
    // If not a question bank, fall through to check employee test assignments
  }
  
  // Check if it's an employee test assignment ID
  try {
    const questions = await questionBankService.getEmployeeTest(testId);
    return { 
      questions: questions,
      testAssignmentId: testId 
    };
  } catch (error) {
    throw new Error('Test not found');
  }
};

export const gradeUserAnswers = async (employeeId, testId, answers, timeSpent = 0) => {
  try {
    // First, try to find as an employee test assignment
    let employeeTest;
    try {
      employeeTest = await questionBankService.getEmployeeTestWithAnswers(testId);
    } catch (error) {
      // If not found as employee test assignment, check if it's a question bank ID
      
      // Try to find existing employee test assignment for this question bank and employee
      const existingAssignment = await EmployeeTestAssignment.findOne({
        questionBankId: testId,
        employeeId: employeeId
      });
      
      if (existingAssignment) {
        employeeTest = existingAssignment;
      } else {
        // Generate a new test assignment for this employee
        employeeTest = await questionBankService.generateEmployeeTest(testId, employeeId);
      }
    }

    // Get the question bank to retrieve passing percentage
    const questionBank = await questionBankService.getQuestionBank(employeeTest.questionBankId);
    const passingPercentage = questionBank.passingPercentage || 80; // Default to 80% if not set

    let correctCount = 0;
    employeeTest.assignedQuestions.forEach(q => {
      const userAnswer = answers[q.questionId];
      const correctAnswer = q.answer;
      const isCorrect = userAnswer === correctAnswer;
      if (isCorrect) {
        correctCount++;
      }
    });

    const score = employeeTest.assignedQuestions.length > 0 ? (correctCount / employeeTest.assignedQuestions.length) * 100 : 0;
    const status = score >= passingPercentage ? 'Pass' : 'Fail';

    // Mark test as completed using the employee test assignment ID
    await questionBankService.markTestAsCompleted(employeeTest.sid);

    const responseData = {
      employeeId, 
      testId: employeeTest.sid, // Use the employee test assignment ID
      questionBankId: employeeTest.questionBankId, // Include the question bank ID for admin views
      answers, 
      score, 
      status,
      timeSpent: timeSpent || 0
    };
    
    const newResponse = new ComplianceResponse(responseData);
    await newResponse.save();

    // Record compliance attempt for tracking
    try {
      // Find user by employee ID to get email
      const user = await User.findById(employeeId);
      if (user && user.email) {
        // Initialize complianceAttempts field if it doesn't exist (for users created before schema update)
        if (!user.complianceAttempts) {
          user.complianceAttempts = new Map();
        }
        
        // Get current compliance data for this test
        const currentData = user.complianceAttempts.get(employeeTest.questionBankId) || {
          totalAttempts: 0,
          passedAttempts: 0,
          failedAttempts: 0,
          isLocked: false,
          lastAttemptDate: null,
          bestScore: 0,
          status: 'not_started'
        };
        
        // Check if this would exceed 3 attempts
        if (currentData.totalAttempts >= 3) {
          // User exceeded max attempts, but test was already completed
        } else {
          // Update attempt data
          const newAttemptData = {
            totalAttempts: currentData.totalAttempts + 1,
            passedAttempts: status === 'Pass' ? currentData.passedAttempts + 1 : currentData.passedAttempts,
            failedAttempts: status === 'Fail' ? currentData.failedAttempts + 1 : currentData.failedAttempts,
            lastAttemptDate: new Date(),
            bestScore: Math.max(currentData.bestScore, score),
            status: status === 'Pass' ? 'passed' : (currentData.totalAttempts + 1 >= 3 && status === 'Fail') ? 'locked' : 'in_progress',
            isLocked: (status === 'Fail' && currentData.failedAttempts + 1 >= 3)
          };
          
          // Update user's compliance attempts
          user.complianceAttempts.set(employeeTest.questionBankId, newAttemptData);
          await user.save();
        }
      } else {
        // Could not find user or email for compliance attempt recording
      }
    } catch (attemptError) {
      console.error('❌ Error recording compliance attempt:', attemptError);
      // Don't fail the whole test submission if attempt recording fails
    }

    return { score: score.toFixed(0), status, timeSpent };
  } catch (error) {
    console.log('Test not found for testId:', testId);
    console.error('Error in gradeUserAnswers:', error);
    throw new Error('Test submission failed: ' + error.message);
  }
};