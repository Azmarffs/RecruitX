const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/jobCategoryController');
const { verifyToken, authenticateUser } = require('../middleware/authMiddleware');

// C job creation problem
router.post('/',authenticateUser, verifyToken, categoryController.createCategoryController); 

// R Public routes
router.get('/', categoryController.getAllCategoriesController);
router.get('/name/:categoryName', categoryController.getCategoryByNameController);
router.get('/id/:categoryId', categoryController.getCategoryByIdController);
router.get('/mostApplied', categoryController.mostAppliedCategoriesController);

// U only recuriter can change the catergories
router.put('/id/:categoryId',verifyToken, authenticateUser, categoryController.updateCategoryByIdController);
router.put('/name/:categoryName',verifyToken, authenticateUser, categoryController.updateCategoryByNameController);

// D only recuriter can delete the catergories
router.delete('/id/:categoryId',verifyToken , authenticateUser, categoryController.deleteCategoryByIdController);
router.delete('/name/:categoryName', verifyToken , authenticateUser, categoryController.deleteCategoryByNameController);

module.exports = router;