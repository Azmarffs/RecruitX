// routes/skillSuggestionRoutes.js
const express = require('express');
const router = express.Router();
const skillSuggestionController = require('../controllers/skillSuggestionController');
const { verifyToken , authenticateUser } = require('../middleware/authMiddleware');

// C - Only admin can create trigger
router.post('/trigger', verifyToken, authenticateUser, skillSuggestionController.createTrigger);

// R - Applicants can retrieve skill suggestions
router.get('/applicantId/:applicantId',verifyToken, authenticateUser, skillSuggestionController.getSkillSuggestionsByApplicant);

// U - Admin can update skill suggestions
router.put('/update/:suggestionId',verifyToken, authenticateUser, skillSuggestionController.updateSkillSuggestion);

// D - Admin can delete skill suggestions
router.delete('/delete/:suggestionId',verifyToken, authenticateUser, skillSuggestionController.deleteSkillSuggestion);

module.exports = router;