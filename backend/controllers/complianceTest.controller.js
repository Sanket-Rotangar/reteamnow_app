import * as driveService from '../service/googleDrive.service.js';
import * as geminiService from '../service/gemini.service.js';
import * as testService from '../service/complianceTest.service.js';
import ComplianceTest from '../models/ComplianceTest.js';
import ComplianceResponse from '../models/ComplianceResponse.js';
import EmployeeTestAssignment from '../models/EmployeeTestAssignment.js';
import User from '../models/user-model.js';
import Admin from '../models/SuperAdmin-model.js';
import mongoose from 'mongoose';

export const generateComplianceTest = async (req, res) => {
  try {
    const { numQuestions, topic, driveFileNames } = req.body;
    let fileContent = '';

    console.log('📋 generateComplianceTest called with:', { numQuestions, topic, driveFileNames });

    // Step 1: Call the Drive service only if file names are provided and not empty
    const validFileNames = driveFileNames && Array.isArray(driveFileNames) 
      ? driveFileNames.filter(name => name && name.trim() !== '') 
      : [];

    if (validFileNames.length > 0) {
      console.log('📁 Extracting content from Google Drive files:', validFileNames);
      try {
        fileContent = await driveService.extractTextFromFiles(validFileNames);
        console.log('✅ Successfully extracted file content, length:', fileContent.length);
      } catch (driveError) {
        console.error('❌ Google Drive service error:', driveError.message);
        // Don't fail the entire request - continue with topic-based generation
        console.log('⚠️ Continuing with topic-based generation instead');
        fileContent = '';
      }
    } else {
      console.log('📝 No valid Google Drive files provided, using topic-based generation');
    }

    // Step 2: Call the Gemini service with the results. The service now handles all the logic.
    console.log('🤖 Generating questions with Gemini service');
    const questions = await geminiService.generateComplianceQuestions({
      numQuestions,
      topic,
      fileContent,
    });

    console.log('✅ Successfully generated questions, count:', questions.length);

    // Step 3: Send the response.
    res.json({ questions });

  } catch (err) {
    console.error("❌ Error in generateComplianceTest controller:", err.message);
    console.error("❌ Full error:", err);
    res.status(500).json({ 
      error: "Failed to generate questions.", 
      details: err.message,
      timestamp: new Date().toISOString()
    });
  }
};

export const testGoogleDriveAccess = async (req, res) => {
  try {
    const { fileName } = req.body;
    
    if (!fileName) {
      return res.status(400).json({ error: "fileName is required" });
    }

    console.log(`🔍 Testing Google Drive access for file: ${fileName}`);

    // Try to extract content from the file
    const fileContent = await driveService.extractTextFromFiles([fileName]);
    
    res.json({ 
      success: true,
      fileName: fileName,
      message: "File found and accessible",
      contentLength: fileContent.length,
      contentPreview: fileContent.substring(0, 200) + (fileContent.length > 200 ? "..." : ""),
      timestamp: new Date().toISOString()
    });

  } catch (err) {
    console.error("❌ Error in testGoogleDriveAccess controller:", err.message);
    console.error("❌ Full error:", err);
    
    res.status(500).json({ 
      success: false,
      error: "Failed to access Google Drive file", 
      details: err.message,
      fileName: req.body.fileName,
      timestamp: new Date().toISOString()
    });
  }
};

export const saveTest = async (req, res) => {
    // Regular compliance tests are no longer supported
    // All tests must be created using question banks
    return res.status(400).json({ 
        error: "Regular compliance tests are no longer supported. Please use question bank based tests instead.",
        redirectTo: "/compliance/create-test"
    });
};

export const getTest = async (req, res) => {
    try {
        const { testId } = req.params;
        const { employeeId } = req.query; // Get employeeId from query params
        
        console.log('getTest called with testId:', testId, 'employeeId:', employeeId);
        
        const result = await testService.getTestForUser(testId, employeeId);
        
        // Handle both old and new response formats
        if (result.questions) {
            res.json({ 
                questions: result.questions,
                testAssignmentId: result.testAssignmentId 
            });
        } else {
            // Legacy format - just questions array
            res.json({ questions: result });
        }
    } catch (err) {
        console.error("Error getting test:", err.message);
        res.status(404).json({ error: err.message });
    }
};

