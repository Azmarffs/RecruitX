const express = require('express');
const router = express.Router();
const interviewsController = require('../controllers/interviewsController');
const { verifyToken, authenticateUser } = require('../middleware/authMiddleware');

// C recruiter will schedule the interview
router.post('/',authenticateUser, verifyToken, interviewsController.postInterviewController);

// R anyone can check interviews 
router.get('/', interviewsController.getInterviewsController);
//get interview by Id
router.get('/interviewId/:interviewId', interviewsController.getInterviewByInterviewIdController);
//get interview by applicant id
router.get('/applicantId/:applicantId',verifyToken, authenticateUser, interviewsController.getInterviewByApplicantIdController);

// U put interview date by recruiter
router.put('/interviewId/:interviewId',verifyToken , authenticateUser, interviewsController.updateInterviewDateController);

// D delete an interview by recruiter
router.delete('/interviewId/:interviewId',verifyToken , authenticateUser, interviewsController.deleteInterviewByInterviewIdController);

module.exports = router;