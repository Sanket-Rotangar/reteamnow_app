import * as driveService from '../service/googleDrive.service.js';
import * as geminiService from '../service/gemini.service.js';
import * as questionBankService from '../service/questionBank.service.js';
import EmployeeTestAssignment from '../models/EmployeeTestAssignment.js';
import ComplianceResponse from '../models/ComplianceResponse.js';
import User from '../models/user-model.js';
import Admin from '../models/SuperAdmin-model.js';
import mongoose from 'mongoose';

export const createQuestionBank = async (req, res) => {
  try {
    const { 
      title, 
      description, 
      topic, 
      totalQuestions, 
      questionsPerEmployee, 
      passingPercentage = 80, // Default to 80% if not provided
      driveFileNames, 
      audience, 
      dueDate, 
      workspacename,
      questions: providedQuestions // Accept pre-generated questions
    } = req.body;

    // Validation
    if (!title || !topic || !totalQuestions || !questionsPerEmployee || !audience || !dueDate || !workspacename) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    if (questionsPerEmployee > totalQuestions) {
      return res.status(400).json({ error: "Questions per employee cannot exceed total questions in bank" });
    }

    if (passingPercentage < 0 || passingPercentage > 100) {
      return res.status(400).json({ error: "Passing percentage must be between 0 and 100" });
    }

    // Get created by from token (assuming middleware sets req.user)
    const createdBy = req.user?.id || req.user?.userId || 'admin';

    let questions;

    // Use provided questions if available, otherwise generate them
    if (providedQuestions && Array.isArray(providedQuestions) && providedQuestions.length > 0) {
      // Validate provided questions structure
      const isValidQuestions = providedQuestions.every(q => 
        q.question && q.options && Array.isArray(q.options) && q.answer
      );
      
      if (!isValidQuestions) {
        return res.status(400).json({ error: "Invalid questions format provided" });
      }
      
      questions = providedQuestions;
      console.log(`✅ Using ${questions.length} pre-generated questions`);
    } else {
      // Fall back to generating questions automatically
      let fileContent = '';

      // Step 1: Extract content from Google Drive files if provided
      if (driveFileNames && driveFileNames.length > 0 && driveFileNames[0] !== '') {
        fileContent = await driveService.extractTextFromFiles(driveFileNames);
      }

      // Step 2: Generate questions using Gemini service
      questions = await geminiService.generateComplianceQuestions({
        numQuestions: totalQuestions,
        topic,
        fileContent,
      });
      
      console.log(`🤖 Generated ${questions.length} new questions automatically`);
    }

    // Step 3: Create question bank data
    const questionBankData = {
      title,
      description,
      topic,
      totalQuestions,
      questionsPerEmployee,
      passingPercentage,
      workspacename,
      testConfig: {
        title,
        description,
        audience,
        dueDate,
        driveFileNames: driveFileNames ? driveFileNames.join(', ') : ''
      }
    };

    // Step 4: Save question bank
    const newQuestionBank = await questionBankService.createQuestionBank(
      questionBankData, 
      questions, 
      createdBy
    );

    res.status(201).json({ 
      message: "Question bank created successfully", 
      questionBankId: newQuestionBank.sid,
      totalQuestions: questions.length,
      questionsPerEmployee
    });

  } catch (err) {
    console.error("Error creating question bank:", err.message);
    res.status(500).json({ error: "Failed to create question bank." });
  }
};

export const getAllQuestionBanks = async (req, res) => {
  try {
    const { workspacename } = req.query;
    
    const questionBanks = await questionBankService.getAllQuestionBanks(workspacename);
    
    const questionBanksWithStats = await Promise.all(questionBanks.map(async (bank) => {
      // Count how many employees have been assigned tests
      const assignedTests = await EmployeeTestAssignment.countDocuments({ 
        questionBankId: bank.sid 
      });
      
      // Count completed tests
      const completedTests = await EmployeeTestAssignment.countDocuments({ 
        questionBankId: bank.sid, 
        isCompleted: true 
      });

      // Get average scores from completed tests using questionBankId directly
      const responses = await ComplianceResponse.find({ questionBankId: bank.sid });
      
      let avgScore = 0;
      if (responses.length > 0) {
        avgScore = Math.round(responses.reduce((sum, r) => sum + r.score, 0) / responses.length);
      }
      
      return {
        id: bank.sid,
        title: bank.title,
        description: bank.description,
        topic: bank.topic,
        totalQuestions: bank.totalQuestions,
        questionsPerEmployee: bank.questionsPerEmployee,
        passingPercentage: bank.passingPercentage,
        assignedEmployees: assignedTests,
        completedTests,
        averageScore: avgScore,
        status: new Date(bank.testConfig.dueDate) > new Date() ? 'active' : 'expired',
        createdDate: bank.createdAt.toISOString().split('T')[0],
        dueDate: bank.testConfig.dueDate,
        workspacename: bank.workspacename,
        category: bank.testConfig.audience || 'General',
      };
    }));
    
    res.json(questionBanksWithStats);
  } catch (err) {
    console.error("Error fetching question banks:", err.message);
    res.status(500).json({ error: "Failed to fetch question banks." });
  }
};

export const generateEmployeeTest = async (req, res) => {
  try {
    const { questionBankId, employeeId } = req.body;
    
    if (!questionBankId || !employeeId) {
      return res.status(400).json({ error: "Question bank ID and employee ID are required" });
    }
    
    const testAssignment = await questionBankService.generateEmployeeTest(questionBankId, employeeId);
    
    res.json({ 
      message: "Employee test generated successfully", 
      testId: testAssignment.sid,
      questionsCount: testAssignment.assignedQuestions.length
    });
  } catch (err) {
    console.error("Error generating employee test:", err.message);
    res.status(500).json({ error: err.message });
  }
};

