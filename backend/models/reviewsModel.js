// models/reviewsModel.js
const sql = require('mssql');

async function postReview(applicantId, recruiterId, rating, comment) 
{
    try 
    {
        await new sql.Request()
            .input('applicantId', sql.Int, applicantId)
            .input('recruiterId', sql.Int, recruiterId)
            .input('rating', sql.Int, rating)
            .input('comment', sql.NVarChar, comment)
            .query('INSERT INTO reviews (applicantId, recruiterId, rating, comment) VALUES (@applicantId, @recruiterId, @rating, @comment)');
    } 
    catch (error) 
    {
        throw error;
    }
}

async function getReviews()
{
    const result =  await new sql.Request()
    .query('SELECT * FROM reviews');

    return result.recordset;
}

const getReviewById = async(reviewId) =>
{
    try
    {
        const result =  await new sql.Request()
        .input('reviewId', sql.Int, reviewId)
        .query('SELECT * FROM reviews WHERE reviewId=@reviewId');
    
        return result.recordset[0];
    }
    catch (error)
    {
        throw error;
    }
}
async function getReviewsByRecruiterId(recruiterId) 
{
    const result = await new sql.Request()
    .input('recruiterId', sql.Int, recruiterId)
    .query('SELECT * FROM reviews WHERE recruiterId = @recruiterId');
    return result.recordset;
}

async function getReviewsByApplicantId(applicantId) 
{
    const result = await new sql.Request()
    .input('applicantId', sql.Int, applicantId)
    .query('SELECT * FROM reviews WHERE applicantId = @applicantId');
    return result.recordset;
}

async function updateReview(reviewId, rating, comment) 
{
    try
    {
        const result = await new sql.Request()
        .input('reviewId', sql.Int, reviewId)
        .input('rating', sql.Int, rating)
        .input('comment', sql.NVarChar, comment)
        .query('UPDATE reviews SET rating = @rating, comment = @comment WHERE reviewId = @reviewId');

    }
    catch (error)
    {
        throw error;
    }
}

async function deleteReview(reviewId) 
{
    await new sql.Request()
    .input('reviewId', sql.Int, reviewId)
    .query('DELETE FROM reviews WHERE reviewId = @reviewId');
}

module.exports = 
{ 
    postReview, 
    getReviews, 
    getReviewsByRecruiterId, 
    getReviewsByApplicantId, 
    getReviewById,
    updateReview, 
    deleteReview 
};
