const express = require("express");
const router = express.Router();
const applicantSkillsController = require("../controllers/applicantSkillsController");
const { verifyToken, authenticateUser } = require("../middleware/authMiddleware"); // Ensure authentication

router.post("/add", verifyToken, authenticateUser, applicantSkillsController.addSkillController);
router.get("/:applicantId", verifyToken, authenticateUser, applicantSkillsController.getSkillsController);
router.put("/update/:skillId", verifyToken, authenticateUser, applicantSkillsController.updateSkillController);
router.delete("/delete/:skillId", verifyToken, authenticateUser, applicantSkillsController.deleteSkillController);
router.delete("/deleteAll/:applicantId", verifyToken, authenticateUser, applicantSkillsController.deleteAllSkillsController);

module.exports = router;