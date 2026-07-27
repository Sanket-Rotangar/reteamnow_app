import express from 'express';
import * as questionBankController from '../controllers/questionBankController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import requireAdminOrSuperAdmin from '../middlewares/requireAdminOrSuperAdmin.js';

const router = express.Router();

// Question Bank routes (Super Admin only)
router.post('/question-bank', authMiddleware, requireAdminOrSuperAdmin, questionBankController.createQuestionBank);
router.get('/question-banks', authMiddleware, questionBankController.getAllQuestionBanks);
router.get('/question-bank/:questionBankId', authMiddleware, questionBankController.getQuestionBankDetails);
router.get('/question-bank/:questionBankId/responses', authMiddleware, requireAdminOrSuperAdmin, questionBankController.getQuestionBankDetailedResponses);

// Employee Test Generation routes (Super Admin only)
router.post('/generate-employee-test', authMiddleware, requireAdminOrSuperAdmin, questionBankController.generateEmployeeTest);
router.get('/available-employees', authMiddleware, requireAdminOrSuperAdmin, questionBankController.getAvailableEmployees);

// Employee Test Taking routes
router.get('/employee-test/:testId', authMiddleware, questionBankController.getEmployeeTest);

export default router;
