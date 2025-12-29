
import asyncHandler from 'express-async-handler';
import DoseLog from '../models/doseLogModel.js';
import Medicine from '../models/medicineModel.js';

// @desc    Get dashboard stats
// @route   GET /api/analytics/dashboard
// @access  Private
const getDashboardStats = asyncHandler(async (req, res) => {
    const totalMedicines = await Medicine.countDocuments({ user: req.user._id });

    const now = new Date();
    const startOfDay = new Date(now.setHours(0, 0, 0, 0));
    const endOfDay = new Date(now.setHours(23, 59, 59, 999));

    // Today's logs
    const todayLogs = await DoseLog.find({
        user: req.user._id,
        scheduledAt: { $gte: startOfDay, $lte: endOfDay },
    });

    const takenCount = todayLogs.filter(log => log.status === 'Taken').length;
    const missedCount = todayLogs.filter(log => log.status === 'Missed').length;
    const skippedCount = todayLogs.filter(log => log.status === 'Skipped').length;
    const pendingCount = todayLogs.filter(log => log.status === 'Pending').length;

    // Calculate adherence (Last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const monthLogs = await DoseLog.find({
        user: req.user._id,
        scheduledAt: { $gte: thirtyDaysAgo },
        status: { $in: ['Taken', 'Missed', 'Skipped'] } // Only count resolved doses
    });

    let adherenceScore = 0;
    if (monthLogs.length > 0) {
        const monthTaken = monthLogs.filter(log => log.status === 'Taken').length;
        adherenceScore = (monthTaken / monthLogs.length) * 100;
    }

    res.json({
        totalMedicines,
        todayStats: {
            taken: takenCount,
            missed: missedCount,
            skipped: skippedCount,
            pending: pendingCount,
        },
        todayLogs, // Include the actual logs
        adherenceScore: Math.round(adherenceScore),
    });
});

export { getDashboardStats };
