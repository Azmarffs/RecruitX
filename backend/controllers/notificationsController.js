const notificationModel = require("../models/notificationsModel");

// Get all notifications
const getAllNotificationsController = async (req, res) => 
{
    try 
    {
        const notifications = await notificationModel.getAllNotifications();
        res.status(200).json(notifications);
    } 
    catch (error) 
    {
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};

// Get notifications by user email
const getNotificationsByEmailController = async (req, res) => 
{
    try 
    {
        const { email } = req.params;
        if (!email) 
        {
            return res.status(400).json({ message: 'Email is required' });
        }
        const notifications = await notificationModel.getNotificationsByEmail(email);
        res.status(200).json(notifications);
    } 
    catch (error) 
    {
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};

// Create a notification
const createNotificationController = async (req, res) => 
{
    try 
    {
        const { email, notificationText } = req.body;
        if (!email || !notificationText) 
        {
            return res.status(400).json({ message: 'Both fields are required' });
        }
        await notificationModel.createNotification(email, notificationText);
        res.status(201).json({ success: true, message: "Notification created successfully" });
    } 
    catch (error) 
    {
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};

// Delete a notification
const deleteNotificationController = async (req, res) => 
{
    try 
    {
        const { notificationId } = req.params;
        if (!notificationId) 
        {
            return res.status(400).json({ message: 'Notification is required' });
        }
        await notificationModel.deleteNotification(notificationId);
        res.status(200).json({ success: true, message: "Notification deleted successfully" });
    } 
    catch (error) 
    {
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};

module.exports = 
{ 
    getAllNotificationsController,
    getNotificationsByEmailController,
    createNotificationController,
    deleteNotificationController
};
