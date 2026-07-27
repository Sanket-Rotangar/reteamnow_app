import express from 'express';
import {
  createSurvey,
  getActiveSurveys,
  getSurveyById,
  submitSurveyResponse,
  getSurveyReports,
  getUserOwnFeedback,
  checkUserSurveyCompletion,
  deleteSurvey
} from '../controllers/surveyController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import requireAdminOrSuperAdmin from '../middlewares/requireAdminOrSuperAdmin.js';

const router = express.Router();

// ✅ POST /survey — Save full survey with questions
router.post('/', authMiddleware, requireAdminOrSuperAdmin, createSurvey);

// ✅ GET /surveys/active — Fetch all active surveys (with team filtering for regular users)
router.get('/active', authMiddleware, getActiveSurveys);

// ✅ GET /surveys/report — Get survey data with responses for feedback (Super Admin/Admin only)
router.get('/report', authMiddleware, requireAdminOrSuperAdmin, getSurveyReports);

// ✅ GET /surveys/my-feedback — Get user's own feedback and admin replies (All authenticated users)
router.get('/my-feedback', authMiddleware, getUserOwnFeedback);

// ✅ GET /surveys/completion-status — Check if user has completed specific surveys (for dashboard blocking)
router.get('/completion-status', authMiddleware, checkUserSurveyCompletion);

// ✅ GET /survey/:surveyId — Fetch a specific survey's questions (with team-based access control)
router.get('/:surveyId', authMiddleware, getSurveyById);

// ✅ POST /survey/submit — Submit survey responses (with team-based access control)
router.post('/submit', authMiddleware, submitSurveyResponse);

// ✅ DELETE /survey/:surveyId — Delete a survey (Admin/SuperAdmin only)
router.delete('/:surveyId', authMiddleware, requireAdminOrSuperAdmin, deleteSurvey);

export default router;
