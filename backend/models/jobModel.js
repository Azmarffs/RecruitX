const db = require('../db');
const sql = require('mssql');

// CREATE job Model
const createJob = async (recruiterId,recruiterName, title, description, location, category, req_experienceLevel, salaryRange) => 
{
    try
    {
        const categoryResult = await new sql.Request()
            .input('category', sql.VarChar(255), category)
            .query(`SELECT categoryId FROM jobCategories WHERE categoryName = @category`);

            if (categoryResult.recordset.length <= 0) 
            {
                // Insert new category if doesn't exists
                const insertCategoryResult = await new sql.Request()
                    .input('category', sql.VarChar(255), category)
                    .query(`INSERT INTO jobCategories (categoryName) VALUES (@category)`);
            }

        const result = await sql.query`
            INSERT INTO jobs (recruiterId, recruiterName, title, description, location, category, req_experienceLevel, salaryRange)
            VALUES (${recruiterId},${recruiterName}, ${title}, ${description}, ${location}, ${category}, ${req_experienceLevel}, ${salaryRange})`;
    }  
    catch (error)
    {
        throw error;
    }
};

// GET all jobs
const getAllJobs = async () => 
{
    try
    {
        const result = await sql.query`
            SELECT * FROM jobs`;
        return result.recordset;
    }
    catch (error)
    {
        throw error;
    }
};

// GET job by jobId
const getJobById = async (jobId) => 
{
    try
    {
        const result = await sql.query`
            SELECT * FROM jobs WHERE jobId = ${jobId}`;
        return result.recordset[0];
    }
    catch (error)
    {
        throw error;
    }
};

// Search jobs by keyword in title or description
const getJobsByKeyword = async (keyword) =>
{       
    try 
    {
        const result = await sql.query`
            SELECT *
            FROM jobs
            WHERE title LIKE '%' + ${keyword} + '%' 
            OR description LIKE '%' + ${keyword} + '%'
            OR recruiterName LIKE '%' + ${keyword} + '%'
            OR location LIKE '%' + ${keyword} + '%'
            OR category LIKE '%' + ${keyword} + '%';
        `;
        return result.recordset;
    } 
    catch (error) 
    {
        throw error;
    }
};


// update job query
const updateJobById = async (jobId, fieldsToUpdate) =>
{
    try
    {
        const setClause = Object.keys(fieldsToUpdate)
            .map((field, index) => `${field} = @value${index}`)
            .join(', ');

        const request = new sql.Request();

        Object.entries(fieldsToUpdate).forEach(([key, value], index) =>
        {
            request.input(`value${index}`, value);
        });

        request.input('jobId', sql.Int, jobId);

        const query = `UPDATE jobs SET ${setClause} WHERE jobId = @jobId`;
        await request.query(query);
    }
    catch (error)
    {
        console.error('Error updating job:', error);
        throw error;
    }
};
    
    

// DELETE job by jobId
const deleteJobById = async (jobId) => 
{
    try
    {
        await sql.query`
            DELETE FROM jobs WHERE jobId = ${jobId}`;
    }
    catch (error)
    {
        throw error;
    }
};

const deleteJobByUserId = async (recruiterId) => 
{
    try
    {
        await sql.query`
            DELETE FROM jobs WHERE recruiterId = ${recruiterId}`;
    }
    catch (error)
    {
        throw error;
    }
};

//View for trending jobs
const trendingJobsView = async () => 
{
    try 
    {
        await sql.query('DROP VIEW IF EXISTS TrendingJobs');
        await sql.query(`
            CREATE VIEW TrendingJobs AS
            (SELECT TOP 10 title, location, COUNT(*) AS applicationsForJob
            FROM applications a JOIN jobs j ON a.jobId = j.jobId
            GROUP BY title, location
            ORDER BY COUNT(*) DESC);
        `);
    } 
    catch (error) 
    {
        throw error;
    }
};

//View for popular cities
const popularCitiesView = async () => 
{
    try 
    {
        await sql.query('DROP VIEW IF EXISTS PopularCities');
        await sql.query(`
            CREATE VIEW PopularCities AS
            (SELECT TOP 10 location, COUNT(*) AS job_count
            FROM jobs
            GROUP BY location
            ORDER BY COUNT(*) DESC);
        `);
    } 
    catch (error) 
    {
        throw error;
    }
};

//View for highest paid jobs
const highestPaidJobsView = async () => 
{
    try 
    {
        await sql.query('DROP VIEW IF EXISTS HighestPaidJobs');
        await sql.query(`
            CREATE OR ALTER VIEW HighestPaidJobs AS
            SELECT TOP 10 title, salaryRange
            FROM jobs
            ORDER BY salaryRange DESC;
        `);
    } 
    catch (error) 
    {
        throw error;
    }
};

const popularCompaniesView = async () => 
{
    try
    {
        await sql.query('DROP VIEW IF EXISTS PopularCompanies');
        await sql.query(`
            CREATE OR ALTER VIEW PopularCompanies AS
            SELECT TOP 10 recruiterName, COUNT(*) AS job_count
            FROM jobs
            GROUP BY recruiterName
            ORDER BY COUNT(*) DESC;
        `);
    } 
    catch (error) 
    {
        throw error;
    }
};


module.exports = 
{
    createJob,
    getAllJobs,
    getJobById,
    getJobsByKeyword,
    updateJobById,
    deleteJobById,
    popularCitiesView,
    trendingJobsView,
    highestPaidJobsView,
    popularCompaniesView,
    deleteJobByUserId
};
