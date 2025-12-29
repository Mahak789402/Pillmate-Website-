
import asyncHandler from 'express-async-handler';
import Notification from '../models/notificationModel.js';

// @desc    Get all notifications for user
// @route   GET /api/notifications
// @access  Private
const getNotifications = asyncHandler(async (req, res) => {
    const notifications = await Notification.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(notifications);
});

// @desc    Mark notification as read
// @route   PUT /api/notifications/:id
// @access  Private
const markNotificationRead = asyncHandler(async (req, res) => {
    const notification = await Notification.findById(req.params.id);

    if (notification && notification.user.toString() === req.user._id.toString()) {
        notification.read = true;
        const updatedNotification = await notification.save();
        res.json(updatedNotification);
    } else {
        res.status(404);
        throw new Error('Notification not found');
    }
});

// @desc    Delete notification
// @route   DELETE /api/notifications/:id
// @access  Private
const deleteNotification = asyncHandler(async (req, res) => {
    const notification = await Notification.findById(req.params.id);

    if (notification && notification.user.toString() === req.user._id.toString()) {
        await notification.deleteOne();
        res.json({ message: 'Notification removed' });
    } else {
        res.status(404);
        throw new Error('Notification not found');
    }
});

export { getNotifications, markNotificationRead, deleteNotification };
