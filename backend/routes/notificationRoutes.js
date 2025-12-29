
import express from 'express';
const router = express.Router();
import {
    getNotifications,
    markNotificationRead,
    deleteNotification,
} from '../controllers/notificationController.js';
import { protect } from '../middleware/authMiddleware.js';

router.route('/').get(protect, getNotifications);
router.route('/:id').put(protect, markNotificationRead).delete(protect, deleteNotification);

export default router;
