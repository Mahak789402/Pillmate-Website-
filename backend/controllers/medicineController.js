
import asyncHandler from 'express-async-handler';
import Medicine from '../models/medicineModel.js';

// @desc    Get all medicines for logged in user
// @route   GET /api/medicines
// @access  Private
const getMedicines = asyncHandler(async (req, res) => {
    const medicines = await Medicine.find({ user: req.user._id });
    res.json(medicines);
});

// @desc    Get single medicine
// @route   GET /api/medicines/:id
// @access  Private
const getMedicineById = asyncHandler(async (req, res) => {
    const medicine = await Medicine.findById(req.params.id);

    if (medicine && medicine.user.toString() === req.user._id.toString()) {
        res.json(medicine);
    } else {
        res.status(404);
        throw new Error('Medicine not found');
    }
});

// @desc    Create a medicine
// @route   POST /api/medicines
// @access  Private
const createMedicine = asyncHandler(async (req, res) => {
    const { name, dosage, frequency, times, startDate, endDate, refillThreshold, currentStock } = req.body;

    // Calculate stock if not provided and dates available
    let stock = currentStock;
    if ((stock === undefined || stock === 0) && startDate && endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        const diffTime = Math.abs(end - start);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        // Simple logic: Dose per day * days.
        // If frequency is 'Daily', 1 * days * times.length
        // If frequency is '2 times a day', it should be consistent with times.length

        if (frequency.toLowerCase().includes('daily') || times.length > 0) {
            stock = diffDays * (times.length || 1);
        }
    }

    const medicine = await Medicine.create({
        user: req.user._id,
        name,
        dosage,
        frequency,
        times,
        startDate,
        endDate,
        refillThreshold,
        currentStock: stock || 0,
    });

    res.status(201).json(medicine);
});

// @desc    Update a medicine
// @route   PUT /api/medicines/:id
// @access  Private
const updateMedicine = asyncHandler(async (req, res) => {
    const { name, dosage, frequency, times, startDate, endDate, refillThreshold, currentStock } = req.body;

    const medicine = await Medicine.findById(req.params.id);

    if (medicine && medicine.user.toString() === req.user._id.toString()) {
        medicine.name = name || medicine.name;
        medicine.dosage = dosage || medicine.dosage;
        medicine.frequency = frequency || medicine.frequency;
        medicine.times = times || medicine.times;
        medicine.startDate = startDate || medicine.startDate;
        medicine.endDate = endDate || medicine.endDate;
        medicine.refillThreshold = refillThreshold !== undefined ? refillThreshold : medicine.refillThreshold;
        medicine.currentStock = currentStock !== undefined ? currentStock : medicine.currentStock;

        const updatedMedicine = await medicine.save();
        res.json(updatedMedicine);
    } else {
        res.status(404);
        throw new Error('Medicine not found');
    }
});

// @desc    Delete a medicine
// @route   DELETE /api/medicines/:id
// @access  Private
const deleteMedicine = asyncHandler(async (req, res) => {
    const medicine = await Medicine.findById(req.params.id);

    if (medicine && medicine.user.toString() === req.user._id.toString()) {
        await medicine.deleteOne();
        res.json({ message: 'Medicine removed' });
    } else {
        res.status(404);
        throw new Error('Medicine not found');
    }
});

export {
    getMedicines,
    getMedicineById,
    createMedicine,
    updateMedicine,
    deleteMedicine,
};
