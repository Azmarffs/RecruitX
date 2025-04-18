// routes/resumeRoutes.js
const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const { verifyToken, authenticateUser } = require("../middleware/authMiddleware");
const resumeController = require("../controllers/resumeController");

// C - Upload resume (User must be authenticated)
//router.post("/upload",verifyToken , authenticateUser, upload.single("resume"), resumeController.uploadResumeController);

// R - Retrieve resume by email (Accessible to everyone)
router.get("/byemail/:email", resumeController.getResumeByEmailController);

// D - Delete resume (User must be authenticated)
router.delete("/:email", verifyToken, authenticateUser , resumeController.deleteResumeController);

module.exports = router;