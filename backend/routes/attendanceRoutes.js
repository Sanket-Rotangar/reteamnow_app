import express from 'express';
import {
  checkIn,
  checkOut,
  getToday,
  getHistory,
} from '../controllers/attendanceController.js';

const router = express.Router();

router.post('/checkin', checkIn);

router.post('/checkout', checkOut);

router.get('/today/:userId', getToday);

router.get('/history/:userId', getHistory);

export default router;
