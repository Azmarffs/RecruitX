// controllers/reviewsController.js
const reviewsModel = require('../models/reviewsModel');

const postReviewController = async (req, res) => 
{
    try 
    {
        const { recruiterId, rating, comment } = req.body;
        if (!recruiterId || !rating || !comment) 
        {
            return res.status(400).json({ message: 'All entries are required' });
        }

        if (req.user.role !== 'applicant') 
        {
            return res.status(400).json({ message: 'Only applicants can post reviews' });
        }

        const result = await reviewsModel.postReview(Number(req.user.userId), recruiterId, rating, comment);
        res.status(201).json({ message: 'Review Posted Successfully', result });
    } 
    catch (error) 
    {
        res.status(500).json({ message: 'Error posting review', error: error.message });
    }
};

const getReviewsController = async (req, res) => 
{
    try 
    {
        const result = await reviewsModel.getReviews();
        if (!result || result.length === 0) 
        {
            return res.status(404).json({ message: 'No reviews found' });
        }
        res.status(200).json(result);
    } 
    catch (error) 
    {
        res.status(500).json({ message: 'Internal server error' });
    }
};

const getReviewsByRecruiterIdController = async (req, res) => 
{
    try 
    {
        const { recruiterId } = req.params;
        const result = await reviewsModel.getReviewsByRecruiterId(recruiterId);
        if (!result || result.length === 0) 
        {
            return res.status(404).json({ message: 'No reviews found for this recruiter' });
        }
        res.status(200).json(result);
    } 
    catch (error) 
    {
        res.status(500).json({ message: 'Internal server error' });
    }
};

const getReviewsByApplicantIdController = async (req, res) => 
{
    try 
    {
        const { applicantId } = req.params;
        if (Number(applicantId) !== req.user.userId) 
        {
            return res.status(400).json({ message: 'You can only view your own reviews' });
        }
        const result = await reviewsModel.getReviewsByApplicantId(applicantId);
        if (!result || result.length === 0)
        {
            return res.status(404).json({ message: 'No reviews found' });
        }
        res.status(200).json(result);
    } 
    catch (error) 
    {
        res.status(500).json({ message: 'Internal server error' });
    }
};

const updateReviewController = async (req, res) => 
{
    try 
    {
       
        const { reviewId } = req.params;
        const { rating, comment } = req.body;
        if (!rating && !comment) 
        {
            return res.status(400).json({ message: 'Nothing to update' });
        }

        const review = await reviewsModel.getReviewById(reviewId);

        if (review.length===0 || review.applicantId !== Number(req.user.userId)) 
        {
            return res.status(403).json({ message: 'Not Exists or Unauthorized to update this review' });
        }
     
        await reviewsModel.updateReview(reviewId, rating, comment);
        res.status(200).json({ message: 'Review Updated' });
    } 
    catch (error) 
    {
        res.status(500).json({ message: 'Internall server error' });
    }
};

const deleteReviewController = async (req, res) => 
{
    try 
    {
        const { reviewId } = req.params;
        const review = await reviewsModel.getReviewById(reviewId);
        console.log(review.applicantId);
        if (review.applicantId !== Number(req.user.userId))
        {
            return res.status(403).json({ message: 'Not Exists or Unauthorized to delete this review' });
        }
        await reviewsModel.deleteReview(reviewId);
        res.status(200).json({ message: 'Review Deleted' });
    } 
    catch (error) 
    {
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = 
{
    postReviewController,
    getReviewsController,
    getReviewsByRecruiterIdController,
    getReviewsByApplicantIdController,
    updateReviewController,
    deleteReviewController
};
