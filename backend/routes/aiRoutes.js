
import express from 'express';
const router = express.Router();
import { getInsights, chatQuery } from '../controllers/aiController.js';
import { protect } from '../middleware/authMiddleware.js';

router.get('/insights', protect, getInsights);
router.post('/chat', protect, chatQuery);

export default router;
