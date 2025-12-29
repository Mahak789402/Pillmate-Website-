
import mongoose from 'mongoose';

const caregiverSchema = mongoose.Schema(
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
        email: {
            type: String,
            required: true,
        },
        phone: {
            type: String,
        },
        relationship: {
            type: String,
        },
        isVerified: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

const Caregiver = mongoose.model('Caregiver', caregiverSchema);

export default Caregiver;
