const sql = require("mssql");
const db = require("../db");

// Retrieve all messages exchanged between two users
const getAllMessages = async (email1, email2) => 
{
    try 
    {
        const pool = await sql.connect(db);
        const result = await pool.request()
            .input("email1", sql.NVarChar, email1)
            .input("email2", sql.NVarChar, email2)
            .query(`
                SELECT m.*
                FROM messages m
                JOIN users u1 ON m.senderId = u1.userId
                JOIN users u2 ON m.receiverId = u2.userId
                WHERE 
                    (u1.email = @email1 AND u2.email = @email2)
                    OR
                    (u1.email = @email2 AND u2.email = @email1)
                ORDER BY m.sentAt;
            `);
        return result.recordset;
    } 
    catch (error) 
    {
        throw error;
    }
};

// Send a message from one user to another
const sendMessage = async (senderEmail, receiverEmail, messageText) => 
{
    try 
    {
        const pool = await sql.connect(db);
        const result = await pool.request()
            .input("senderEmail", sql.NVarChar, senderEmail)
            .input("receiverEmail", sql.NVarChar, receiverEmail)
            .input("messageText", sql.NVarChar, messageText)
            .query(`
                INSERT INTO messages (senderId, receiverId, messageText)
                SELECT u1.userId, u2.userId, @messageText
                FROM users u1, users u2
                WHERE u1.email = @senderEmail AND u2.email = @receiverEmail;
            `);
        return result.recordset;
    } 
    catch (error) 
    {
        throw error;
    }
};

// Update an existing message (only sender can update)
const updateMessage = async (messageId, senderEmail, newMessageText) => 
{
    try 
    {
        const pool = await sql.connect(db);
        const result = await pool.request()
            .input("messageId", sql.Int, messageId)
            .input("senderEmail", sql.NVarChar, senderEmail)
            .input("newMessageText", sql.NVarChar, newMessageText)
            .query(`
                UPDATE messages
                SET messageText = @newMessageText
                WHERE messageId = @messageId 
                AND senderId = (SELECT userId FROM users WHERE email = @senderEmail);
            `);
        return result.rowsAffected[0];
    } 
    catch (error) 
    {
        throw error;
    }
};

// Delete a message (only sender can delete)
const deleteMessage = async (messageId, senderEmail) => 
{
    try 
    {
        const pool = await sql.connect(db);
        const result = await pool.request()
            .input("messageId", sql.Int, messageId)
            .input("senderEmail", sql.NVarChar, senderEmail)
            .query(`
                DELETE FROM messages
                WHERE messageId = @messageId 
                AND senderId = (SELECT userId FROM users WHERE email = @senderEmail);
            `);
        return result.rowsAffected[0];
    } 
    catch (error) 
    {
        throw error;
    }
};

module.exports = 
{
    getAllMessages,
    sendMessage,
    updateMessage,
    deleteMessage
};