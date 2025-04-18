// routes/messageRoutes.js
const express = require("express");
const router = express.Router();
const { verifyToken, authenticateUser } = require("../middleware/authMiddleware");
const messageController = require("../controllers/messagesController");

// C - Send a new message
router.post("/send",verifyToken , authenticateUser, messageController.sendMessageController);

// R - Fetch all messages between two users
router.get("/:email1/:email2",verifyToken , authenticateUser, messageController.getAllMessagesController);

// U - Update an existing message
router.put("/update",verifyToken,  authenticateUser , messageController.updateMessageController);

// D - Delete a message
router.delete("/delete",verifyToken, authenticateUser, messageController.deleteMessageController);

module.exports = router;