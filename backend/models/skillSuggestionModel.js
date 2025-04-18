// models/skillSuggestionModel.js
const sql = require('mssql');

// CREATE trigger
const createTrigger = async () => 
{
    const temp = `DROP TRIGGER IF EXISTS trg_SuggestSkillsOnRejection;`;
    await sql.query(temp);

    const query = `
        CREATE TRIGGER trg_SuggestSkillsOnRejection
        ON applications
        AFTER UPDATE
        AS
        BEGIN
            INSERT INTO skillSuggestion (applicantId, skillId, suggestionReason, suggestedAt)
            SELECT 
                a.applicantId, 
                s.skillId, 
                'Application Rejection', 
                GETDATE()
            FROM inserted i
            JOIN applications a ON i.applicationId = a.applicationId
            JOIN jobs j ON a.jobId = j.jobId
            JOIN jobCategories jc ON j.category = jc.categoryName
            JOIN skills s ON jc.categoryName = s.category
            WHERE i.status = 'Rejected';
        END;
    `;
    await sql.query(query);
};

// GET skill suggestions by applicant
const getSkillSuggestionsByApplicant = async (applicantId) => 
{
    const request = new sql.Request();
    request.input('applicantId', sql.Int, applicantId);
    const result = await request.query('SELECT * FROM skillSuggestion WHERE applicantId = @applicantId');
    return result.recordset;
};

// UPDATE skill suggestion
const updateSkillSuggestion = async (suggestionId, suggestionReason) => 
{
    const request = new sql.Request();
    request.input('suggestionId', sql.Int, suggestionId);
    request.input('suggestionReason', sql.NVarChar, suggestionReason);
    await request.query('UPDATE skillSuggestion SET suggestionReason = @suggestionReason WHERE suggestionId = @suggestionId');
};

// DELETE skill suggestion
const deleteSkillSuggestion = async (suggestionId) =>
{
    const request = new sql.Request();
    request.input('suggestionId', sql.Int, suggestionId);
    await request.query('DELETE FROM skillSuggestion WHERE suggestionId = @suggestionId');
};

module.exports =
{
    createTrigger,
    getSkillSuggestionsByApplicant,
    updateSkillSuggestion,
    deleteSkillSuggestion
};
