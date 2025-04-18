const jobCategoryModel = require('../models/jobCategoryModel');
const sql = require('mssql');

// CREATE category
const createCategoryController = async (req, res) => 
{
    const { categoryName } = req.body;
    try 
    {
        if (req.user.role !== 'admin') 
        {
            return res.status(403).json({ message: 'Only admins can create categories.' });
        }
        await jobCategoryModel.createCategory(categoryName);
        res.status(201).json({ message: 'Category created successfully' });
    } 
    catch (error) 
    {
        console.error('Error creating category:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// GET all categories
const getAllCategoriesController = async (req, res) => 
{
    try 
    {
        const categories = await jobCategoryModel.getAllCategories();
        res.status(200).json(categories);
    } 
    catch (error) 
    {
        console.error('Error retrieving categories:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// GET category by ID
const getCategoryByIdController = async (req, res) => 
{
    const { categoryId } = req.params;
    try 
    {
        const category = await jobCategoryModel.getCategoryById(categoryId);
        if (!category) 
        {
            return res.status(404).json({ message: 'Category not found' });
        }
        res.status(200).json(category);
    } 
    catch (error) 
    {
        console.error('Error retrieving category:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// GET category by Name
const getCategoryByNameController = async (req, res) => 
    {
        const { categoryName } = req.params;
        try 
        {
            const category = await jobCategoryModel.getCategoryByName(categoryName);
            if (!category) 
            {
                return res.status(404).json({ message: 'Category not found' });
            }
            res.status(200).json(category);
        } 
        catch (error) 
        {
            console.error('Error retrieving category:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    };
    

// UPDATE category by ID
const updateCategoryByIdController = async (req, res) => 
{
    const { categoryId } = req.params;
    const { categoryName } = req.body;
    try 
    {
        if (req.user.role !== 'admin') 
        {
            return res.status(403).json({ message: 'Only admins can change categories.' });
        }

        const category = await jobCategoryModel.getCategoryById(categoryId);
        if (!category) 
        {
            return res.status(404).json({ message: 'Category not found' });
        }

        if (req.user.role !== 'recruiter') 
        {
            return res.status(403).json({ message: 'Only recruiters can create categories.' });
        }

        await jobCategoryModel.updateCategoryById(categoryId, categoryName);
        res.status(200).json({ message: 'Category updated successfully' });
    } 
    catch (error) 
    {
        console.error('Error updating category:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// UPDATE category by ID
const updateCategoryByNameController = async (req, res) => 
    {
        const { categoryName } = req.params;
        const { newName } = req.body;
        try 
        {
            if (req.user.role !== 'admin') 
            {
                return res.status(403).json({ message: 'Only admins can change categories.' });
            }

            const category = await jobCategoryModel.getCategoryByName(categoryName);
            if (!category) 
            {
                return res.status(404).json({ message: 'Category not found' });
            }
    
            if (req.user.role !== 'recruiter') 
            {
                return res.status(403).json({ message: 'Only recruiters can create categories.' });
            }
    
            await jobCategoryModel.updateCategoryByName(categoryName,newName);
            res.status(200).json({ message: 'Category updated successfully' });
        } 
        catch (error) 
        {
            console.error('Error updating category:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    };
    

// DELETE category by ID
const deleteCategoryByIdController = async (req, res) => 
{
    const { categoryId } = req.params;
    try 
    {
        if (req.user.role !== 'admin') 
        {
            return res.status(403).json({ message: 'Only admins can delete categories.' });
        }

        const category = await jobCategoryModel.getCategoryById(categoryId);
        if (!category) 
        {
            return res.status(404).json({ message: 'Category not found' });
        }
        await jobCategoryModel.deleteCategoryById(categoryId);
        res.status(200).json({ message: 'Category deleted successfully' });
    } 
    catch (error) 
    {
        console.error('Error deleting category:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// DELETE category by ID
const deleteCategoryByNameController = async (req, res) => 
    {
        const { categoryName } = req.params;
        try 
        {
            if (req.user.role !== 'admin') 
            {
                return res.status(403).json({ message: 'Only admins can delete categories.' });
            }
                
            const category = await jobCategoryModel.getCategoryByName(categoryName);
            if (!category) 
            {
                return res.status(404).json({ message: 'Category not found' });
            }
            await jobCategoryModel.deleteCategoryByName(categoryName);
            res.status(200).json({ message: 'Category deleted successfully' });
        } 
        catch (error) 
        {
            console.error('Error deleting category:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    };

const mostAppliedCategoriesController = async (req, res) => 
{
    try
    {
        await jobCategoryModel.mostAppliedCategories();  // Ensure the view is created properly
        
        const result = await sql.query(`SELECT * FROM MostAppliedCategories`);  // Correct way to query a view
        
        if (!result.recordset || result.recordset.length === 0) 
        {
            return res.status(404).json({ message: 'Categories not found' });
        }
        
        res.status(200).json(result.recordset);
    } 
    catch (error) 
    {
        res.status(500).json({ error: error.message });
    }
};

module.exports = 
{
    createCategoryController,
    getAllCategoriesController,
    getCategoryByIdController,
    getCategoryByNameController,
    updateCategoryByIdController,
    updateCategoryByNameController,
    deleteCategoryByIdController,
    deleteCategoryByNameController,
    mostAppliedCategoriesController
};
