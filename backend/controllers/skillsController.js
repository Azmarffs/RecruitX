// controllers/skillsController.js
const skillModel = require('../models/skillsModel');
const sql = require('mssql');

const createSkillController = async (req, res) => 
{
    const { skillName } = req.body;
    try 
    {
        if (req.user.role !== 'admin') 
        {
            return res.status(403).json({ message: 'Only admins can add skills.' });
        }
        await skillModel.createSkill(skillName);
        res.status(201).json({ message: 'Skill added successfully' });
    } 
    catch (error) 
    {
        res.status(500).json({ message: 'Internal server error' });
    }
};

const getAllSkillsController = async (req, res) => 
{
    try 
    {
        const skills = await skillModel.getAllSkills();
        if(skills.length===0)
        {
            res.status(400).json({ message: 'No skills avaiable' });
        }
        res.status(200).json(skills);
    } 
    catch (error) 
    {
        res.status(500).json({ message: 'Internal server error' });
    }
};

const getSkillByIdController = async (req, res) => 
{
    const { skillId } = req.params;
    try 
    {
        const skill = await skillModel.getSkillById(skillId);
        if (!skill || skill.length===0) return res.status(404).json({ message: 'Skill not found' });
        res.status(200).json(skill);
    } 
    catch (error) 
    {
        res.status(500).json({ message: 'Internal server error' });
    }
};

const getSkillByNameController = async (req, res) => 
{
    const { skillName } = req.params;
    try 
    {
        const skill = await skillModel.getSkillByName(skillName);
        if (!skill || skill.length===0) return res.status(404).json({ message: 'Skill not found' });
        res.status(200).json(skill);
    } 
    catch (error) 
    {
        res.status(500).json({ message: 'Internal server error' });
    }
};

const updateSkillByIdController = async (req, res) => 
{
    const { skillId } = req.params;
    const { skillName } = req.body;
    try 
    {
        if (req.user.role !== 'admin') 
        {
            return res.status(403).json({ message: 'Only admins can update skills.' });
        }
        await skillModel.updateSkillById(skillId, skillName);
        res.status(200).json({ message: 'Skill updated successfully' });
    } 
    catch (error) 
    {
        res.status(500).json({ message: 'Internal server error' });
    }
};

const updateSkillByNameController = async (req, res) => 
{
    const { skillName } = req.params;
    const { newName } = req.body;
    try 
    {
        if (req.user.role !== 'admin') 
        {
            return res.status(403).json({ message: 'Only admins can update skills.' });
        }
        await skillModel.updateSkillByName(skillName, newName);
        res.status(200).json({ message: 'Skill updated successfully' });
    } 
    catch (error) 
    {
        res.status(500).json({ message: 'Internal server error' });
    }
};

const deleteSkillByIdController = async (req, res) => 
{
    const { skillId } = req.params;
    try 
    {
        if (req.user.role !== 'admin') 
        {
            return res.status(403).json({ message: 'Only admins can delete skills.' });
        }

        const result = skillModel.getSkillById(skillId);

        if(!result || result.length===0)
        {
            return res.status(403).json({ message: 'Skill not found' });
        }

        await skillModel.deleteSkillById(skillId);
        res.status(200).json({ message: 'Skill deleted successfully' });
    } 
    catch (error) 
    {
        res.status(500).json({ message: 'Internal server error' });
    }
};

const deleteSkillByNameController = async (req, res) => 
{
    const { skillName } = req.params;
    try 
    {
        if (req.user.role !== 'admin') 
        {
            return res.status(403).json({ message: 'Only admins can delete skills.' });
        }

        const result = skillModel.getSkillByName(skillName);
        
        if(!result || result.length===0)
        {
            return res.status(403).json({ message: 'Skill not found' });
        }

        await skillModel.deleteSkillByName(skillName);
        res.status(200).json({ message: 'Skill deleted successfully' });
    } 
    catch (error) 
    {
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = 
{
    createSkillController,
    getAllSkillsController,
    getSkillByIdController,
    getSkillByNameController,
    updateSkillByIdController,
    updateSkillByNameController,
    deleteSkillByIdController,
    deleteSkillByNameController
};