export const submitTest = async (req, res) => {
    try {
        console.log('submitTest called with body:', req.body);
        const { employeeId, testId, answers, timeSpent } = req.body;
        
        // Validate required fields
        if (!employeeId) {
            console.log('Missing employeeId');
            return res.status(400).json({ error: "Employee ID is required" });
        }
        if (!testId) {
            console.log('Missing testId');
            return res.status(400).json({ error: "Test ID is required" });
        }
        if (!answers || typeof answers !== 'object') {
            console.log('Invalid answers:', answers);
            return res.status(400).json({ error: "Valid answers object is required" });
        }
        
        console.log('Calling gradeUserAnswers...');
        const result = await testService.gradeUserAnswers(employeeId, testId, answers, timeSpent);
        console.log('gradeUserAnswers result:', result);
        res.json(result);
    } catch (err) {
        console.error("Error submitting test:", err.message);
        console.error("Full error:", err);
        res.status(500).json({ error: "Failed to submit test." });
    }
};

// Get all compliance surveys (supports both legacy compliance tests and question banks)
export const getAllComplianceSurveys = async (req, res) => {
    try {
        const { workspacename } = req.query; // Get workspace filter from query params
        
        // Build query object with workspace filter
        let query = {};
        if (workspacename) {
            query.workspacename = workspacename;
        }
        
        // Get legacy compliance tests (if any exist)
        const surveys = await ComplianceTest.find(query)
            .select('sid test questions createdAt workspacename')
            .sort({ createdAt: -1 });
        
        // Get question banks as well since they are the new primary test type
        const questionBankService = await import('../service/questionBank.service.js');
        const questionBanks = await questionBankService.getAllQuestionBanks(workspacename);
        
        const surveysWithStats = await Promise.all(surveys.map(async (survey) => {
            const responses = await ComplianceResponse.find({ testId: survey.sid });
            const totalResponses = responses.length;
            const completedResponses = responses.filter(r => r.status === 'Pass' || r.status === 'Fail');
            const avgScore = responses.length > 0 
                ? Math.round(responses.reduce((sum, r) => sum + r.score, 0) / responses.length)
                : 0;
            
            return {
                id: survey.sid,
                title: survey.test.title,
                description: survey.test.description,
                category: survey.test.audience || 'General',
                type: 'legacy', // Mark as legacy compliance test
                totalQuestions: survey.questions.length,
                totalResponses,
                completionRate: totalResponses > 0 ? Math.round((completedResponses.length / totalResponses) * 100) : 0,
                averageScore: avgScore,
                status: new Date(survey.test.dueDate) > new Date() ? 'active' : 'expired',
                createdDate: survey.createdAt.toISOString().split('T')[0],
                dueDate: survey.test.dueDate,
                workspacename: survey.workspacename,
                creator: 'Admin' // You can add creator field to schema if needed
            };
        }));
        
        // Add question bank surveys
        const questionBankSurveys = await Promise.all(questionBanks.map(async (bank) => {
            const responses = await ComplianceResponse.find({ questionBankId: bank.sid });
            const totalResponses = responses.length;
            const completedResponses = responses.filter(r => r.status === 'Pass' || r.status === 'Fail');
            const avgScore = responses.length > 0 
                ? Math.round(responses.reduce((sum, r) => sum + r.score, 0) / responses.length)
                : 0;
            
            return {
                id: bank.sid,
                title: bank.title,
                description: bank.description,
                category: bank.testConfig?.audience || 'General',
                type: 'question-bank', // Mark as question bank test
                totalQuestions: bank.questionsPerEmployee, // Questions each employee gets
                totalResponses,
                completionRate: totalResponses > 0 ? Math.round((completedResponses.length / totalResponses) * 100) : 0,
                averageScore: avgScore,
                status: new Date(bank.testConfig?.dueDate) > new Date() ? 'active' : 'expired',
                createdDate: bank.createdAt?.toISOString().split('T')[0],
                dueDate: bank.testConfig?.dueDate,
                workspacename: bank.workspacename,
                creator: 'Admin'
            };
        }));
        
        // Combine legacy surveys and question bank surveys
        const allSurveys = [...surveysWithStats, ...questionBankSurveys]
            .sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate));
        
        res.json(allSurveys);
    } catch (err) {
        console.error("Error fetching compliance surveys:", err.message);
        res.status(500).json({ error: "Failed to fetch compliance surveys." });
    }
};

