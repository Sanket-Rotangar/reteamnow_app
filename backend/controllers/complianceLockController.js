import ComplianceAttempt from '../models/ComplianceAttempt.js';
import ComplianceQuestionBank from '../models/ComplianceQuestionBank.js';
import User from '../models/user-model.js';

// Simple test endpoint to verify routes are working
export const testConnection = async (req, res) => {
  res.json({ 
    success: true, 
    message: 'Compliance lock routes are working',
    timestamp: new Date().toISOString()
  });
};

// Check if user is locked from taking a specific compliance test
export const checkUserLockStatus = async (req, res) => {
  try {
    const { employeeId, questionBankId } = req.params;
    
    console.log('🔍 Checking lock status for:', employeeId, questionBankId);
    
    // Get user from database
    const user = await User.findOne({ email: employeeId });
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }
    
    // Initialize complianceAttempts field if it doesn't exist (for users created before schema update)
    if (!user.complianceAttempts) {
      user.complianceAttempts = new Map();
      console.log('🔧 Initialized complianceAttempts field for user:', employeeId);
    }
    
    // Get compliance attempt data for this specific test
    const complianceData = user.complianceAttempts.get(questionBankId) || {
      totalAttempts: 0,
      passedAttempts: 0,
      failedAttempts: 0,
      isLocked: false,
      lastAttemptDate: null,
      bestScore: 0,
      status: 'not_started'
    };
    
    const remainingAttempts = Math.max(0, 3 - complianceData.totalAttempts);
    const hasPassedTest = complianceData.status === 'passed';
    const isLocked = complianceData.isLocked || complianceData.failedAttempts >= 3;
    
    res.json({
      isLocked,
      remainingAttempts,
      totalAttempts: complianceData.totalAttempts,
      hasPassedTest,
      hrActionRequired: isLocked,
      bestScore: complianceData.bestScore,
      lastAttemptDate: complianceData.lastAttemptDate,
      status: complianceData.status,
      attempts: [] // Legacy field for compatibility
    });
  } catch (error) {
    console.error('Error checking user lock status:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to check user lock status',
      details: error.message 
    });
  }
};

// Record a new compliance test attempt
export const recordTestAttempt = async (req, res) => {
  try {
    const { employeeId, questionBankId, score, status, answers, timeSpent } = req.body;
    
    // Get user from database
    const user = await User.findOne({ email: employeeId });
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }
    
    // Initialize complianceAttempts field if it doesn't exist (for users created before schema update)
    if (!user.complianceAttempts) {
      user.complianceAttempts = new Map();
      console.log('🔧 Initialized complianceAttempts field for user:', employeeId);
    }
    
    // Get current compliance data for this test
    const currentData = user.complianceAttempts.get(questionBankId) || {
      totalAttempts: 0,
      passedAttempts: 0,
      failedAttempts: 0,
      isLocked: false,
      lastAttemptDate: null,
      bestScore: 0,
      status: 'not_started'
    };
    
    // Check if user is already locked
    if (currentData.isLocked || currentData.failedAttempts >= 3) {
      return res.status(403).json({
        success: false,
        error: 'User is locked from taking this test. HR action required.',
        hrActionRequired: true
      });
    }
    
    // Check if user has already passed
    if (currentData.status === 'passed') {
      return res.status(400).json({
        success: false,
        error: 'User has already passed this test.'
      });
    }
    
    // Check if this would exceed 3 attempts
    if (currentData.totalAttempts >= 3) {
      return res.status(403).json({
        success: false,
        error: 'Maximum attempts exceeded. HR action required.',
        hrActionRequired: true
      });
    }
    
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
    user.complianceAttempts.set(questionBankId, newAttemptData);
    await user.save();
    
    // Also save detailed attempt in ComplianceAttempt collection for history
    const attempt = new ComplianceAttempt({
      employeeId,
      questionBankId,
      attemptNumber: newAttemptData.totalAttempts,
      score,
      status,
      answers,
      timeSpent,
      isLocked: newAttemptData.isLocked,
      hrActionRequired: newAttemptData.isLocked
    });
    
    await attempt.save();
    
    const remainingAttempts = Math.max(0, 3 - newAttemptData.totalAttempts);
    
    res.json({
      success: true,
      attempt: {
        attemptNumber: newAttemptData.totalAttempts,
        score: score,
        status: status,
        submittedAt: newAttemptData.lastAttemptDate
      },
      remainingAttempts,
      isLocked: newAttemptData.isLocked,
      hrActionRequired: newAttemptData.isLocked,
      userStatus: newAttemptData.status
    });
  } catch (error) {
    console.error('Error recording test attempt:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to record test attempt',
      details: error.message 
    });
  }
};

