const profileModel = require('../models/profileModel');
const userModel = require('../models/userModel'); // Import users model to check user existence

//get all the profiles
const getAllProfilesController = async (req, res) =>
{
    try
    {
        const profiles = await profileModel.getAllProfiles();
        res.status(200).json(profiles);
    }
    catch (error)
    {
        res.status(500).json({ message: 'Error fetching profiles', error: error.message });
    }
};

//get a profile by profile id
const getProfileByIdController = async (req, res) =>
{
    try
    {
        const { id } = req.params;
        if(!id)
        {
            return res.status(400).json({ message: 'Id is required' });
        }
        const profile = await profileModel.getProfileById(id);

        if (!profile)
        {
            return res.status(404).json({ message: 'Profile not found' });
        }

        res.status(200).json(profile);
    }
    catch (error)
    {
        res.status(500).json({ message: 'Error fetching profile', error: error.message });
    }
};

//get a profile by user Id
//to be used by admin log
const getProfileByUserIdController = async (req, res) =>
{
    try
    {
        const { userId } = req.params;
        const profile = await profileModel.getProfileByUserId(userId);

        if (!profile || !userId)
        {
            return res.status(404).json({ message: 'Profile not found or invalid userId' });
        }

        res.status(200).json(profile);
    }
    catch (error)
    {
        res.status(500).json({ message: 'Error fetching profile', error: error.message });
    }
};

const createProfileController = async (req, res) => 
{
    const { userId, bio, address, experienceLevel} = req.body;
    if (!userId) 
    {
        return res.status(400).json({ message: 'UserId is required' });
    }
    try 
    {
        // Check if user exists
        const user = await userModel.getUserById(userId); 
        if (!user) 
        {
            return res.status(404).json({ message: 'User does not exist. Cannot create profile.' });
        }

        // Check if profile already exists
        const existingProfile = await profileModel.getProfileByUserId(userId);
        if (existingProfile) 
        {
            return res.status(400).json({ message: 'Profile already exists for this user.' });
        }

        await profileModel.createProfile(userId, bio, address, experienceLevel);
        res.status(201).json({ message: 'Profile created successfully' });
    } 
    catch (error) 
    {
        console.error('Error creating profile:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const getProfileByEmailController = async (req, res) => 
{
    try 
    {
        const { email } = req.params;

        if (!email) 
        {
            return res.status(400).json({ message: "Email is required" });
        }

        const profile = await profileModel.getProfileByEmail(email);

        if (!profile) 
        {
            return res.status(404).json({ message: "Profile not found" });
        }

        res.status(200).json(profile);
    } 
    catch (error) 
    {
        console.error("Error fetching profile:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

//update a profile by profile id
const updateProfileByIdController = async (req, res) =>
{
    try
    {
        const { id } = req.params;
        if(!id)
        {
            res.status(404).json({message: 'Id is required'});
        }
        const fieldsToUpdate = req.body;

        await profileModel.updateProfileById(id, fieldsToUpdate);

        res.status(200).json({ message: 'Profile updated successfully' });
    }
    catch (error)
    {
        res.status(500).json({ message: 'Error updating profile', error: error.message });
    }
};

//delete a profile by profile id
const deleteProfileByIdController = async (req, res) =>
{
    try
    {
        const { id } = req.params;
        if(!id)
        {
            res.status(404).json({message: 'Id is required'});
        }
        await profileModel.deleteProfileById(id);

        res.status(200).json({ message: 'Profile deleted successfully' });
    }
    catch (error)
    {
        res.status(500).json({ message: 'Error deleting profile', error: error.message });
    }
};

module.exports =
{
    getAllProfilesController,
    getProfileByIdController,
    getProfileByUserIdController,
    createProfileController,
    updateProfileByIdController,
    deleteProfileByIdController,
    getProfileByEmailController
};
