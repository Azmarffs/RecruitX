// routes/reviewsRoutes.js
const express = require('express');
const router = express.Router();
const reviewsController = require('../controllers/reviewsController');
const { verifyToken ,authenticateUser } = require('../middleware/authMiddleware');

// C Post a review (only applicants can review recruiters)
router.post('/',verifyToken , authenticateUser , reviewsController.postReviewController);

// R Get all reviews
router.get('/', reviewsController.getReviewsController);
// Get reviews for a specific recruiter
router.get('/recruiterId/:recruiterId', reviewsController.getReviewsByRecruiterIdController);
// Get reviews by an applicant
router.get('/applicantId/:applicantId', verifyToken , authenticateUser, reviewsController.getReviewsByApplicantIdController);

// U Update a review (only the applicant who posted it can update)
router.put('/updateReview/:reviewId',verifyToken, authenticateUser, reviewsController.updateReviewController);

// D Delete a review (only the applicant who posted it can delete)
router.delete('/deleteReview/:reviewId',verifyToken, authenticateUser, reviewsController.deleteReviewController);

module.exports = router;