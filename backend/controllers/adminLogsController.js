const adminLogsModel = require('../models/adminLogsModel');

const createAdminLogController = async (req, res) => 
{
    try 
    {
        const { name, action } = req.body;
        if (!name || !action ) 
        {
            return res.status(400).json({ message: 'All fields are required' });
        }
        const log = await adminLogsModel.createAdminLog(name, action);
        res.status(201).json({ message: 'Admin log created successfully', log });
    } 
    catch (error) 
    {
        console.error('Error creating admin log:', error);
        res.status(500).json({ message: 'Error in the server' });
    }
};

const getAllAdminLogsController = async (req, res) => 
{
    try 
    {
        const logs = await adminLogsModel.getAllAdminLogs();
        res.status(200).json(logs);
    } 
    catch (error) 
    {
        console.error('Error retrieving admin logs:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const getAdminLogByIdController = async (req, res) => 
{
    try 
    {
        const { adminId } = req.params;
        const log = await adminLogsModel.getAdminLogById(adminId);
        if (!log) 
        {
            return res.status(404).json({ message: 'Admin log not found' });
        }
        res.status(200).json(log);
    } 
    catch (error) 
    {
        console.error('Error retrieving admin log:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const updateAdminLogByIdController = async (req, res) => 
{
    try 
    {
        const { adminId } = req.params;
        if (!adminId) 
        {
            return res.status(400).json({ message: 'Admin Id required' });
        }
        const fieldsToUpdate = req.body;

        if (Object.keys(fieldsToUpdate).length === 0) 
        {
            return res.status(400).json({ message: 'No fields provided for update' });
        }

        await adminLogsModel.updateAdminLogById(adminId, fieldsToUpdate);
        res.status(200).json({ message: 'Admin log updated successfully' });
    } 
    catch (error) 
    {
        console.error('Error updating admin log:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const deleteAdminLogByIdController = async (req, res) => 
{
    try 
    {
        const { adminId } = req.params;
        if (!adminId) 
        {
            return res.status(400).json({ message: 'Admin Id required' });
        }
        await adminLogsModel.deleteAdminLogById(adminId);
        res.status(200).json({ message: 'Admin log deleted successfully' });
    } 
    catch (error) 
    {
        console.error('Error deleting admin log:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = 
{
    getAllAdminLogsController,
    createAdminLogController,
    getAdminLogByIdController,
    updateAdminLogByIdController,
    deleteAdminLogByIdController
};
