// model / jobsCategoryModel.js

const db = require('../db');
const sql = require('mssql');

// CREATE category
const createCategory = async (categoryName) => 
{
    try
    {
        const result = await new sql.Request()
            .input('categoryName', sql.VarChar, categoryName)
            .query('INSERT INTO jobCategories (categoryName) VALUES (@categoryName)');
        
        return result.recordset;
    }
    catch (error)
    {
        throw error;
    }
};

// GET all categories
const getAllCategories = async () => 
{
    const result = await sql.query`SELECT * FROM jobCategories`;
    return result.recordset;
};

// GET category by ID
const getCategoryById = async (categoryId) => 
{
    try 
    {
        const request = new sql.Request(); 
        request.input('categoryId', sql.Int, categoryId);

        const result = await request.query('SELECT * FROM jobCategories WHERE categoryId = @categoryId');

        return result.recordset;
    } 
    catch (error) 
    {
        console.error('Error retrieving category:', error);
        throw error;
    }
};
    
const getCategoryByName = async (categoryName) => 
{
    try 
    {
        const request = new sql.Request();
        
        // Ensure categoryName is passed correctly as a string
        request.input('categoryName', sql.NVarChar, `%${categoryName}%`); 

        const result = await request.query(
            'SELECT * FROM jobCategories WHERE categoryName LIKE @categoryName'
        );

        return result.recordset;
    } 
    catch (error) 
    {
        console.error('Error retrieving category:', error);
        throw error;
    }
};



// UPDATE category by ID
const updateCategoryById = async (categoryId, categoryName) => 
{
    try 
    {
        const request = new sql.Request();

        request.input('categoryName', sql.NVarChar, categoryName);
        request.input('categoryId', sql.Int, categoryId);

        const result = await request.query(`UPDATE jobCategories SET categoryName = @categoryName WHERE categoryId = @categoryId`);
        
        return result.rowsAffected[0];
    } 
    catch (error) 
    {
        throw error;
    }
};

const updateCategoryByName = async (categoryName,newName) => 
{
        try 
        {
            const request = new sql.Request();
    
            request.input('categoryName', sql.NVarChar, categoryName);
            request.input('newName', sql.NVarChar, newName);
    
            const result = await request.query(`UPDATE jobCategories SET categoryName = @newName WHERE categoryName = @categoryName`);
            
            return result.rowsAffected[0];
        } 
        catch (error) 
        {
            throw error;
        }
};
    

// DELETE category by ID
const deleteCategoryById = async (categoryId) => 
{
    const result = new sql.Request();
    result.input('categoryId', categoryId);
    await result.query(`DELETE FROM jobCategories WHERE categoryId = @categoryId`);
    return result.recordset;
};

// DELETE category by Name
const deleteCategoryByName = async (categoryName) => 
    {
        const result = new sql.Request();
        result.input('categoryName', sql.NVarChar, categoryName);
        await result.query(`DELETE FROM jobCategories WHERE categoryName = @categoryName`);
        return result.recordset;
    };

// GET most applied categories
const mostAppliedCategories = async () => 
    {
        try 
        {
            const result = new sql.Request();
            await result.query('DROP VIEW IF EXISTS MostAppliedCategories');
            await result.query(`
                CREATE VIEW MostAppliedCategories AS
                (SELECT TOP 10 jc.categoryName, COUNT(a.applicationId) AS applicationCount
                FROM jobCategories jc JOIN jobs j ON jc.categoryName = j.category
                JOIN applications a ON j.jobId = a.jobId
                GROUP BY jc.categoryName
                ORDER BY COUNT(a.applicationId) DESC);
            `);
            
            return result.recordset;
        } 
        catch (error) 
        {
            console.error('Error retrieving most applied categories:', error);
            throw error;
        }
    };

module.exports = 
{
    createCategory,
    getAllCategories,
    getCategoryById,
    getCategoryByName,
    updateCategoryById,
    updateCategoryByName,
    deleteCategoryById,
    deleteCategoryByName,
    mostAppliedCategories
};