// Get survey responses overview (supports both legacy compliance tests and question banks)
export const getSurveyResponsesOverview = async (req, res) => {
    try {
        const { workspacename } = req.query; // Get workspace filter from query params
        
        // Build query object with workspace filter
        let query = {};
        if (workspacename) {
            query.workspacename = workspacename;
        }
        
        // Get legacy compliance tests (if any exist)
        const surveys = await ComplianceTest.find(query)
            .select('sid test questions createdAt workspacename')
            .sort({ createdAt: -1 });
        
        // Get question banks as well since they are the new primary test type
        const questionBankService = await import('../service/questionBank.service.js');
        const questionBanks = await questionBankService.getAllQuestionBanks(workspacename);
        
        const surveysWithResponses = await Promise.all(surveys.map(async (survey) => {
            const responses = await ComplianceResponse.find({ testId: survey.sid })
                .sort({ submittedAt: -1 })
                .limit(3);
            
            const allResponses = await ComplianceResponse.find({ testId: survey.sid });
            const totalResponses = allResponses.length;
            const avgScore = allResponses.length > 0 
                ? Math.round(allResponses.reduce((sum, r) => sum + r.score, 0) / allResponses.length)
                : 0;
            
            return {
                id: survey.sid,
                title: survey.test.title,
                category: survey.test.audience || 'General',
                type: 'legacy', // Mark as legacy compliance test
                totalQuestions: survey.questions.length,
                totalResponses,
                completionRate: totalResponses > 0 ? 100 : 0, // Assuming all fetched responses are completed
                averageScore: avgScore,
                status: new Date(survey.test.dueDate) > new Date() ? 'active' : 'expired',
                createdDate: survey.createdAt.toISOString().split('T')[0],
                dueDate: survey.test.dueDate,
                workspacename: survey.workspacename,
                recentResponses: await Promise.all(responses.map(async (r) => {
                    // Try to find user in User collection first by username
                    let user = await User.findOne({ username: r.employeeId })
                        .select('fname lname username');
                    
                    // If not found by username, try by _id (in case employeeId is actually an ObjectId)
                    if (!user && mongoose.Types.ObjectId.isValid(r.employeeId)) {
                        user = await User.findById(r.employeeId)
                            .select('fname lname username');
                    }
                    
                    // If still not found, try Admin collection by username
                    if (!user) {
                        user = await Admin.findOne({ username: r.employeeId })
                            .select('fname lname username');
                    }
                    
                    // If still not found, try Admin collection by _id
                    if (!user && mongoose.Types.ObjectId.isValid(r.employeeId)) {
                        user = await Admin.findById(r.employeeId)
                            .select('fname lname username');
                    }
                    
                    return {
                        id: r._id.toString(),
                        userName: user ? `${user.fname} ${user.lname}` : 'User Not Found',
                        empId: r.employeeId,
                        submittedAt: r.submittedAt.toISOString().split('T')[0],
                        score: r.score
                    };
                }))
            };
        }));
        
        // Add question bank responses
        const questionBankSurveys = await Promise.all(questionBanks.map(async (bank) => {
            const responses = await ComplianceResponse.find({ questionBankId: bank.sid })
                .sort({ submittedAt: -1 })
                .limit(3);
            
            const allResponses = await ComplianceResponse.find({ questionBankId: bank.sid });
            const totalResponses = allResponses.length;
            const avgScore = allResponses.length > 0 
                ? Math.round(allResponses.reduce((sum, r) => sum + r.score, 0) / allResponses.length)
                : 0;
            
            return {
                id: bank.sid,
                title: bank.title,
                category: bank.testConfig?.audience || 'General',
                type: 'question-bank', // Mark as question bank test
                totalQuestions: bank.questionsPerEmployee, // Questions each employee gets
                totalResponses,
                completionRate: totalResponses > 0 ? 100 : 0,
                averageScore: avgScore,
                status: new Date(bank.testConfig?.dueDate) > new Date() ? 'active' : 'expired',
                createdDate: bank.createdAt?.toISOString().split('T')[0],
                dueDate: bank.testConfig?.dueDate,
                workspacename: bank.workspacename,
                recentResponses: await Promise.all(responses.map(async (r) => {
                    // Try to find user in User collection first by username
                    let user = await User.findOne({ username: r.employeeId })
                        .select('fname lname username');
                    
                    // If not found by username, try by _id (in case employeeId is actually an ObjectId)
                    if (!user && mongoose.Types.ObjectId.isValid(r.employeeId)) {
                        user = await User.findById(r.employeeId)
                            .select('fname lname username');
                    }
                    
                    // If still not found, try Admin collection by username
                    if (!user) {
                        user = await Admin.findOne({ username: r.employeeId })
                            .select('fname lname username');
                    }
                    
                    // If still not found, try Admin collection by _id
                    if (!user && mongoose.Types.ObjectId.isValid(r.employeeId)) {
                        user = await Admin.findById(r.employeeId)
                            .select('fname lname username');
                    }
                    
                    return {
                        id: r._id.toString(),
                        userName: user ? `${user.fname} ${user.lname}` : 'User Not Found',
                        empId: r.employeeId,
                        submittedAt: r.submittedAt.toISOString().split('T')[0],
                        score: r.score
                    };
                }))
            };
        }));
        
        // Combine legacy surveys and question bank surveys
        const allSurveys = [...surveysWithResponses, ...questionBankSurveys]
            .sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate));
        
        res.json(allSurveys);
    } catch (err) {
        console.error("Error fetching survey responses overview:", err.message);
        res.status(500).json({ error: "Failed to fetch survey responses overview." });
    }
};

