const applicantSkillsModel = require("../models/applicantSkillsModel");

const addSkillController = async (req, res) => 
{
    try 
    {
        const { applicantId, skillName } = req.body;
        const result = await applicantSkillsModel.addApplicantSkill(applicantId, skillName);
        res.status(201).json(result);
    } 
    catch (error) 
    {
        res.status(500).json({ error: error.message });
    }
};

const getSkillsController = async (req, res) => 
{
    try 
    {
        const { applicantId } = req.params;
        const result = await applicantSkillsModel.getApplicantSkills(applicantId);
        res.status(200).json(result);
    } 
    catch (error) 
    {
        res.status(500).json({ error: error.message });
    }
};

const updateSkillController = async (req, res) => 
{
    try 
    {
        const { skillId } = req.params;
        const { applicantId, newSkillName } = req.body;
        const result = await applicantSkillsModel.updateApplicantSkill(skillId, applicantId, newSkillName);
        res.status(200).json(result);
    } 
    catch (error) 
    {
        res.status(500).json({ error: error.message });
    }
};

const deleteSkillController = async (req, res) => 
{
    try 
    {
        const { skillId } = req.params;
        const { applicantId } = req.body;
        const result = await applicantSkillsModel.deleteApplicantSkill(skillId, applicantId);
        res.status(200).json(result);
    } 
    catch (error) 
    {
        res.status(500).json({ error: error.message });
    }
};

const deleteAllSkillsController = async (req, res) => 
{
    try 
    {
        const { applicantId } = req.params;
        const result = await applicantSkillsModel.deleteAllApplicantSkills(applicantId);
        res.status(200).json(result);
    } 
    catch (error) 
    {
        res.status(500).json({ error: error.message });
    }
};

module.exports =
{ 
    addSkillController, 
    getSkillsController, 
    updateSkillController, 
    deleteSkillController, 
    deleteAllSkillsController 
};

