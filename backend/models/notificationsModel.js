// model/notificationModel.js
const sql = require("mssql");
const db = require("../db");

// Get all notifications
const getAllNotifications = async () => 
{
    const pool = await sql.connect(db);
    const result = await pool.request().query("SELECT * FROM notifications ORDER BY createdAt DESC");
    return result.recordset;
};

// Get notifications by user email
const getNotificationsByEmail = async (email) => 
{
    const pool = await sql.connect(db);
    const result = await pool.request()
        .input("email", sql.NVarChar, email)
        .query(`
            SELECT n.* FROM notifications n
            JOIN users u ON n.userId = u.userId
            WHERE u.email = @email
            ORDER BY n.createdAt DESC
        `);
    return result.recordset;
};

// Create a new notification
const createNotification = async (email, notificationText) => 
{
    const pool = await sql.connect(db);

    // Get userId from email
    const userResult = await pool.request()
        .input("email", sql.NVarChar, email)
        .query("SELECT userId FROM users WHERE email = @email");

    if (userResult.recordset.length === 0) 
    {
        throw new Error("User not found");
    }

    const userId = userResult.recordset[0].userId;

    // Insert notification
    await pool.request()
        .input("userId", sql.Int, userId)
        .input("notificationText", sql.NVarChar(sql.MAX), notificationText)
        .query("INSERT INTO notifications (userId, notificationText) VALUES (@userId, @notificationText)");
};

// Delete a notification by ID
const deleteNotification = async (notificationId) => 
{
    const pool = await sql.connect(db);
    await pool.request()
        .input("notificationId", sql.Int, notificationId)
        .query("DELETE FROM notifications WHERE notificationId = @notificationId");
};

module.exports = 
{ 
    getAllNotifications,
    getNotificationsByEmail,
    createNotification,
    deleteNotification 
};