// Get detailed responses for a specific survey (supports both legacy and question bank)
export const getSurveyDetailedResponses = async (req, res) => {
    try {
        const { surveyId } = req.params;
        
        // First try to find as a legacy compliance test
        let survey = await ComplianceTest.findOne({ sid: surveyId });
        let isQuestionBank = false;
        let responses;
        
        if (!survey) {
            // If not found as legacy test, try as question bank
            const questionBankService = await import('../service/questionBank.service.js');
            try {
                survey = await questionBankService.getQuestionBank(surveyId);
                isQuestionBank = true;
                responses = await ComplianceResponse.find({ questionBankId: surveyId })
                    .sort({ submittedAt: -1 });
            } catch (error) {
                return res.status(404).json({ error: "Survey not found" });
            }
        } else {
            // Get responses for legacy test
            responses = await ComplianceResponse.find({ testId: surveyId })
                .sort({ submittedAt: -1 });
        }
        
        let surveyDetail;
        if (isQuestionBank) {
            surveyDetail = {
                id: survey.sid,
                title: survey.title,
                description: survey.description,
                category: survey.testConfig?.audience || 'General',
                totalQuestions: survey.questionsPerEmployee,
                createdDate: survey.createdAt?.toISOString().split('T')[0],
                dueDate: survey.testConfig?.dueDate,
                status: new Date(survey.testConfig?.dueDate) > new Date() ? 'active' : 'expired',
                workspacename: survey.workspacename,
                creator: 'Admin',
                type: 'question-bank'
            };
        } else {
            surveyDetail = {
                id: survey.sid,
                title: survey.test.title,
                description: survey.test.description,
                category: survey.test.audience || 'General',
                totalQuestions: survey.questions.length,
                createdDate: survey.createdAt.toISOString().split('T')[0],
                dueDate: survey.test.dueDate,
                status: new Date(survey.test.dueDate) > new Date() ? 'active' : 'expired',
                workspacename: survey.workspacename,
                creator: 'Admin',
                type: 'legacy'
            };
        }
        
        // Fetch response details with real user data
        const responseDetails = await Promise.all(responses.map(async (response) => {
            // Use actual timeSpent from response (stored in minutes), with fallback only if undefined
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

            // Get detailed answers with questions
            let detailedAnswers = [];
            
            if (isQuestionBank) {
                // For question bank responses, get the test assignment to see the questions
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
            } else {
                // For legacy tests, get questions from the survey
                if (survey.questions && response.answers) {
                    detailedAnswers = survey.questions.map(q => {
                        const userAnswer = response.answers[q._id];
                        return {
                            questionId: q._id.toString(),
                            question: q.question,
                            options: q.options,
                            correctAnswer: q.answer,
                            userAnswer: userAnswer || 'Not answered',
                            isCorrect: userAnswer === q.answer
                        };
                    });
                }
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
            survey: surveyDetail,
            responses: responseDetails
        });
    } catch (err) {
        console.error("Error fetching survey detailed responses:", err.message);
        res.status(500).json({ error: "Failed to fetch survey detailed responses." });
    }
};

// Get individual response details with questions and answers
export const getIndividualResponseDetails = async (req, res) => {
    try {
        const { responseId } = req.params;
        
        // Get the specific response
        const response = await ComplianceResponse.findById(responseId);
        if (!response) {
            return res.status(404).json({ error: "Response not found" });
        }
        
        console.log('Found response:', response);
        
        // Get user details
        let user = await User.findOne({ username: response.employeeId })
            .select('fname lname email teamTitle branch username');
        
        if (!user && mongoose.Types.ObjectId.isValid(response.employeeId)) {
            user = await User.findById(response.employeeId)
                .select('fname lname email teamTitle branch username');
        }
        
        if (!user) {
            user = await Admin.findOne({ username: response.employeeId })
                .select('fname lname email teamTitle branch username');
        }
        
        if (!user && mongoose.Types.ObjectId.isValid(response.employeeId)) {
            user = await Admin.findById(response.employeeId)
                .select('fname lname email teamTitle branch username');
        }
        
        // Get detailed answers with questions
        let detailedAnswers = [];
        let testInfo = {};
        
        if (response.questionBankId) {
            // This is a question bank response
            try {
                const questionBankService = await import('../service/questionBank.service.js');
                const questionBank = await questionBankService.getQuestionBank(response.questionBankId);
                
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
                
                testInfo = {
                    id: questionBank.sid,
                    title: questionBank.title,
                    description: questionBank.description,
                    type: 'question-bank',
                    totalQuestions: questionBank.questionsPerEmployee,
                    dueDate: questionBank.testConfig?.dueDate
                };
            } catch (error) {
                console.error('Error fetching question bank details:', error);
            }
        } else {
            // This is a legacy test response
            try {
                const survey = await ComplianceTest.findOne({ sid: response.testId });
                if (survey && response.answers) {
                    detailedAnswers = survey.questions.map(q => {
                        const userAnswer = response.answers[q._id];
                        return {
                            questionId: q._id.toString(),
                            question: q.question,
                            options: q.options,
                            correctAnswer: q.answer,
                            userAnswer: userAnswer || 'Not answered',
                            isCorrect: userAnswer === q.answer
                        };
                    });
                }
                
                testInfo = {
                    id: survey.sid,
                    title: survey.test.title,
                    description: survey.test.description,
                    type: 'legacy',
                    totalQuestions: survey.questions.length,
                    dueDate: survey.test.dueDate
                };
            } catch (error) {
                console.error('Error fetching legacy test details:', error);
            }
        }
        
        const responseDetail = {
            id: response._id.toString(),
            empId: response.employeeId,
            userName: user ? `${user.fname} ${user.lname}` : 'User Not Found',
            email: user ? user.email : 'N/A',
            department: user ? (user.teamTitle && user.teamTitle.length > 0 ? user.teamTitle.join(', ') : user.branch || 'General') : 'General',
            submittedAt: response.submittedAt.toISOString(),
            score: response.score,
            status: response.status,
            timeSpent: response.timeSpent || 0,
            totalQuestions: detailedAnswers.length,
            correctAnswers: detailedAnswers.filter(a => a.isCorrect).length,
            answers: detailedAnswers
        };
        
        res.json({
            test: testInfo,
            response: responseDetail
        });
    } catch (err) {
        console.error("Error fetching individual response details:", err.message);
        res.status(500).json({ error: "Failed to fetch response details." });
    }
};