const interviewsModel = require('../models/interviewsModel');

const postInterviewController = async (req, res) => 
{
    try 
    {
        const { applicationId, applicantId, recruiterId, interviewDate } = req.body;

        if (!applicantId || !applicantId || !recruiterId || !interviewDate) 
        {
            return res.status(400).json({ message: 'All fields are required' });
        }

        if(req.user.role!='recruiter')
        {
            return res.status(400).json({ message: 'Only Recruiters can post Interviews' });
        }

        const result = await interviewsModel.postInterview(applicationId, applicantId, recruiterId, interviewDate);
        res.status(201).json({ message: 'Interview Posted Successfully', result });
    } 
    catch (error) 
    {
        res.status(500).json({ message: 'Error creating application', error: error.message });
    }
};


const getInterviewsController = async (req, res) => 
{
    try
    {
        const result = await interviewsModel.getInterviews();

        // Correctly check if result is empty
        if (!result || result.length === 0) 
        {
            return res.status(404).json({ message: 'No interviews found' });
        }

        res.status(200).json(result);
    } 
    catch (error)
    {
        console.error('Error retrieving interviews:', error.message);
        res.status(500).json({ message: 'Internal server error' });
    }
};


const getInterviewByInterviewIdController = async (req,res)=>
{
    try
    {
        const {interviewId} = req.params;
        const result = await interviewsModel.getInterviewByInterviewId(interviewId);

        if(!result)
        {
            return res.status(400).json({ message: 'No Interview Found' });
        }

        res.status(200).json(result);
    }
    catch (error) 
    {
        console.error('Error retrieving interviews:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

const getInterviewByApplicantIdController = async (req,res)=>
{
        try
        {
            const {applicantId} = req.params;

            if(Number(applicantId) !== req.user.userId)
            {
                return res.status(400).json({ message: 'One can get her/his interviews' });
            }

            const result = await interviewsModel.getInterviewByUserId(applicantId);
    
            if (!result || result.length === 0)
            {
                return res.status(404).json({ message: 'No Interview Found' });
            }
            
            res.status(200).json(result);
        }
        catch (error) 
        {
            console.error('Error retrieving interviews:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
}

const updateInterviewDateController = async (req,res)=>
{
    try
    {
        const {interviewId} = req.params;
        const {newDate} = req.body;
        const fieldsToUpdate = {};
    
        if(req.user.role!='recruiter')
        {
            return res.status(400).json({ message: 'Only Recruiter can change date' });
        }

        if(interviewId)
        {
            fieldsToUpdate.interviewId=interviewId;
        }

        if(newDate)
        {
            fieldsToUpdate.newDate=newDate;
        }

        if (Object.keys(fieldsToUpdate).length === 0)
        {
            return res.status(400).json({ message: 'No valid fields to update' });
        }


        const result = await interviewsModel.getInterviewByInterviewId(interviewId);
        
        if(!result)
        {
            return res.status(400).json({ message: 'No Interview Found' });
        }
        
        await interviewsModel.updateInterviewDate(interviewId,newDate); 
        return res.status(200).json({ message: 'Interview Date Updated' });  

    }
    catch (error) 
    {
        console.error('Error retrieving interviews:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

const deleteInterviewByInterviewIdController = async (req,res) =>
{
    try
    {
        const {interviewId}=req.params;
    const result = await interviewsModel.getInterviewByInterviewId(interviewId);
        
    if(!result || result.length===0)
    {
        return res.status(400).json({ message: 'No Interview Found' });
    }
    
    if(req.user.role!='recruiter')
    {
        return res.status(400).json({ message: 'Only Recruiter can delete interview' });
    }

    await interviewsModel.deleteInterviewByInterviewId(interviewId);
    return res.status(200).json({ message: 'Interview Deleted' });  

    }

    catch (error) 
    {
        console.error('Error deleting interview:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}


module.exports = 
{
    postInterviewController,
    getInterviewsController,
    getInterviewByInterviewIdController,
    getInterviewByApplicantIdController,
    updateInterviewDateController,
    deleteInterviewByInterviewIdController
};