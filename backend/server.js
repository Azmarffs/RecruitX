const express = require('express');
const dotenv = require('dotenv');
const { connectDB } = require('./db');
const cors = require("cors");
const userRoutes = require('./routes/userRoutes'); // Import user routes
const applicationRoutes = require('./routes/applicationRoutes'); // Import user routes
//const resumeRoutes = require('./routes/resumeRoutes'); // Import user routes
const interviewsRoutes = require('./routes/interviewsRoutes'); // Import user routes
const notificationsRoutes = require('./routes/notificationsRoutes'); // Import user routes

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Middleware to parse JSON
app.use(express.json());

// Connect to the database
connectDB();

// Enable CORS
app.use(cors());

// Define a basic route
app.get('/', (req, res) => {
    res.send('API is running...');
});

// Import the SQL module from db.js
const { sql } = require('./db');

// Route to get all jobs
app.get('/api/jobs', async (req, res) => {
    try {
        const request = new sql.Request();
        const result = await request.query('SELECT * FROM jobs');
        res.status(200).json(result.recordset); // Send the jobs as JSON
    } catch (error) {
        console.error('Error fetching jobs:', error);
        res.status(500).json({ message: 'Failed to fetch jobs' });
    }
});

// Use user routes for login and register
app.use('/users', userRoutes); // Add this line
app.use('/applications', applicationRoutes); // Add this line
//app.use('/resume', resumeRoutes); // Add this line
app.use('/interviews', interviewsRoutes); // Add this line
app.use('/notifications', notificationsRoutes); // Add this line

// Set the server port
const PORT = process.env.PORT || 5000;

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});