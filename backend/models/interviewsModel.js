// models/interviewModels.js
const sql = require('mssql');

// Function to schedule a new interview
async function postInterview(applicationId, applicantId, recruiterId, interviewDate) 
{
    try 
    {
        const result = await new sql.Request()
            .input('applicationId', sql.Int, applicationId)
            .input('applicantId', sql.Int, applicantId)
            .input('recruiterId', sql.Int, recruiterId)
            .input('interviewDate', sql.DateTime, interviewDate)
            .query(`INSERT INTO interviewSchedules (applicationId, applicantId, recruiterId, interviewDate)
                    VALUES (@applicationId, @applicantId, @recruiterId, @interviewDate)`);
        return result.recordset;
    } 
    catch (error) 
    {
        throw error;
    }
}

// Function to get the applicant ID for a specific interview
async function userInterviews(interviewId)
{
    try
    {
        const result = await new sql.Request()
            .input('interviewId', sql.Int, interviewId)
            .query('SELECT applicantId FROM interviewSchedules WHERE interviewId=@interviewId');
        return result.recordset;
    }
    catch (error) 
    {
        throw error;
    }
}

// Function to retrieve all scheduled interviews
async function getInterviews()
{
    try
    {
        const result = await new sql.Request()
            .query('SELECT * FROM interviewSchedules');
        return result.recordset;
    }
    catch (error) 
    {
        throw error;
    }
}

// Function to get interview details by interview ID
async function getInterviewByInterviewId(interviewId)
{
    try
    {
        const result = await new sql.Request()
            .input('interviewId', sql.Int, interviewId)
            .query('SELECT * FROM interviewSchedules WHERE interviewId=@interviewId');
        return result.recordset;
    }
    catch (error) 
    {
        throw error;
    }
}

// Function to get all interviews for a specific applicant
async function getInterviewByUserId(applicantId)
{
    try
    {
        const result = await new sql.Request()
            .input('applicantId', sql.Int, applicantId)
            .query('SELECT * FROM interviewSchedules WHERE applicantId=@applicantId');
        return result.recordset;
    }
    catch (error) 
    {
        throw error;
    }
}

// Function to update the interview date
async function updateInterviewDate(interviewId, newDate)
{
    try
    {
        const result = await new sql.Request()
            .input('interviewId', sql.Int, interviewId)
            .input('newDate', sql.DateTime, newDate)
            .query('UPDATE interviewSchedules SET interviewDate = @newDate WHERE interviewId=@interviewId');
    }
    catch (error) 
    {
        throw error;
    }
}

// Function to delete an interview by its ID
async function deleteInterviewByInterviewId(interviewId)
{
    try
    {
        const result = await new sql.Request()
            .input('interviewId', sql.Int, interviewId)
            .query('DELETE FROM interviewSchedules WHERE interviewId=@interviewId');
    }
    catch (error) 
    {
        throw error;
    }
}

// Function to delete all interviews of a specific applicant
async function deleteInterviewByUserId(applicantId)
{
    try
    {
        const result = await new sql.Request()
            .input('applicantId', sql.Int, applicantId)
            .query('DELETE FROM interviewSchedules WHERE applicantId=@applicantId');
    }
    catch (error) 
    {
        throw error;
    }
}

module.exports = 
{
    postInterview,
    getInterviews,
    userInterviews,
    getInterviewByUserId,
    getInterviewByInterviewId,
    updateInterviewDate,
    deleteInterviewByInterviewId,
    deleteInterviewByUserId
};