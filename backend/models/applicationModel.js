//const db = require('../db');
const sql = require('mssql');

async function createApplication(applicantId, jobId, resume) 
{
    try 
    {
        const result = await new sql.Request()
            .input('applicantId', sql.Int, applicantId)
            .input('jobId', sql.Int, jobId)
            .input('resume', sql.VarChar(sql.MAX), resume)
            .query(`INSERT INTO applications (applicantId, jobId, resume) 
                    VALUES (@applicantId, @jobId, @resume)`);
        return result.recordset;
    } 
    catch (error) 
    {
        throw error;
    }
}

async function getApplications()
{
    try
    {
        const result = await new sql.Request()
        .query('SELECT * FROM applications');
        return result.recordset;
    }
    catch(error)
    {
        throw error;
    }
}

async function getApplicationById(applicationId) 
{
    try 
    {
        const result = await new sql.Request()
            .input('applicationId', sql.Int, applicationId)
            .query('SELECT * FROM applications WHERE applicationId = @applicationId');
        return result.recordset[0];
    } 
    catch (error) 
    {
        throw error;
    }
}

async function getApplicationsByApplicant(applicantId) 
{
    try 
    {
        const result = await new sql.Request()
            .input('applicantId', sql.Int, applicantId)
            .query('SELECT * FROM applications WHERE applicantId = @applicantId ORDER BY appliedAt DESC');
        return result.recordset;
    } 
    catch (error) 
    {
        throw error;
    }
}

async function getApplicantByApplicationId(applicationId) 
{
    try 
    {
        const result = await new sql.Request()
            .input('applicationId', sql.Int, applicationId)
            .query('SELECT applicantId FROM applications WHERE applicationId = @applicationId');
        return result.recordset;
    } 
    catch (error) 
    {
        throw error;
    }
}

async function getApplicationsByJobId(jobId) 
{
    try 
    {
        const result = await new sql.Request()
            .input('jobId', sql.Int, jobId)
            .query('SELECT * FROM applications WHERE jobId = @jobId');
        return result.recordset;
    } 
    catch (error) 
    {
        throw error;
    }
}

async function updateApplicationStatus(applicationId, newStatus) 
{
    try 
    {
        const result = await new sql.Request()
            .input('applicationId', sql.Int, applicationId)
            .input('newStatus', sql.VarChar(30), newStatus)
            .query('UPDATE applications SET status = @newStatus WHERE applicationId = @applicationId');
        return result.rowsAffected[0];
    } 
    catch (error) 
    {
        throw error;
    }
}

async function deleteApplication(applicationId) 
{
    try 
    {
        const result = await new sql.Request()
            .input('applicationId', sql.Int, applicationId)
            .query('DELETE FROM applications WHERE applicationId = @applicationId');
        return result.rowsAffected[0];
    } 
    catch (error) 
    {
        throw error;
    }
}

module.exports = 
{
    createApplication,
    getApplications,
    getApplicationById,
    getApplicationsByApplicant,
    getApplicantByApplicationId,
    getApplicationsByJobId,
    updateApplicationStatus,
    deleteApplication
};
