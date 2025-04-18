// models/profileModel.js

const db = require('../db');
const sql = require('mssql');
const userModel = require('./userModel');
const resumeController = require('../controllers/resumeController'); 

//get all profiles
const getAllProfiles = async () =>
{
    try
    {
        const result = await sql.query('SELECT * FROM profiles');
        return result.recordset;
    }
    catch (error)
    {
        throw error;
    }
};

//get a profile by its id
const getProfileById = async (profileId) =>
    {
        try
        {
            const pool = await sql.connect(db);
            const result = await pool.request()
                .input('profileId', sql.Int, profileId) 
                .query('SELECT * FROM profiles WHERE profileId = @profileId');
            
            return result.recordset[0] || null; 
        }
        catch (error)
        {
            throw error;
        }
    };

//get a profile usingg userId
const getProfileByUserId = async (userId) =>
    {
        try
        {
            const pool = await sql.connect(db);
            const result = await pool.request()
                .input('userId', sql.Int, userId)
                .query('SELECT * FROM profiles WHERE userId = @userId');
    
            return result.recordset[0];
        }
        catch (error)
        {
            throw error;
        }
    };

//create the profile
const createProfile = async (userId, bio, address, experienceLevel) =>
{
    const result = await sql.query`INSERT INTO profiles (userId, bio, address, experienceLevel) VALUES (${userId}, ${bio}, ${address}, ${experienceLevel})`;
};

const getProfileByEmail = async (email) =>
{
    try 
    {
        const result = await sql.query`
            SELECT name, role, bio, address, experienceLevel 
            FROM users 
            JOIN profiles ON profiles.userId = users.userId 
            WHERE users.email = ${email}
        `;

        return result.recordset[0];
    } 
    catch (error) 
    {
        console.error("Error fetching profile:", error);
        throw error;
    }
};    

//update profile by profile id
//to be used by admin log
const updateProfileById = async (profileId, fieldsToUpdate) => 
{
    try 
    {
        let query = 'UPDATE profiles SET ';
        const updates = [];
        const request = new sql.Request();

        if (fieldsToUpdate.bio) 
        {
            updates.push('bio = @bio');
            request.input('bio', sql.VarChar, fieldsToUpdate.bio);
        }

        if (fieldsToUpdate.address) 
        {
            updates.push('address = @address');
            request.input('address', sql.VarChar, fieldsToUpdate.address);
        }

        if (fieldsToUpdate.experienceLevel) 
        {
            updates.push('experienceLevel = @experienceLevel');
            request.input('experienceLevel', sql.VarChar, fieldsToUpdate.experienceLevel);
        }

        if (updates.length === 0) 
        {
            throw new Error('No valid fields to update');
        }

        query += updates.join(', ') + ' WHERE profileId = @profileId';
        request.input('profileId', sql.Int, profileId);

        await request.query(query);
    } 
    catch (error) 
    {
        throw error;
    }
};

//delte a profile by profile id
const deleteProfileById = async (profileId) =>
{
    try
    {
        await sql.query`DELETE FROM profiles WHERE profileId = ${profileId}`;
    }
    catch (error)
    {
        throw error;
    }
};

module.exports =
{
    getAllProfiles,
    getProfileById,
    getProfileByUserId,
    createProfile,
    updateProfileById,
    deleteProfileById,
    getProfileByEmail
};
