const express = require('express');
const router = express.Router();
const jobController = require('../controllers/jobController');
const { verifyToken, authenticateUser } = require('../middleware/authMiddleware');

// C POST route
router.post('/',verifyToken, authenticateUser,jobController.createJobController);

// R GET routes
router.get('/', jobController.getAllJobsController);
router.get('/trendingJobs', jobController.trendingJobsViewController);
router.get('/popularCities', jobController.popularCitiesViewController);
router.get('/highestPaidJobs', jobController.highestPaidJobsViewController);
router.get('/popularCompanies', jobController.popularCompaniesViewController);
//router.get('/', jobController.getAllJobsController); //get all jobs
router.get('/:jobId', jobController.getJobByIdController); //get job by id
router.get('/:keyword', jobController.getJobByKeywordController); //get job by (title,description,company,location)

// U put routes
router.put('/:jobId',verifyToken , authenticateUser, jobController.updateJobByIdController );

// D delete a job by jobId
router.delete('/:jobId',verifyToken , authenticateUser, jobController.deleteJobByIdController);

module.exports = router;
