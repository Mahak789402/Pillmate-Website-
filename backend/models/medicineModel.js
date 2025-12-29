
import mongoose from 'mongoose';

const medicineSchema = mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        name: {
            type: String,
            required: true,
        },
        dosage: {
            type: String,
            required: true,
        },
        frequency: {
            type: String, // e.g., 'Daily', 'Weekly', '2 times a day'
            required: true,
        },
        times: [{
            type: String, // e.g., '08:00', '20:00'
            required: true,
        }],
        startDate: {
            type: Date,
            required: true,
        },
        endDate: {
            type: Date,
        },
        refillThreshold: {
            type: Number,
            default: 5,
        },
        currentStock: {
            type: Number,
            required: true,
            default: 0,
        },
    },
    {
        timestamps: true,
    }
);

const Medicine = mongoose.model('Medicine', medicineSchema);

export default Medicine;
