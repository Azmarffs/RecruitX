const sql = require("mssql");
const db = require("../db");

// Create a new skill entry for an applicant
const addApplicantSkill = async (applicantId, skillName) => 
{
    try 
    {
        const pool = await sql.connect(db);
        await pool.request()
            .input("applicantId", sql.Int, applicantId)
            .input("skillName", sql.NVarChar, skillName)
            .query(`
                INSERT INTO applicantSkills (applicantId, skillName)
                VALUES (@applicantId, @skillName);
            `);
        return { success: true, message: "Skill added successfully" };
    } 
    catch (error) 
    {
        throw error;
    }
};

// Retrieve all skills of an applicant
const getApplicantSkills = async (applicantId) => 
{
    try 
    {
        const pool = await sql.connect(db);
        const result = await pool.request()
            .input("applicantId", sql.Int, applicantId)
            .query(`
                SELECT * FROM applicantSkills WHERE applicantId = @applicantId;
            `);
        return result.recordset;
    } 
    catch (error) 
    {
        throw error;
    }
};

// Update an applicant's skill
const updateApplicantSkill = async (skillId, applicantId, newSkillName) => 
{
    try 
    {
        const pool = await sql.connect(db);
        const result = await pool.request()
            .input("skillId", sql.Int, skillId)
            .input("applicantId", sql.Int, applicantId)
            .input("newSkillName", sql.NVarChar, newSkillName)
            .query(`
                UPDATE applicantSkills
                SET skillName = @newSkillName
                WHERE skillId = @skillId AND applicantId = @applicantId;
            `);
        return result.rowsAffected[0] > 0 
            ? { success: true, message: "Skill updated successfully" }
            : { success: false, message: "Skill not found or unauthorized" };
    } 
    catch (error) 
    {
        throw error;
    }
};

// Delete a specific skill of an applicant
const deleteApplicantSkill = async (skillId, applicantId) => 
{
    try 
    {
        const pool = await sql.connect(db);
        const result = await pool.request()
            .input("skillId", sql.Int, skillId)
            .input("applicantId", sql.Int, applicantId)
            .query(`
                DELETE FROM applicantSkills
                WHERE skillId = @skillId AND applicantId = @applicantId;
            `);
        return result.rowsAffected[0] > 0 
            ? { success: true, message: "Skill deleted successfully" }
            : { success: false, message: "Skill not found or unauthorized" };
    } 
    catch (error) 
    {
        throw error;
    }
};

// Delete all skills of an applicant
const deleteAllApplicantSkills = async (applicantId) => 
{
    try 
    {
        const pool = await sql.connect(db);
        const result = await pool.request()
            .input("applicantId", sql.Int, applicantId)
            .query(`
                DELETE FROM applicantSkills WHERE applicantId = @applicantId;
            `);
        return result.rowsAffected[0] > 0 
            ? { success: true, message: "All skills deleted successfully" }
            : { success: false, message: "No skills found for the applicant" };
    } 
    catch (error) 
    {
        throw error;
    }
};

module.exports = 
{
    addApplicantSkill,
    getApplicantSkills,
    updateApplicantSkill,
    deleteApplicantSkill,
    deleteAllApplicantSkills
};
