import express from 'express';
import complianceTestRoutes from './complianceTest.route.js';
import questionBankRoutes from './questionBank.routes.js';
import complianceLockRoutes from './complianceLock.routes.js';
import apiRoutes from './api.route.js';

const router = express.Router();

router.use('/api', apiRoutes);
router.use('/compliance-test', complianceTestRoutes);
router.use('/question-bank', questionBankRoutes);
router.use('/lock', complianceLockRoutes);

export default router;