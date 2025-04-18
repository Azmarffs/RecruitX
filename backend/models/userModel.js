// models/userModel.js
const db = require('../db');
const sql = require('mssql');
const adminLogsModel = require('./adminLogsModel');
const profileModel = require('./profileModel');

// Get all users
const getAllUsers = async () => 
{
    const result = await sql.query`SELECT userId, name, email, role, createdAt FROM users`;
    return result.recordset;
};

// Get user by ID (Admin use)
const getUserById = async (userId) => 
{
    const result = await sql.query`SELECT userId, name, email, role, createdAt FROM users WHERE userId = ${userId}`;
    return result.recordset[0];
};

// Get user by email (Used for authentication)
const getUserByEmail = async (email) => 
{
    const result = await sql.query`SELECT userId, name, email, passwordHash, role, createdAt FROM users WHERE email = ${email}`;
    return result.recordset[0];
};

// Create a new user
const createUser = async (name, email, passwordHash, role) => 
{
    try 
    {
        const pool = await sql.connect(db);

        const result = await pool.request()
            .input("name", sql.NVarChar, name)
            .input("email", sql.NVarChar, email)
            .input("passwordHash", sql.NVarChar, passwordHash)
            .input("role", sql.NVarChar, role)
            .query(`
                INSERT INTO users (name, email, passwordHash, role)
                OUTPUT INSERTED.userId
                VALUES (@name, @email, @passwordHash, @role);
            `);

        if (!result.recordset.length) 
        {
            throw new Error("User creation failed");
        }

        const userId = result.recordset[0].userId;

        if (role.toLowerCase() === "admin") 
        {
            await pool.request()
                .input("name", sql.NVarChar, name)
                .input("action", sql.NVarChar, "New admin account created")
                .query(`
                    INSERT INTO adminLogs (name, action)
                    VALUES (@name, @action);
                `);
        }
        
        await profileModel.createProfile(userId, "Add Bio here", "Add adderess here", "Entry");

    } 
    catch (error) 
    {
        throw error;
    }
};

// Update user by email (Flexible fields update)
const updateUserByEmail = async (email, fieldsToUpdate) => 
{
    try 
    {
        const setClause = Object.keys(fieldsToUpdate)
            .map((field, index) => `${field} = @value${index}`)
            .join(', ');

        const pool = await sql.connect(db);
        const request = pool.request();
        request.input("email", sql.NVarChar, email);

        Object.entries(fieldsToUpdate).forEach(([key, value], index) => 
        {
            request.input(`value${index}`, value);
        });

        await request.query(`UPDATE users SET ${setClause} WHERE email = @email`);
    } 
    catch (error) 
    {
        return error;
    }
};
    
// Delete user by ID
const deleteUserById = async (userId) => 
{
    try 
    {
        const pool = await sql.connect(db);
        const result = await pool.query(`DELETE FROM users WHERE userId = ${userId}`);

        if (result.rowsAffected[0] === 0) 
        {
            return { success: false, message: "User not found" };
        }
    } 
    catch (error) 
    {
        return { success: false, message: "Error deleting user", error: error.message };
    }
};
    
// Delete user by email
const deleteUserByEmail = async (email) => 
{
    try 
    {
        const pool = await sql.connect(db);
        const result = await pool.query(`DELETE FROM users WHERE email = '${email}'`);

        if (result.rowsAffected[0] === 0) 
        {
            return { success: false, message: "User not found" };
        }
    } 
    catch (error) 
    {
        return { success: false, message: "Error deleting user", error: error.message };
    }
};
    
// Export functions
module.exports =
{
    getAllUsers,
    getUserById,
    getUserByEmail,
    createUser,
    updateUserByEmail,
    deleteUserById,
    deleteUserByEmail,
};