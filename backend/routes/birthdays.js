// @ts-nocheck
import express from 'express';
import {
    getTodaysBirthdays,
    getUpcomingBirthdays,
    getTodaysAnniversaries,
    getUpcomingAnniversaries,
    getNewJoinees,
    createEmployee,
    updateEmployee,
    getAllEmployees,
    getEmployeeById
} from '../controllers/birthdayController.js';

const router = express.Router();

// Birthday routes
router.get('/today', getTodaysBirthdays);
router.get('/upcoming', getUpcomingBirthdays);

// Anniversary routes
router.get('/anniversaries/today', getTodaysAnniversaries);
router.get('/anniversaries/upcoming', getUpcomingAnniversaries);

// New joinees route
router.get('/newjoinees', getNewJoinees);

// Employee management routes
router.post('/employees', createEmployee);
router.put('/employees/:id', updateEmployee);
router.get('/employees', getAllEmployees);
router.get('/employees/:id', getEmployeeById);

export default router;