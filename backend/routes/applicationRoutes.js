const express = require('express');
const router = express.Router();
const applicationController = require('../controllers/applicationsController');
const { verifyToken, attachToken } = require('../middleware/authMiddleware');

//router.use(attachToken);

//C post an apllication
router.post('/', applicationController.createApplicationController);

//R get all applications that are submitted by someone
router.get('/', applicationController.getApplicationsController);
//get an application by its id
router.get('/applicationId/:applicationId', applicationController.getApplicationByIdController);
//get an application of an applier by its applicant id
router.get('/applicantId/:applicantId', verifyToken, applicationController.getApplicationsByApplicantController);
//get an application of an applier by its Job id
router.get('/jobId/:jobId', applicationController.getApplicationsByJobIdController);

//U recruiter will change the application as it would be able to change the status
router.put('/applicationId/:applicationId', verifyToken, applicationController.updateApplicationStatusController);

//D an applicant would be able to delete its application
router.delete('/applicationId/:applicationId', verifyToken , applicationController.deleteApplicationController);

module.exports = router;