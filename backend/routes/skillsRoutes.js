// routes/skillsRoutes.js
const express = require('express');
const router = express.Router();
const skillsController = require('../controllers/skillsController');
const { verifyToken , authenticateUser } = require('../middleware/authMiddleware');

// C - Only admin can add skills
router.post('/',authenticateUser, verifyToken, skillsController.createSkillController);

// R - Public routes
router.get('/', skillsController.getAllSkillsController);
router.get('/id/:skillId', skillsController.getSkillByIdController);
router.get('/name/:skillName', skillsController.getSkillByNameController);

// U - Only admin can update skills
router.put('/id/:skillId',verifyToken , authenticateUser, skillsController.updateSkillByIdController);
router.put('/name/:skillName',verifyToken , authenticateUser , skillsController.updateSkillByNameController);

// D - Only admin can delete skills
router.delete('/id/:skillId',verifyToken , authenticateUser , skillsController.deleteSkillByIdController);
router.delete('/name/:skillName',verifyToken, authenticateUser , skillsController.deleteSkillByNameController);

module.exports = router;