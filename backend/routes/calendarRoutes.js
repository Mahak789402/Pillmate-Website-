
import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { getAuthUrl, googleAuthCallback, syncSchedule } from '../controllers/calendarController.js';

const router = express.Router();

router.get('/auth', protect, getAuthUrl);
router.get('/callback', googleAuthCallback); // Configured in Google Console as Callback
router.post('/sync', protect, syncSchedule);

export default router;
