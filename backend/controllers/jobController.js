const jobModel = require('../models/jobModel');
const userModel = require('../models/userModel'); // Import userModel to check if recruiter exists
const sql = require('mssql');

// Controller to create a new job
const createJobController = async (req, res) =>
{
    const { recruiterName, title, description, location, category, req_experienceLevel, salaryRange } = req.body;
    const recruiterId = Number(req.user.userId);

    try
    {
        if (req.user.role!='recruiter')
        {
            return res.status(404).json({ message: 'Only Recruiter can post a job' });
        }

        await jobModel.createJob(recruiterId, recruiterName, title, description, location, category, req_experienceLevel, salaryRange);
        res.status(201).json({ message: 'Job created successfully' });
    }
    catch (error)
    {
        console.error('Error creating job:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Controller to get all jobs
const getAllJobsController = async (req, res) => 
{
    try
    {
        const jobs = await jobModel.getAllJobs();
        res.status(200).json(jobs);
    }
    catch (error)
    {
        console.error('Error retrieving jobs:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Controller to get a job by ID
const getJobByIdController = async (req, res) => {
    const { jobId } = req.params;

    try {
        const job = await jobModel.getJobById(jobId);
        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }
        res.status(200).json(job);
    } catch (error) {
        console.error('Error retrieving job:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

//Controller to get jobs by keyword(title,description,company)
const getJobByKeywordController = async (req, res) =>
{
        const { keyword } = req.params;
    
        try
        {
            const job = await jobModel.getJobsByKeyword(keyword);
            if (!job || job.length===0) 
            {
                return res.status(404).json({ message: 'Jobs not found' });
            }
            res.status(200).json(job);
        } 
        catch (error) 
        {
            console.error('Error retrieving job:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
};

// Controller to update a job by ID
const updateJobByIdController = async (req, res) =>
{
    const { jobId } = req.params;
    const fieldsToUpdate = req.body;
    const recruiterId = Number(req.user.userId);

    try
    {
        if(req.user.role!='recruiter')
        {
            return res.status(403).json({ message: 'Only Recruiters can change the Job' });
        }

        const job = await jobModel.getJobById(jobId);
        if (!job || job.length===0)
        {
            return res.status(404).json({ message: 'Job not found' });
        }

        if (job.recruiterId !== recruiterId)
        {
            return res.status(403).json({ message: 'Unauthorized person trying to update this job' });
        }
        await jobModel.updateJobById(jobId, fieldsToUpdate);
        res.status(200).json({ message: 'Job updated successfully' });
    } 
    catch (error) 
    {
        console.error('Error updating job:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Controller to delete a job by ID
const deleteJobByIdController = async (req, res) => 
{
    const { jobId } = req.params;
    const recruiterId = Number(req.user.userId); // Assuming recruiterId is available in req.user

    try 
    {
        if(req.user.role!='recruiter')
        {
            return res.status(403).json({ message: 'Only Recruiters can delete the Job' });
        }

        const job = await jobModel.getJobById(jobId);
        if (!job)
        {
            return res.status(404).json({ message: 'Job not found' });
        }

        if (job.recruiterId !== recruiterId) 
        {
            return res.status(403).json({ message: 'Unauthorized to delete this job' });
        }

        await jobModel.deleteJobById(jobId);
        res.status(200).json({ message: 'Job deleted successfully' });
    } 
    catch (error) 
    {
        console.error('Error deleting job:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};


const trendingJobsViewController = async (req, res) => 
{
    try
    {
        await jobModel.trendingJobsView();  // Ensure the view is created properly

        const result = await sql.query(`SELECT * FROM TrendingJobs`);  // Correct way to query a view

        if (!result.recordset || result.recordset.length === 0) 
        {
            return res.status(404).json({ message: 'Jobs not found' });
        }

        res.status(200).json(result.recordset);
    } 
    catch (error) 
    {
        res.status(500).json({ error: error.message });
    }
};

const popularCitiesViewController = async (req, res) => 
{
    try
    {
        await jobModel.popularCitiesView();  // Ensure the view is created properly
    
        const result = await sql.query(`SELECT * FROM PopularCities`);  // Correct way to query a view
    
        if (!result.recordset || result.recordset.length === 0) 
        {
            return res.status(404).json({ message: 'Cities not found' });
        }
    
        res.status(200).json(result.recordset);
    } 
    catch (error) 
    {
        res.status(500).json({ error: error.message });
    }
};

const highestPaidJobsViewController = async (req, res) => 
{
    try
    {
        await jobModel.highestPaidJobsView();  // Ensure the view is created properly
        
        const result = await sql.query(`SELECT * FROM HighestPaidJobs`);  // Correct way to query a view
        
        if (!result.recordset || result.recordset.length === 0) 
        {
            return res.status(404).json({ message: 'Jobs not found' });
        }
        
        res.status(200).json(result.recordset);
    } 
    catch (error) 
    {
        res.status(500).json({ error: error.message });
    }
};

const popularCompaniesViewController = async (req, res) => 
{
    try
    {
        await jobModel.popularCompaniesView();  // Ensure the view is created properly
        
        const result = await sql.query(`SELECT * FROM PopularCompanies`);  // Correct way to query a view
        
        if (!result.recordset || result.recordset.length === 0) 
        {
            return res.status(404).json({ message: 'Comapnies not found' });
        }
        
        res.status(200).json(result.recordset);
    } 
    catch (error) 
    {
        res.status(500).json({ error: error.message });
    }
};



module.exports = 
{
    createJobController,
    getAllJobsController,
    getJobByIdController,
    getJobByKeywordController,
    updateJobByIdController,
    deleteJobByIdController,
    popularCitiesViewController,
    trendingJobsViewController,
    highestPaidJobsViewController,
    popularCompaniesViewController
};
