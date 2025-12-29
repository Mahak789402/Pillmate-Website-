
import cron from 'node-cron';
import Medicine from '../models/medicineModel.js';
import Notification from '../models/notificationModel.js';
import User from '../models/userModel.js';
import sendEmail from './sendEmail.js';

const initCronJobs = () => {
    // Check for dose reminders every minute
    cron.schedule('* * * * *', async () => {
        try {
            const now = new Date();
            const hours = String(now.getHours()).padStart(2, '0');
            const minutes = String(now.getMinutes()).padStart(2, '0');
            const currentTime = `${hours}:${minutes}`;

            // Find medicines scheduled for this time
            const medicines = await Medicine.find({
                times: { $in: [currentTime] },
                startDate: { $lte: now },
                $or: [{ endDate: { $exists: false } }, { endDate: { $gte: now } }],
            }).populate('user');

            for (const med of medicines) {
                // Create Notification
                const message = `It's time to take your medicine: ${med.name} (${med.dosage})`;
                await Notification.create({
                    user: med.user._id,
                    message,
                    type: 'Reminder',
                });

                // Create DoseLog entry (Pending)
                // Check if log already exists for this specific time today to prevent duplicates
                const todayStart = new Date(now.setHours(0, 0, 0, 0));
                const existingLog = await import('../models/doseLogModel.js').then(m => m.default.findOne({
                    user: med.user._id,
                    medicine: med._id,
                    scheduledAt: {
                        $gte: todayStart,
                        $lte: new Date(now.setHours(23, 59, 59, 999))
                    },
                    // We might need a more specific check if a med is taken multiple times a day
                    // For now, let's assume we check if one exists created effectively 'now' (within last min)
                    // Or better, check if we simply rely on the fact that this runs once per min.
                    // But to be safe, let's just create it. 
                }));

                // More robust: Create a new log everytime this triggers (every scheduled time)
                // We construct the scheduled date object
                const [h, m] = currentTime.split(':');
                const scheduledTime = new Date();
                scheduledTime.setHours(parseInt(h), parseInt(m), 0, 0);

                await import('../models/doseLogModel.js').then(m => m.default.create({
                    user: med.user._id,
                    medicine: med._id,
                    status: 'Pending',
                    scheduledAt: scheduledTime
                }));

                // Send Email if enabled
                if (med.user.preferences.notifications && process.env.EMAIL_USER) {
                    await sendEmail({
                        email: med.user.email,
                        subject: 'PillMate Reminder',
                        message,
                    });
                }
            }
        } catch (error) {
            console.error('Cron job error:', error);
        }
    });

    // MARK MISSED DOSES (Every 15 minutes)
    cron.schedule('*/15 * * * *', async () => {
        try {
            const DoseLog = await import('../models/doseLogModel.js').then(m => m.default);
            const now = new Date();
            const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);

            // Find logs that are 'Pending' and scheduled more than 1 hour ago
            const missedLogs = await DoseLog.find({
                status: 'Pending',
                scheduledAt: { $lt: oneHourAgo }
            }).populate('user').populate('medicine');

            for (const log of missedLogs) {
                log.status = 'Missed';
                await log.save();

                // Create Notification for Missed Dose
                const message = `Missed Dose Alert: You missed your ${log.medicine.name} scheduled for ${log.scheduledAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}.`;

                await Notification.create({
                    user: log.user._id,
                    message,
                    type: 'Alert',
                });

                // Optional: Send Email for missed dose
                if (log.user.preferences.notifications && process.env.EMAIL_USER) {
                    await sendEmail({
                        email: log.user.email,
                        subject: 'PillMate Missed Dose Alert',
                        message,
                    });
                }

                // Caregiver Alert
                const Caregiver = await import('../models/caregiverModel.js').then(m => m.default);
                const caregivers = await Caregiver.find({ user: log.user._id });

                for (const cg of caregivers) {
                    if (process.env.EMAIL_USER) {
                        await sendEmail({
                            email: cg.email,
                            subject: `[Caregiver Alert] Missed Dose: ${log.user.name}`,
                            message: `Alert: Your patient ${log.user.name} missed their scheduled dose of ${log.medicine.name} at ${log.scheduledAt.toLocaleTimeString()}.`,
                        });
                    }
                }
            }

        } catch (error) {
            console.error('Missed dose cron error:', error);
        }
    });

    // Check for refill reminders daily at 9:00 AM
    cron.schedule('0 9 * * *', async () => {
        try {
            const medicines = await Medicine.find({}).populate('user');

            for (const med of medicines) {
                if (med.currentStock <= med.refillThreshold) {
                    const message = `Refill Alert: Your ${med.name} is running low (${med.currentStock} left).`;
                    await Notification.create({
                        user: med.user._id,
                        message,
                        type: 'Alert',
                    });

                    if (med.user.preferences.notifications && process.env.EMAIL_USER) {
                        await sendEmail({
                            email: med.user.email,
                            subject: 'PillMate Refill Alert',
                            message,
                        });
                    }
                }
            }
        } catch (error) {
            console.error('Refill cron error:', error);
        }
    });

    console.log('Cron jobs initialized');
};

export default initCronJobs;
