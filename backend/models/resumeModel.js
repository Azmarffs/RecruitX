// models/ resumeModels.js
const sql = require("mssql");
const db = require("../db");
const fs = require("fs");

// Upload resume (Only an applicant can add the resume)
const uploadResume = async (userId, resumeName, resumePath) => 
{
    try 
    {
        const pool = await sql.connect(db);
        await pool.request()
            .input("userId", sql.Int, userId)
            .input("resumeName", sql.NVarChar, resumeName)
            .input("resumePath", sql.NVarChar, resumePath)
            .query(`INSERT INTO resumeUpload (userId, resumeName, resumePath) VALUES (@userId, @resumeName, @resumePath)`);
    } 
    catch (error) 
    {
        throw error;
    }
};

// Get resume by email
const getResumeByEmail = async (email) => 
{
    try 
    {
        const pool = await sql.connect(db);
        const result = await pool.request()
            .input("email", sql.NVarChar, email)
            .query(`SELECT r.userId , r.resumeId, r.resumeName, r.resumePath FROM resumeUpload r INNER JOIN users u ON r.userId = u.userId WHERE u.email = @email`);
        
        return result.recordset;
    } 
    catch (error) 
    {
        throw error;
    }
};

// Delete resume by email
const deleteResume = async (email) => 
{
    try 
    {
        const pool = await sql.connect(db);
        const result = await pool.request()
            .input("email", sql.NVarChar, email)
            .query(`SELECT r.resumeId, r.resumePath FROM resumeUpload r INNER JOIN users u ON r.userId = u.userId WHERE u.email = @email`);
        
        if (result.recordset.length === 0) return { success: false, message: "Resume not found" };
        
        const { resumeId, resumePath } = result.recordset[0];
        if (resumePath && fs.existsSync(resumePath)) fs.unlink(resumePath, err => { if (err) console.error("Error deleting file:", err); });
        
        await pool.request().input("resumeId", sql.Int, resumeId).query(`DELETE FROM resumeUpload WHERE resumeId = @resumeId`);
        return { success: true, message: "Resume deleted successfully" };
    } 
    catch (error) 
    {
        throw error;
    }
};

// Delete resume by userId
const deleteResumeById = async (userId) => 
{
    try 
    {
        const pool = await sql.connect(db);
        const result = await pool.request()
            .input("userId", sql.Int, userId)
            .query(`SELECT r.resumeId, r.resumePath FROM resumeUpload r INNER JOIN users u ON r.userId = u.userId WHERE u.userId = @userId`);
        
        if (result.recordset.length === 0) return { success: false, message: "Resume not found" };
        
        const { resumeId, resumePath } = result.recordset[0];
        if (resumePath && fs.existsSync(resumePath)) fs.unlink(resumePath, err => { if (err) console.error("Error deleting file:", err); });
        
        await pool.request().input("userId", sql.Int, userId).query(`DELETE FROM resumeUpload WHERE userId = @userId`);
        return { success: true, message: "Resume deleted successfully" };
    } 
    catch (error) 
    {
        throw error;
    }
};

module.exports =
{
    uploadResume,
    getResumeByEmail,
    deleteResume,
    deleteResumeById
};
