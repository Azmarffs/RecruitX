// models/skillModel.js
const sql = require('mssql');

const createSkill = async (skillName) => 
{
    await new sql.Request()
    .input('skillName', sql.VarChar, skillName)
    .query('INSERT INTO skills (skillName) VALUES (@skillName)');
};

const getAllSkills = async () => 
{
    const result = await sql.query`SELECT * FROM skills`;
    return result.recordset;
};

const getSkillById = async (skillId) => 
{
    const request = new sql.Request().input('skillId', sql.Int, skillId);
    const result = await request.query('SELECT * FROM skills WHERE skillId = @skillId');
    return result.recordset[0];
};

const getSkillByName = async (skillName) => 
{
    const request = new sql.Request()
    .input('skillName', sql.NVarChar, `%${skillName}%`)
    .query('SELECT * FROM skills WHERE skillName LIKE @skillName');
    return request.recordset;
};

const updateSkillById = async (skillId, skillName) => 
{
    const request = new sql.Request()
    .input('skillId', sql.Int, skillId)
    .input('skillName', sql.NVarChar, skillName);
    await request.query('UPDATE skills SET skillName = @skillName WHERE skillId = @skillId');
};

const updateSkillByName = async (skillName, newName) => 
{
    const request = new sql.Request()
    .input('skillName', sql.NVarChar, skillName)
    .input('newName', sql.NVarChar, newName);
    await request.query('UPDATE skills SET skillName = @newName WHERE skillName = @skillName');
};

const deleteSkillById = async (skillId) => 
{
    await new sql.Request()
    .input('skillId', sql.Int, skillId)
    .query('DELETE FROM skills WHERE skillId = @skillId');
};

const deleteSkillByName = async (skillName) => 
{
    await new sql.Request()
    .input('skillName', sql.NVarChar, skillName)
    .query('DELETE FROM skills WHERE skillName = @skillName');
};

module.exports = 
{ 
    createSkill, 
    getAllSkills, 
    getSkillById, 
    getSkillByName, 
    updateSkillById, 
    updateSkillByName, 
    deleteSkillById, 
    deleteSkillByName 
};