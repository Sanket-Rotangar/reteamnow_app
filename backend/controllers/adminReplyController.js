import AdminReply from '../models/adminFeedback.js';
import { notifyUserAboutCommentReply } from '../service/notification.service.js';
import StatusCodes from 'http-status-codes';

// ✅ Save admin reply to comment with workspace verification
export const createAdminReply = async (req, res) => {
  try {
    const {
      surveyId,
      questionId,
      employeeId,
      commentUniqueId,
      adminId,
      adminName,
      replyText,
    } = req.body;

    console.log('💬 Admin reply submission:', {
      surveyId,
      questionId,
      employeeId,
      commentUniqueId,
      adminId,
      adminName,
      replyText: replyText?.substring(0, 50) + '...',
      userRole: req.user?.role,
      userWorkspaces: req.user?.workspaceNames
    });

    // Validation
    if (!surveyId || !questionId || !employeeId || !commentUniqueId || !adminId || !adminName || !replyText) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    
    // Role-based access control - Allow both admin and superadmin
    if (req.user?.role !== 'superadmin' && req.user?.role !== 'admin') {
      console.log('❌ Access denied - Only admins and super admins can create replies');
      return res.status(403).json({ error: 'Access denied - Only admins and super admins can create replies' });
    }
    
    // Workspace verification - check if survey belongs to admin's workspace
    const SurveyResponse = (await import('../models/SurveyResponse.js')).default;
    const survey = await SurveyResponse.findOne({ sid: surveyId });
    
    if (!survey) {
      console.log('❌ Survey not found:', surveyId);
      return res.status(404).json({ error: 'Survey not found' });
    }
    
    // Check if survey is in admin's workspace
    if (req.user.workspaceNames && !req.user.workspaceNames.includes(survey.workspace)) {
      console.log('❌ Access denied - Survey not in admin workspace:', {
        surveyWorkspace: survey.workspace,
        adminWorkspaces: req.user.workspaceNames
      });
      return res.status(403).json({ error: 'Access denied - Survey not in your workspace' });
    }

    // ✅ Allow multiple replies - Remove the restriction for multiple replies per comment
    console.log('💬 Creating new reply for comment:', commentUniqueId);

    // Create new reply (multiple replies allowed)
    const newReply = new AdminReply({
      surveyId,
      questionId,
      employeeId,
      commentUniqueId,
      adminId,
      adminName,
      replyText: replyText.trim(),
      timestamp: new Date()
    });
    
    const savedReply = await newReply.save();
    
    console.log('✅ Created new admin reply');
    
    // 🔔 Send notification for new reply
    try {
      await notifyUserAboutCommentReply(
        surveyId, 
        questionId, 
        employeeId, 
        { reply: replyText, createdBy: adminId }, 
        adminName
      );
    } catch (notificationError) {
      console.error("⚠️ Failed to send reply notification:", notificationError);
    }
    
    return res.status(201).json({ 
      message: 'Reply created successfully', 
      reply: savedReply 
    });
  } catch (error) {
    console.error('❌ Error saving admin reply:', error);
    res.status(500).json({ 
      error: 'Server error saving reply', 
      details: error.message 
    });
  }
};

// ✅ Get admin replies for specific survey/question with workspace filtering
export const getAdminReplies = async (req, res) => {
  try {
    const { surveyId, questionId, employeeId } = req.query;
    
    console.log('🔍 Fetching admin replies for:', { surveyId, questionId, employeeId });
    console.log('👤 User info:', {
      role: req.user?.role,
      workspaceNames: req.user?.workspaceNames,
      userId: req.user?.userId || req.user?.id
    });
    
    // Build base query
    const query = {};
    if (surveyId) query.surveyId = surveyId;
    if (questionId) query.questionId = questionId;
    
    // Handle different access patterns based on user role and request type
    if (employeeId) {
      // This is a request for a specific employee's replies
      if (req.user?.role === 'superadmin' || req.user?.role === 'admin') {
        // Admin and super admin can access employee replies in their workspace
        // We need to verify the survey belongs to admin's workspace
        if (surveyId) {
          const SurveyResponse = (await import('../models/SurveyResponse.js')).default;
          const survey = await SurveyResponse.findOne({ sid: surveyId });
          
          if (!survey) {
            return res.status(404).json({ error: 'Survey not found' });
          }
          
          // Check if survey is in admin's workspace
          if (req.user.workspaceNames && !req.user.workspaceNames.includes(survey.workspace)) {
            console.log('❌ Access denied - Survey not in admin workspace');
            return res.status(403).json({ error: 'Access denied - Survey not in your workspace' });
          }
        }
        
        query.employeeId = employeeId;
      } else {
        // Normal users can only access their own replies
        const normalUserId = req.user?.userId || req.user?.id;
        if (employeeId !== normalUserId) {
          console.log('❌ Access denied - User can only access own replies');
          return res.status(403).json({ error: 'Access denied - You can only access your own replies' });
        }
        query.employeeId = employeeId;
      }
    } else {
      // General query for survey/question replies
      if (req.user?.role === 'superadmin' || req.user?.role === 'admin') {
        // Admin and super admin need workspace verification
        if (surveyId) {
          const SurveyResponse = (await import('../models/SurveyResponse.js')).default;
          const survey = await SurveyResponse.findOne({ sid: surveyId });
          
          if (!survey) {
            return res.status(404).json({ error: 'Survey not found' });
          }
          
          // Check if survey is in admin's workspace
          if (req.user.workspaceNames && !req.user.workspaceNames.includes(survey.workspace)) {
            console.log('❌ Access denied - Survey not in admin workspace');
            return res.status(403).json({ error: 'Access denied - Survey not in your workspace' });
          }
        }
      } else {
        // Normal users should not access general replies
        console.log('❌ Access denied - Normal users cannot access general replies');
        return res.status(403).json({ error: 'Access denied - Normal users cannot access general replies' });
      }
    }
    
    const replies = await AdminReply.find(query).sort({ timestamp: 1 });
    
    console.log(`✅ Found ${replies.length} admin replies`);
    res.json(replies);
  } catch (error) {
    console.error('❌ Error fetching admin replies:', error);
    res.status(500).json({ 
      error: 'Server error fetching replies', 
      details: error.message 
    });
  }
};

