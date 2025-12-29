
import express from 'express';
const router = express.Router();
import {
    getMedicines,
    getMedicineById,
    createMedicine,
    updateMedicine,
    deleteMedicine,
} from '../controllers/medicineController.js';
import { protect } from '../middleware/authMiddleware.js';

router.route('/')
    .get(protect, getMedicines)
    .post(protect, createMedicine);

router.route('/:id')
    .get(protect, getMedicineById)
    .put(protect, updateMedicine)
    .delete(protect, deleteMedicine);

export default router;
