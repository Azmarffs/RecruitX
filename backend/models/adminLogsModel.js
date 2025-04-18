// models/adminLosModel.js
const db = require('../db'); 
const sql = require('mssql');

// Create admin log
const createAdminLog = async (name, action) => 
{
    try 
    {
        const result = await new sql.Request()
            .input('name', sql.VarChar(100), name)
            .input('action', sql.VarChar(sql.MAX), action)
            .query(`INSERT INTO adminLogs (name, action) 
                    VALUES (@name, @action)`);
        return result.recordset;
    } 
    catch (error) 
    {
        throw error;
    }
};

const getAllAdminLogs = async () => 
{
    try 
    {
        const result = await new sql.Request()
            .query('SELECT * FROM adminLogs ORDER BY Timestamp DESC');
        return result.recordset;
    } 
    catch (error) 
    {
        throw error;
    }
};

const getAdminLogById = async (adminId) => 
{
    try 
    {
        const result = await new sql.Request()
            .input('adminId', sql.Int, adminId)
            .query('SELECT * FROM adminLogs WHERE adminId = @adminId');
        return result.recordset[0]; 
    } 
    catch (error) 
    {
        throw error;
    }
};

const updateAdminLogById = async (adminId, fieldsToUpdate) => 
{
    try 
    {
        const setClause = Object.keys(fieldsToUpdate)
            .map((field, index) => `${field} = @value${index}`)
            .join(', ');

        const result = new sql.Request();

        Object.entries(fieldsToUpdate).forEach(([key, value], index) => 
        {
            result.input(`value${index}`, value);
        });

        result.input('adminId', sql.Int, adminId);

        const query = `UPDATE adminLogs SET ${setClause} WHERE adminId = @adminId`;
        await result.query(query);
    } 
    catch (error) 
    {
        console.error('Error updating admin log:', error);
        throw error;
    }
};

const deleteAdminLogById = async (adminId) => 
{
    try 
    {
        const result = await new sql.Request()
            .input('adminId', sql.Int, adminId)
            .query('DELETE FROM adminLogs WHERE adminId = @adminId');
        return result.rowsAffected[0]; 
    } 
    catch (error) 
    {
        throw error;
    }
};

module.exports = 
{
    createAdminLog,
    getAllAdminLogs,
    getAdminLogById,
    updateAdminLogById,
    deleteAdminLogById
};
