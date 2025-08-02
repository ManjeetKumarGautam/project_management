import { Notification } from "../models/notification.js";

export const getUserNotifications = async (req, res) => {
    try {
        const userId = req.user._id;

        const notifications = await Notification.find({ user: userId }).
            populate('user', 'name')
            .sort({ createdAt: -1 });


        res.status(200).json(notifications);
    } catch (error) {
        console.error("Error fetching notifications:", error);
        res.status(500).json({ message: "Failed to fetch notifications" });
    }
};

export const updateNotificationRead = async (req, res) => {
    try {
        const userId = req.user._id;
        const { notifyId } = req.params;

        const notify = await Notification.findById(notifyId);

        if (notify.user._id.toString() != userId.toString()) {
            return res.status(403).json({
                message: "You don't have permission.",
            });
        }

        notify.isRead = true;

        notify.save();

        res.status(200).json({ message: "updated notification read status" });

    }
    catch (error) {
        console.error("Error update notification read status:", error);
        res.status(500).json({ message: "Failed to update notification read status" });
    }
}