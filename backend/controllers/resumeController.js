const resumeModel = require("../models/resumeModel");
const fs = require("fs");

const uploadResumeController = async (req, res) => 
{
    try 
    {
        const userId = req.user.userId;
        const resumeName = req.file.filename;
        const resumePath = req.file.path;

        if(!userId)
        {
            res.status(404).json({message: 'userId is required'});
        }

        await resumeModel.uploadResume(userId, resumeName, resumePath);
        res.status(201).json({ success: true, message: "Resume uploaded successfully" });
    } 
    catch (error) 
    {
        res.status(500).json({ success: false, message: "Error uploading resume", error: error.message });
    }
};

const getResumeByEmailController = async (req, res) => 
{
    try 
    {
        const email = req.params.email;
        const resume = await resumeModel.getResumeByEmail(email);

        if (!resume || !email) 
        {
            return res.status(404).json({ success: false, message: "Resume not found or email not given" });
        }

        res.status(200).json({ success: true, resume });
    } 
    catch (error) 
    {
        res.status(500).json({ success: false, message: "Error retrieving resume", error: error.message });
    }
};

const deleteResumeController = async (req, res) => 
{
    try 
    {
        const { email } = req.params;

        if (!email) 
        {
            return res.status(400).json({ success: false, message: "Email is required" });
        }

        const result = await resumeModel.deleteResume(email);

        if (!result.success) 
        {
            return res.status(404).json(result);
        }

        return res.status(200).json(result);
    } 
    catch (error) 
    {
        return res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};
    

module.exports =
{ 
    uploadResumeController,
    getResumeByEmailController,
    deleteResumeController 
};
