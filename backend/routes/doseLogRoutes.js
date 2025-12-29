
import express from 'express';
const router = express.Router();
import {
    createDoseLog,
    getDoseLogs,
    getDoseLogsByMedicine,
} from '../controllers/doseLogController.js';
import { protect } from '../middleware/authMiddleware.js';

router.route('/')
    .post(protect, createDoseLog)
    .get(protect, getDoseLogs);

router.route('/:medicineId').get(protect, getDoseLogsByMedicine);

export default router;