// ✅ Allow users to reply to admin responses - New endpoint for user replies
export const createUserReply = async (req, res) => {
  try {
    const {
      surveyId,
      questionId,
      commentUniqueId,
      replyText,
      replyToId, // ID of the admin reply being responded to
    } = req.body;

    console.log('👤 User reply submission:', {
      surveyId,
      questionId,
      commentUniqueId,
      replyToId,
      replyText: replyText?.substring(0, 50) + '...',
      userId: req.user?.userId,
      userRole: req.user?.role
    });

    // Validation
    if (!surveyId || !questionId || !commentUniqueId || !replyText) {
      return res.status(400).json({ error: 'Survey ID, question ID, comment ID, and reply text are required' });
    }
    
    // Get user info from token - handle both userId and id fields
    const userId = req.user?.userId || req.user?.id || req.user?._id;
    const userEmail = req.user?.email;
    const userName = req.user?.fname && req.user?.lname 
      ? `${req.user.fname} ${req.user.lname}` 
      : req.user?.username || `User ${userId?.slice(-4) || 'Anonymous'}`;
    
    console.log('🔍 User authentication check:', {
      userId,
      userEmail,
      userName,
      userRole: req.user?.role,
      tokenFields: Object.keys(req.user || {})
    });
    
    if (!userId) {
      console.log('❌ No user ID found in token');
      return res.status(401).json({ error: 'User authentication required - no user ID in token' });
    }
    
    // Verify that the user owns the original comment or is responding to their own comment thread
    // The commentUniqueId format is: surveyId-employeeId-questionId
    // But surveyId contains dashes, so we need to extract differently
    
    // Find the employee ID by looking for a 24-character hex string (MongoDB ObjectId format)
    const commentParts = commentUniqueId.split('-');
    console.log('🔍 Comment ID analysis:', {
      commentUniqueId,
      commentParts,
      totalParts: commentParts.length
    });
    
    // Look for the employee ID (24-character hex string)
    let originalCommentEmployeeId = null;
    for (const part of commentParts) {
      if (part.length === 24 && /^[0-9a-fA-F]+$/.test(part)) {
        originalCommentEmployeeId = part;
        break;
      }
    }
    
    console.log('🔍 Employee ID extraction:', {
      foundEmployeeId: originalCommentEmployeeId,
      currentUserId: String(userId),
      match: originalCommentEmployeeId === String(userId)
    });
    
    if (originalCommentEmployeeId) {
      const userIdStr = String(userId);
      
      // Check if the employee ID matches the current user ID
      if (originalCommentEmployeeId !== userIdStr) {
        console.log('❌ Access denied - User can only reply to their own comments', {
          originalCommentEmployeeId,
          currentUserId: userIdStr,
          match: originalCommentEmployeeId === userIdStr
        });
        return res.status(403).json({ 
          error: 'You can only reply to your own comments',
          debug: {
            originalCommentEmployeeId,
            currentUserId: userIdStr,
            commentUniqueId
          }
        });
      }
    } else {
      console.log('⚠️ Could not extract employee ID from comment ID, allowing reply');
    }

    // Create new user reply
    const newReply = new AdminReply({
      surveyId,
      questionId,
      employeeId: userId,
      commentUniqueId,
      adminId: userId, // For user replies, store user ID in adminId field
      adminName: userName, // Store user name
      replyText: replyText.trim(),
      replyType: 'user_reply',
      replyToId: replyToId || null,
      timestamp: new Date()
    });
    
    const savedReply = await newReply.save();
    
    console.log('✅ Created new user reply');
    
    // 🔔 Notify admin about user reply (if replying to admin)
    if (replyToId) {
      try {
        // Find the admin reply being responded to
        const originalAdminReply = await AdminReply.findById(replyToId);
        if (originalAdminReply && originalAdminReply.replyType === 'admin_reply') {
          // TODO: Implement admin notification about user reply
          console.log('🔔 Should notify admin about user reply:', originalAdminReply.adminId);
        }
      } catch (notificationError) {
        console.error("⚠️ Failed to send user reply notification:", notificationError);
      }
    }
    
    return res.status(201).json({ 
      message: 'User reply created successfully', 
      reply: savedReply 
    });
  } catch (error) {
    console.error('❌ Error saving user reply:', error);
    res.status(500).json({ 
      error: 'Server error saving user reply', 
      details: error.message 
    });
  }
};