// Get test attempt disclaimer information
export const getTestDisclaimer = async (req, res) => {
  try {
    const { employeeId, questionBankId } = req.params;
    
    console.log('🔍 Getting disclaimer for:', employeeId, questionBankId);
    
    // Get user and question bank
    const user = await User.findOne({ email: employeeId });
    const questionBank = await ComplianceQuestionBank.findOne({ sid: questionBankId });
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }
    
    if (!questionBank) {
      return res.status(404).json({
        success: false,
        error: 'Question bank not found'
      });
    }
    
    // Initialize complianceAttempts field if it doesn't exist (for users created before schema update)
    if (!user.complianceAttempts) {
      user.complianceAttempts = new Map();
      console.log('🔧 Initialized complianceAttempts field for user:', employeeId);
    }
    
    // Get compliance data for this test
    const complianceData = user.complianceAttempts.get(questionBankId) || {
      totalAttempts: 0,
      passedAttempts: 0,
      failedAttempts: 0,
      isLocked: false,
      lastAttemptDate: null,
      bestScore: 0,
      status: 'not_started'
    };
    
    const remainingAttempts = Math.max(0, 3 - complianceData.totalAttempts);
    const hasPassedTest = complianceData.status === 'passed';
    const isLocked = complianceData.isLocked || complianceData.failedAttempts >= 3;
    
    const disclaimer = {
      testTitle: questionBank.title,
      passingPercentage: questionBank.passingPercentage,
      totalAttempts: complianceData.totalAttempts,
      remainingAttempts,
      hasPassedTest,
      isLocked,
      hrActionRequired: isLocked,
      bestScore: complianceData.bestScore,
      lastAttemptDate: complianceData.lastAttemptDate,
      disclaimerText: `
        IMPORTANT COMPLIANCE TEST DISCLAIMER
        
        • You have ${remainingAttempts} attempt(s) remaining for this test
        • You need to score at least ${questionBank.passingPercentage}% to pass
        • Maximum 3 attempts are allowed
        • After 3 failed attempts, your profile will be locked from further tests
        • HR action will be mandatory if you fail 3 times
        • This policy applies only to compliance tests
        
        Please ensure you are well-prepared before starting the test.
      `
    };
    
    res.json(disclaimer);
  } catch (error) {
    console.error('Error getting test disclaimer:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to get test disclaimer',
      details: error.message 
    });
  }
};

// Reset user attempts (HR action)
export const resetUserAttempts = async (req, res) => {
  try {
    const { employeeId, questionBankId } = req.body;
    const { hrNotes } = req.body;
    
    // This should only be called by HR/Admin users
    // Add proper authorization check here based on your auth system
    
    console.log('🔄 HR Reset action for:', employeeId, questionBankId);
    
    // Find the user
    const user = await User.findOne({ email: employeeId });
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }
    
    // Reset user's compliance attempts for this test
    user.complianceAttempts.delete(questionBankId);
    await user.save();
    
    // Also clean up the detailed attempt history (optional)
    await ComplianceAttempt.deleteMany({ employeeId, questionBankId });
    
    // Log HR action
    console.log(`HR Reset: Employee ${employeeId} attempts reset for test ${questionBankId}. Notes: ${hrNotes || 'No notes provided'}`);
    
    res.json({
      success: true,
      message: 'User attempts have been reset by HR'
    });
  } catch (error) {
    console.error('Error resetting user attempts:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to reset user attempts',
      details: error.message 
    });
  }
};

// HR Management Functions

// Get all locked users for HR dashboard
export const getLockedUsers = async (req, res) => {
  try {
    console.log('🔍 HR: Fetching all locked users...');

    // Find all users who have at least one locked compliance test
    const users = await User.find({
      complianceAttempts: { $exists: true }
    });

    const lockedUsers = [];

    for (const user of users) {
      if (user.complianceAttempts) {
        const lockedTests = [];
        
        for (const [testId, attemptData] of user.complianceAttempts) {
          if (attemptData.isLocked === true) {
            // Get test details
            const questionBank = await ComplianceQuestionBank.findOne({ sid: testId });
            lockedTests.push({
              testId,
              testName: questionBank ? questionBank.title : 'Unknown Test',
              totalAttempts: attemptData.totalAttempts,
              failedAttempts: attemptData.failedAttempts,
              lastAttemptDate: attemptData.lastAttemptDate,
              bestScore: attemptData.bestScore
            });
          }
        }

        if (lockedTests.length > 0) {
          lockedUsers.push({
            userId: user._id,
            email: user.email,
            fname: user.fname,
            lname: user.lname,
            workspaceName: user.workspaceName,
            lockedTests
          });
        }
      }
    }

    res.json({
      success: true,
      message: `Found ${lockedUsers.length} users with locked compliance tests`,
      lockedUsers
    });
  } catch (error) {
    console.error('❌ Error fetching locked users:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Internal server error',
      details: error.message 
    });
  }
};

