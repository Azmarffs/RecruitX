// routes/adminLogsRoutes.js
const express = require('express');
const router = express.Router();
const adminLogsController = require('../controllers/adminLogsController');

// C - Create a new admin log
router.post('/', adminLogsController.createAdminLogController);

// R - Get all admin logs
router.get('/', adminLogsController.getAllAdminLogsController);
//Get admin log by ID
router.get('/:adminId', adminLogsController.getAdminLogByIdController);

// U - Update an admin log by ID
router.put('/update/:adminId', adminLogsController.updateAdminLogByIdController);

// D - Delete an admin log by ID
router.delete('/delete/:adminId', adminLogsController.deleteAdminLogByIdController);

module.exports = router;
