// controllers/skillSuggestionController.js
const skillSuggestionModel = require('../models/skillSuggestionModel');
const sql = require('mssql');

// CREATE trigger (Admin only)
const createTrigger = async (req, res) => 
{
    try 
    {
        if (req.user.role !== 'admin') 
        {
            return res.status(403).json({ message: 'Only admins can create triggers.' });
        }

        await skillSuggestionModel.createTrigger();
        res.status(201).json({ message: 'Trigger created successfully' });
    } 
    catch (error) 
    {
        console.error('Error creating trigger:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// GET skill suggestions by applicant
const getSkillSuggestionsByApplicant = async (req, res) => 
    {
    const { applicantId } = req.params;
    try 
    {
        if(req.user.role==='recruiter')
        {
            return res.status(400).json({ message: 'Suggestions are for applicants' });
        }
        const suggestions = await skillSuggestionModel.getSkillSuggestionsByApplicant(applicantId);
        if (!suggestions.length) 
        {
            return res.status(404).json({ message: 'No skill suggestions found' });
        }
        res.status(200).json(suggestions);
    } 
    catch (error) 
    {
        console.error('Error retrieving skill suggestions:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// UPDATE skill suggestion (Admin only)
const updateSkillSuggestion = async (req, res) => 
{
    const { suggestionId } = req.params;
    const { suggestionReason } = req.body;
    try 
    {
        if (req.user.role !== 'admin')
        {
            return res.status(403).json({ message: 'Only admins can update skill suggestions.' });
        }

        await skillSuggestionModel.updateSkillSuggestion(suggestionId, suggestionReason);
        res.status(200).json({ message: 'Skill suggestion updated successfully' });
    } 
    catch (error) 
    {
        console.error('Error updating skill suggestion:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// DELETE skill suggestion (Admin only)
const deleteSkillSuggestion = async (req, res) => 
{
    const { suggestionId } = req.params;
    try 
    {
        if (req.user.role !== 'admin') 
        {
            return res.status(403).json({ message: 'Only admins can delete skill suggestions.' });
        }

        await skillSuggestionModel.deleteSkillSuggestion(suggestionId);
        res.status(200).json({ message: 'Skill suggestion deleted successfully' });
    } 
    catch (error) 
    {
        console.error('Error deleting skill suggestion:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = 
{
    createTrigger,
    getSkillSuggestionsByApplicant,
    updateSkillSuggestion,
    deleteSkillSuggestion
};