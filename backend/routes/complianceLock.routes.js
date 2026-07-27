import express from 'express';
import {
  testConnection,
  checkUserLockStatus,
  recordTestAttempt,
  getTestDisclaimer,
  resetUserAttempts,
  getLockedUsers,
  unlockUser,
  getUserComplianceOverview,
  getUserComplianceStatus
} from '../controllers/complianceLockController.js';

const router = express.Router();

// Test connection endpoint
router.get('/test', testConnection);

// Check if user is locked from taking a specific compliance test
router.get('/check-lock/:employeeId/:questionBankId', checkUserLockStatus);

// Get test disclaimer information
router.get('/disclaimer/:employeeId/:questionBankId', getTestDisclaimer);

// Record a new compliance test attempt
router.post('/record-attempt', recordTestAttempt);

// Reset user attempts (HR action)
router.post('/reset-attempts', resetUserAttempts);

// HR Management Routes
router.get('/hr/locked-users', getLockedUsers);
router.post('/hr/unlock/:userId/:testId', unlockUser);
router.get('/hr/user-overview/:userId', getUserComplianceOverview);

// User compliance status for profile indicator
router.get('/user-status/:email', getUserComplianceStatus);

export default router;