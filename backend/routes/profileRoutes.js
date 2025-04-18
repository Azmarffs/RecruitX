// routes/profileRoutes.js
const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');
const { verifyToken, authenticateUser } = require('../middleware/authMiddleware');

// C - Create a new profile
// Not necessarily needed as all the profiles are made in registering the user
router.post('/', verifyToken, authenticateUser, profileController.createProfileController);

// R - Fetch all profiles (Accessible to everyone)
router.get('/', profileController.getAllProfilesController);

// R - Fetch profile by ID
router.get('/id/:id', profileController.getProfileByIdController);

// R - Fetch profile by Email
router.get('/email/:email', verifyToken, profileController.getProfileByEmailController);

// R - Fetch profile by user ID
router.get('/userId/:userId', profileController.getProfileByUserIdController);

// U - Update profile by ID (User must be authenticated)
//profile Id
router.put('/updateId/:id',verifyToken, authenticateUser, profileController.updateProfileByIdController);

// D - Delete profile by ID (User must be authenticated)
router.delete('/deleteId/:id', verifyToken, authenticateUser, profileController.deleteProfileByIdController);

module.exports = router;