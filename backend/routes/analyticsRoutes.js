
import express from 'express';
const router = express.Router();
import { getDashboardStats } from '../controllers/analyticsController.js';
import { protect } from '../middleware/authMiddleware.js';

router.get('/dashboard', protect, getDashboardStats);

export default router;