export const getEmployeeTest = async (req, res) => {
  try {
    const { testId } = req.params;
    
    const questions = await questionBankService.getEmployeeTest(testId);
    res.json({ questions });
  } catch (err) {
    console.error("Error getting employee test:", err.message);
    res.status(404).json({ error: err.message });
  }
};

export const getAvailableEmployees = async (req, res) => {
  try {
    const { workspacename } = req.query;
    
    if (!workspacename) {
      return res.status(400).json({ error: "Workspace name is required" });
    }
    
    const employees = await questionBankService.getAvailableEmployeesForTesting(workspacename);
    res.json({ employees });
  } catch (err) {
    console.error("Error getting available employees:", err.message);
    res.status(500).json({ error: "Failed to get available employees." });
  }
};

export const getQuestionBankDetails = async (req, res) => {
  try {
    const { questionBankId } = req.params;
    
    const questionBank = await questionBankService.getQuestionBank(questionBankId);
    
    // Get assigned employees
    const assignments = await EmployeeTestAssignment.find({ questionBankId })
      .select('employeeId isCompleted createdAt');
    
    res.json({
      questionBank: {
        id: questionBank.sid,
        title: questionBank.title,
        description: questionBank.description,
        topic: questionBank.topic,
        totalQuestions: questionBank.totalQuestions,
        questionsPerEmployee: questionBank.questionsPerEmployee,
        testConfig: questionBank.testConfig,
        workspacename: questionBank.workspacename,
        createdAt: questionBank.createdAt
      },
      assignments: assignments.map(a => ({
        employeeId: a.employeeId,
        testId: a.sid,
        isCompleted: a.isCompleted,
        assignedAt: a.createdAt
      }))
    });
  } catch (err) {
    console.error("Error getting question bank details:", err.message);
    res.status(404).json({ error: err.message });
  }
};

// Get detailed responses for a specific question bank
export const getQuestionBankDetailedResponses = async (req, res) => {
  try {
    const { questionBankId } = req.params;
    
    // Get question bank details
    const questionBank = await questionBankService.getQuestionBank(questionBankId);
    if (!questionBank) {
      return res.status(404).json({ error: "Question bank not found" });
    }
    
    // Get all responses for this question bank using questionBankId
    const responses = await ComplianceResponse.find({ questionBankId })
      .sort({ submittedAt: -1 });
    
    const questionBankDetail = {
      id: questionBank.sid,
      title: questionBank.title,
      description: questionBank.description,
      topic: questionBank.topic,
      totalQuestions: questionBank.totalQuestions,
      questionsPerEmployee: questionBank.questionsPerEmployee,
      category: questionBank.testConfig.audience || 'General',
      createdDate: questionBank.createdAt.toISOString().split('T')[0],
      dueDate: questionBank.testConfig.dueDate,
      status: new Date(questionBank.testConfig.dueDate) > new Date() ? 'active' : 'expired',
      workspacename: questionBank.workspacename,
      creator: 'Admin'
    };
    
    // Fetch response details with real user data
    const responseDetails = await Promise.all(responses.map(async (response) => {
      const timeSpent = response.timeSpent !== undefined ? response.timeSpent : 0;
      
      // Try to find user in User collection first by username
      let user = await User.findOne({ username: response.employeeId })
        .select('fname lname email teamTitle branch username');
      
      // If not found by username, try by _id (in case employeeId is actually an ObjectId)
      if (!user && mongoose.Types.ObjectId.isValid(response.employeeId)) {
        user = await User.findById(response.employeeId)
          .select('fname lname email teamTitle branch username');
      }
      
      // If still not found, try Admin collection by username
      if (!user) {
        user = await Admin.findOne({ username: response.employeeId })
          .select('fname lname email teamTitle branch username');
      }
      
      // If still not found, try Admin collection by _id
      if (!user && mongoose.Types.ObjectId.isValid(response.employeeId)) {
        user = await Admin.findById(response.employeeId)
          .select('fname lname email teamTitle branch username');
      }
      
      // Get detailed answers with questions for question bank responses
      let detailedAnswers = [];
      
      try {
        const testAssignment = await EmployeeTestAssignment.findOne({ 
          employeeId: response.employeeId, 
          questionBankId: response.questionBankId 
        });
        
        if (testAssignment && response.answers) {
          detailedAnswers = testAssignment.assignedQuestions.map(q => {
            const userAnswer = response.answers[q.questionId];
            return {
              questionId: q.questionId.toString(),
              question: q.question,
              options: q.options,
              correctAnswer: q.answer,
              userAnswer: userAnswer || 'Not answered',
              isCorrect: userAnswer === q.answer
            };
          });
        }
      } catch (error) {
        console.error('Error fetching test assignment for response:', error);
      }
      
      return {
        id: response._id.toString(),
        empId: response.employeeId,
        userName: user ? `${user.fname} ${user.lname}` : 'User Not Found',
        email: user ? user.email : 'N/A',
        department: user ? (user.teamTitle && user.teamTitle.length > 0 ? user.teamTitle.join(', ') : user.branch || 'General') : 'General',
        submittedAt: response.submittedAt.toISOString(),
        score: response.score,
        status: 'completed',
        timeSpent,
        answers: detailedAnswers
      };
    }));
    
    res.json({
      survey: questionBankDetail,
      responses: responseDetails
    });
  } catch (err) {
    console.error("Error fetching question bank detailed responses:", err.message);
    res.status(500).json({ error: "Failed to fetch question bank detailed responses." });
  }
};
