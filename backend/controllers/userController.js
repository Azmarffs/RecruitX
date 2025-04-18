const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sql = require('mssql');
const { loggedInEmail } = require('../middleware/authMiddleware');
const userModel = require('../models/userModel');
const profileModel = require('../models/profileModel');
const jobModel = require('../models/jobModel');
const applicationModel = require('../models/applicationModel');
const resumeModel = require("../models/resumeModel");
const interviewsModel = require('../models/interviewsModel');

//JWT_SECRET key from .env file
const JWT_SECRET = process.env.JWT_SECRET;

//function to get all the users
const getAllUsersController = async (req, res) =>
{
    try
    {
        const users = await userModel.getAllUsers();  //getAllUsers is from usersModel
        res.status(200).json(users);
    }
    catch (error)
    {
        console.error('Error getting all the users', error);
        res.status(500).json({ message: 'Some error in the server' });
    }
};


//function to get a user by its id
const getUserByIdController = async (req, res) =>
{
    try
    {
        const { id } = req.params;
        const user = await userModel.getUserById(id);//get a user by id is from userModel

        if (!user)
        {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json(user);
    }
    catch (error)
    {
        console.error('User not found with id',error);
        res.status(500).json({ message: 'Some error in the server' });
    }
};

//function to get a user by email
const getUserByEmailController = async (req, res) =>
{
    try
    {

        const { email }  = req.params;
        const user = await userModel.getUserByEmail(email);//getUserByEmail is from userModel

        if (!user)
        {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json(user);
    }
    catch (error)
    {
        console.error('Error fetching user by email:', error);
        res.status(500).json({ message: 'Some error in the server' });
    }
};

//function to refgister a user
const registerUserController = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        if (!name || !email || !password || !role) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const existingUser = await userModel.getUserByEmail(email); // getUserByEmail is from userModel
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // Create the user in the database
        await userModel.createUser(name, email, hashedPassword, role);

        res.status(201).json({
            message: 'User registered successfully',
            role, // Include the user's role in the response
            name, // Optionally include the user's name
        });
    } catch (error) {
        console.error('Some error in registering the user:', error);
        res.status(500).json({ message: 'Some error in the server' });
    }
};

//function to login the user
const loginUserController = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        const user = await userModel.getUserByEmail(email); // getUserByEmail is from userModel

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Compare the hashed password
        const passwordMatch = await bcrypt.compare(password, user.passwordHash);
        if (!passwordMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }  
        
        const token = jwt.sign(
            { userId: user.userId, name: user.name, email: user.email, role: user.role },
            JWT_SECRET,
            { expiresIn: '1d' }
        );
        
        res.status(200).json({
            message: 'Login successful',
            token,
            role: user.role, // Include the user's role in the response
            name: user.name, // Optionally include the user's name
            userId:user.userId,
            email:user.email

        });
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).json({ message: 'Some error in the server' });
    }
};

//function to update the user by email
const updateUserByEmailController = async (req, res) =>
{
    try
    {
        const { email } = req.params;
        const { name, password, role } = req.body;

        const fieldsToUpdate = {};

        if (name)
        {
            fieldsToUpdate.name = name;
        }

        if (password)
        {
            const hashedPassword = await bcrypt.hash(password, 10);
            fieldsToUpdate.passwordHash = hashedPassword;
        }

        if (role && role!=='admin')
        {
            fieldsToUpdate.role = role;
        }

        if (Object.keys(fieldsToUpdate).length === 0)
        {
            return res.status(400).json({ message: 'No valid fields to update' });
        }

        await userModel.updateUserByEmail(email, fieldsToUpdate);
        //updateUserByEmail is from userModel

        res.status(200).json({ message: 'User updated successfully' });
    }
    catch (error)
    {
        console.error('Error updating user:', error);
        res.status(500).json({ message: 'Some error in the server' });
    }
};

//function to delete a user by Id
const deleteUserByIdController = async (req, res) =>
{
    try
    {
        const { id } = req.params;
        const user = userModel.getUserById(id); 
        if (user.email !== loggedInEmail) 
        {
             return res.status(403).json({ message: "Unauthorized: You can only update your own profile" });
        }
        await userModel.deleteUserById(id);//deleteUserById is from userModel
        await profileModel.deleteProfileById(id);
        await jobModel.deleteJobById(id);
        await applicationModel.deleteApplication(id);
        await resumeModel.deleteResumeById(id);
        await interviewsModel.deleteInterviewByUserId(id);
        res.status(200).json({ message: 'User deleted successfully' });
    }
    catch (error)
    {
        console.error('Error deleting user:', error);
        res.status(500).json({ message: 'Some error in the server' });
    }
};

//function to delete a user by email
const deleteUserByEmailController = async (req, res) =>
{
    try
    {
        const { email } = req.params;
        const { id } = userModel.getUserByEmail();
        await userModel.deleteUserByEmail(email);//deleteUserByEmail is from userModel

        await profileModel.deleteProfileById(id);
        await jobModel.deleteJobById(id);
        await applicationModel.deleteApplication(id);
        await resumeModel.deleteResumeById(id);
        await interviewsModel.deleteInterviewByUserId(id);

        res.status(200).json({ message: 'User deleted successfully' });
    }
    catch (error)
    {
        console.error('Error deleting user:', error);
        res.status(500).json({ message: 'Some error in the server' });
    }
};

//will be exported to userRoutes.js
module.exports =
{
    getAllUsersController,
    getUserByIdController,
    getUserByEmailController,
    registerUserController,
    loginUserController,
    updateUserByEmailController,
    deleteUserByIdController,
    deleteUserByEmailController
};
