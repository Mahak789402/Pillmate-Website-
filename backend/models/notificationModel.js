
import mongoose from 'mongoose';

const notificationSchema = mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        message: {
            type: String,
            required: true,
        },
        type: {
            type: String,
            enum: ['Reminder', 'Alert', 'System'],
            default: 'Reminder',
        },
        read: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

const Notification = mongoose.model('Notification', notificationSchema);

export default Notification;
