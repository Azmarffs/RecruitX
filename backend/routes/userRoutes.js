// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { verifyToken, authenticateUser } = require('../middleware/authMiddleware');

// C - Register a new user
router.post('/register', userController.registerUserController);

// C - Login an existing user
router.post('/login', userController.loginUserController);

// R - Fetch all users (Accessible to everyone)
router.get('/', userController.getAllUsersController);

// R - Fetch user by ID
router.get('/id/:id', userController.getUserByIdController);

// R - Fetch user by email
router.get('/email/:email', userController.getUserByEmailController);

// U - Update user details (User can only update their own account)
router.put('/update/:email', verifyToken, authenticateUser, userController.updateUserByEmailController);

// D - Delete user by ID (User can only delete their own account)
router.delete('/delete/id/:userId', verifyToken, authenticateUser , userController.deleteUserByIdController);

// D - Delete user by email (User can only delete their own account)
router.delete('/delete/email/:email', verifyToken, authenticateUser, userController.deleteUserByEmailController);

module.exports = router; // Exporting user routes
