// routes/notificationRoutes.js
const express = require("express");
const router = express.Router();
const notificationController = require("../controllers/notificationsController");

// C - Create a new notification
router.post("/", notificationController.createNotificationController);

// R - Fetch all notifications (Accessible to everyone)
router.get("/", notificationController.getAllNotificationsController);

// R - Fetch notifications by user email
router.get("/byemail/:email", notificationController.getNotificationsByEmailController);

// D - Delete a notification by ID
router.delete("/:notificationId", notificationController.deleteNotificationController);

module.exports = router;