// Unlock user for specific test (HR action)
export const unlockUser = async (req, res) => {
  try {
    const { userId, testId } = req.params;

    console.log('🔓 HR: Unlocking user', userId, 'for test', testId);

    // Find user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        error: 'User not found' 
      });
    }

    if (!user.complianceAttempts || !user.complianceAttempts.has(testId)) {
      return res.status(404).json({ 
        success: false, 
        error: 'Test record not found for user' 
      });
    }

    // Reset compliance attempts to default values
    const defaultAttemptData = {
      totalAttempts: 0,
      failedAttempts: 0,
      passedAttempts: 0,
      bestScore: 0,
      lastAttemptDate: null,
      isLocked: false,
      status: 'not_started'
    };

    user.complianceAttempts.set(testId, defaultAttemptData);
    await user.save();

    // Get test details for response
    const questionBank = await ComplianceQuestionBank.findOne({ sid: testId });

    // Log HR action
    console.log(`🔓 HR Unlock: User ${user.email} unlocked for test ${testId}. Attempts reset to default values.`);

    res.json({
      success: true,
      message: 'User unlocked and attempts reset successfully',
      data: {
        userEmail: user.email,
        userName: `${user.fname} ${user.lname}`,
        testName: questionBank ? questionBank.title : 'Unknown Test',
        resetAttempts: true,
        newStatus: 'not_started'
      }
    });
  } catch (error) {
    console.error('❌ Error unlocking user:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Internal server error',
      details: error.message 
    });
  }
};

// Get user compliance overview for HR
export const getUserComplianceOverview = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        error: 'User not found' 
      });
    }

    const complianceOverview = {
      userId: user._id,
      email: user.email,
      fullName: `${user.fname} ${user.lname}`,
      workspaceName: user.workspaceName,
      tests: []
    };

    if (user.complianceAttempts) {
      for (const [testId, attemptData] of user.complianceAttempts) {
        const questionBank = await ComplianceQuestionBank.findOne({ sid: testId });
        complianceOverview.tests.push({
          testId,
          testName: questionBank ? questionBank.title : 'Unknown Test',
          ...attemptData
        });
      }
    }

    res.json({
      success: true,
      data: complianceOverview
    });
  } catch (error) {
    console.error('❌ Error fetching user compliance overview:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Internal server error',
      details: error.message 
    });
  }
};

// Get user's overall compliance status for profile indicator
export const getUserComplianceStatus = async (req, res) => {
  try {
    const { email } = req.params;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        error: 'User not found' 
      });
    }

    let totalFailedAttempts = 0;
    let hasAnyLocked = false;
    let hasAnyPassed = false;

    if (user.complianceAttempts) {
      for (const [testId, attemptData] of user.complianceAttempts) {
        totalFailedAttempts += attemptData.failedAttempts || 0;
        if (attemptData.isLocked) hasAnyLocked = true;
        if (attemptData.status === 'passed') hasAnyPassed = true;
      }
    }

    // Determine status color based on compliance attempts
    let status = 'green'; // Default: Good standing
    let statusText = 'Good Standing';

    if (hasAnyLocked) {
      status = 'red';
      statusText = 'Locked - HR Action Required';
    } else if (totalFailedAttempts >= 3) {
      status = 'red';
      statusText = 'Multiple Failures';
    } else if (totalFailedAttempts >= 1) {
      status = 'orange';
      statusText = `${totalFailedAttempts} Failed Attempt${totalFailedAttempts > 1 ? 's' : ''}`;
    } else if (hasAnyPassed) {
      status = 'green';
      statusText = 'Tests Passed';
    }

    res.json({
      success: true,
      status,
      statusText,
      totalFailedAttempts,
      hasLocked: hasAnyLocked
    });
  } catch (error) {
    console.error('❌ Error getting user compliance status:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Internal server error',
      details: error.message 
    });
  }
};