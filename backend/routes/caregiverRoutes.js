
import express from 'express';
const router = express.Router();
import { getCaregivers, addCaregiver, deleteCaregiver, getAssignedPatients, getPatientData } from '../controllers/caregiverController.js';
import { protect } from '../middleware/authMiddleware.js';

router.route('/')
    .get(protect, getCaregivers)
    .post(protect, addCaregiver);

router.route('/patients').get(protect, getAssignedPatients);
router.route('/patients/:patientId').get(protect, getPatientData);

router.route('/:id').delete(protect, deleteCaregiver);

export default router;
