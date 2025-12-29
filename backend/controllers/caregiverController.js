
import asyncHandler from 'express-async-handler';
import Caregiver from '../models/caregiverModel.js';

// @desc    Get all caregivers
// @route   GET /api/caregivers
// @access  Private
const getCaregivers = asyncHandler(async (req, res) => {
    const caregivers = await Caregiver.find({ user: req.user._id });
    res.json(caregivers);
});

// @desc    Add caregiver
// @route   POST /api/caregivers
// @access  Private
const addCaregiver = asyncHandler(async (req, res) => {
    const { name, email, phone, relationship } = req.body;

    const caregiver = await Caregiver.create({
        user: req.user._id,
        name,
        email,
        phone,
        relationship,
    });

    res.status(201).json(caregiver);
});

// @desc    Delete caregiver
// @route   DELETE /api/caregivers/:id
// @access  Private
const deleteCaregiver = asyncHandler(async (req, res) => {
    const caregiver = await Caregiver.findById(req.params.id);

    if (caregiver && caregiver.user.toString() === req.user._id.toString()) {
        await caregiver.deleteOne();
        res.json({ message: 'Caregiver removed' });
    } else {
        res.status(404);
        throw new Error('Caregiver not found');
    }
});

// @desc    Get patients who have added me as caregiver
// @route   GET /api/caregivers/patients
// @access  Private
const getAssignedPatients = asyncHandler(async (req, res) => {
    // Find Caregiver entries where 'email' matches logged in user's email
    // This assumes the user (caregiver) has the same email as listed in the patient's caregiver list
    const relationships = await Caregiver.find({ email: req.user.email }).populate('user', 'name email');

    // Extract unique users (patients)
    const patients = relationships.map(rel => rel.user);
    // Remove duplicates if any
    const uniquePatients = [...new Map(patients.map(p => [p._id, p])).values()];

    res.json(uniquePatients);
});

// @desc    Get patient data (Medicines & Recent Logs)
// @route   GET /api/caregivers/patients/:patientId
// @access  Private
const getPatientData = asyncHandler(async (req, res) => {
    const { patientId } = req.params;

    // Verify relationship
    const relationship = await Caregiver.findOne({
        user: patientId,
        email: req.user.email
    });

    if (!relationship) {
        res.status(403);
        throw new Error('Not authorized to view this patient data');
    }

    const Medicine = (await import('../models/medicineModel.js')).default;
    const DoseLog = (await import('../models/doseLogModel.js')).default;
    const Notification = (await import('../models/notificationModel.js')).default;

    const medicines = await Medicine.find({ user: patientId });

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    // Today's logs
    const todayLogs = await DoseLog.find({
        user: patientId,
        scheduledAt: { $gte: startOfDay }
    }).populate('medicine', 'name');

    // Recent Alerts
    const alerts = await Notification.find({
        user: patientId,
        type: { $in: ['Alert', 'Missed'] }
    }).sort({ createdAt: -1 }).limit(5);

    res.json({
        medicines,
        todayLogs,
        alerts
    });
});

export { getCaregivers, addCaregiver, deleteCaregiver, getAssignedPatients, getPatientData };
