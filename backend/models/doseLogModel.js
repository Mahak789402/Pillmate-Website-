
import mongoose from 'mongoose';

const doseLogSchema = mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        medicine: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'Medicine',
        },
        scheduledAt: {
            type: Date,
            required: true,
        },
        takenAt: {
            type: Date,
        },
        status: {
            type: String,
            enum: ['Taken', 'Missed', 'Skipped', 'Pending'],
            default: 'Pending',
        },
        symptoms: {
            type: String,
        },
        sideEffects: {
            type: String,
        },
        notes: {
            type: String,
        },
    },
    {
        timestamps: true,
    }
);

const DoseLog = mongoose.model('DoseLog', doseLogSchema);

export default DoseLog;
