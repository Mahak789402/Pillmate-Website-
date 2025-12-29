
import asyncHandler from 'express-async-handler';
import DoseLog from '../models/doseLogModel.js';

// @desc    Log a dose (Taken/Missed/Skipped)
// @route   POST /api/logs
// @access  Private
const createDoseLog = asyncHandler(async (req, res) => {
    const { medicine, medicineId, scheduledAt, takenAt, status, symptoms, sideEffects, notes } = req.body;

    const medId = medicine || medicineId;

    if (!medId) {
        res.status(400);
        throw new Error('Medicine ID is required');
    }

    // Check if there is a pending log for this medicine today
    const now = new Date();
    const startOfDay = new Date(now.setHours(0, 0, 0, 0));
    const endOfDay = new Date(now.setHours(23, 59, 59, 999));

    let log = await DoseLog.findOne({
        user: req.user._id,
        medicine: medId,
        status: 'Pending',
        scheduledAt: { $gte: startOfDay, $lte: endOfDay }
    });

    if (log) {
        // Update existing pending log
        log.status = status;
        log.takenAt = takenAt || new Date();
        if (symptoms) log.symptoms = symptoms;
        if (sideEffects) log.sideEffects = sideEffects;
        if (notes) log.notes = notes;
        await log.save();
    } else {
        // Create new log (fallback)
        log = await DoseLog.create({
            user: req.user._id,
            medicine: medId,
            scheduledAt: scheduledAt || new Date(),
            takenAt: takenAt || new Date(),
            status,
            symptoms,
            sideEffects,
            notes,
        });
    }

    // Logic 1: Real-time Refill Management
    if (status === 'Taken') {
        const Medicine = (await import('../models/medicineModel.js')).default;
        const medicine = await Medicine.findById(medId);

        if (medicine) {
            // Decrement stock
            medicine.currentStock = Math.max(0, medicine.currentStock - 1);
            await medicine.save();

            // Check Threshold
            if (medicine.currentStock <= medicine.refillThreshold) {
                const Notification = (await import('../models/notificationModel.js')).default;

                // Check if we already sent a refill alert today to avoid spam?
                // For 'Professional' logic, we just alert.
                const message = `⚠️ Refill Alert: ${medicine.name} is running low (${medicine.currentStock} left)`;

                await Notification.create({
                    user: req.user._id,
                    message,
                    type: 'Alert',
                });
            }
        }
    }

    res.status(201).json(log);
});

// @desc    Get all logs for user
// @route   GET /api/logs
// @access  Private
const getDoseLogs = asyncHandler(async (req, res) => {
    const logs = await DoseLog.find({ user: req.user._id }).populate('medicine', 'name dosage');
    res.json(logs);
});

// @desc    Get logs for specific medicine
// @route   GET /api/logs/:medicineId
// @access  Private
const getDoseLogsByMedicine = asyncHandler(async (req, res) => {
    const logs = await DoseLog.find({ user: req.user._id, medicine: req.params.medicineId });
    res.json(logs);
});

export { createDoseLog, getDoseLogs, getDoseLogsByMedicine };
