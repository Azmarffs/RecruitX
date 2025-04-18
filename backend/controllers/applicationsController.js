const applicationModel = require('../models/applicationModel');

const createApplicationController = async (req, res) => 
{
    try 
    {
        const { applicantId, jobId, resume } = req.body;

        // if (!applicantId || !jobId || !resume) 
        // {
        //     return res.status(400).json({ message: 'All fields are required' });
        // }

        // if(req.user.role!='applicant')
        // {
        //     return res.status(400).json({ message: 'Only Applicants can apply for the job' });
        // }

        const result = await applicationModel.createApplication(applicantId, jobId, resume);
        res.status(201).json({ message: 'Application submitted successfully', result });
    } 
    catch (error) 
    {
        res.status(500).json({ message: 'Error creating application', error: error.message });
    }
};

const getApplicationsController = async (req,res)=>
{
    try
    {
        const result = await applicationModel.getApplications();
        if (!result) 
        {
            return res.status(404).json({ message: 'Applications not found' });
        }
        res.json(result);
    }

    catch (error) 
    {
        res.status(500).json({ message: 'Error fetching application', error: error.message });
    }

}

const getApplicationByIdController = async (req, res) => 
{
    try 
    {
        const { applicationId } = req.params;
        const result = await applicationModel.getApplicationById(applicationId);

        if (!result) 
        {
            return res.status(404).json({ message: 'Application not found' });
        }

        res.json(result);
    } 
    catch (error) 
    {
        res.status(500).json({ message: 'Error fetching application', error: error.message });
    }
};

const getApplicationsByApplicantController = async (req, res) => 
{
    try 
    {
        const { applicantId } = req.params;
        if(req.user.role!=='admin' && (Number(req.user.userId)!=applicantId))
        {
            return res.status(400).json({ message: 'One can get her/his applications only' });
        }

        const result = await applicationModel.getApplicationsByApplicant(applicantId);

        if (result.length === 0) 
        {
            return res.status(404).json({ message: 'No applications found for this applicant' });
        }

        res.json(result);
    } 
    catch (error) 
    {
        res.status(500).json({ message: 'Error fetching applications', error: error.message });
    }
};

const getApplicationsByJobIdController = async (req, res) => 
    {
        try 
        {
            const { jobId } = req.params;
            const result = await applicationModel.getApplicationsByJobId(jobId);
    
            if (result.length === 0) 
            {
                return res.status(404).json({ message: 'No applications found for this Job' });
            }
    
            res.json(result);
        } 
        catch (error) 
        {
            res.status(500).json({ message: 'Error fetching applications', error: error.message });
        }
    };
    

const updateApplicationStatusController = async (req, res) => 
{
    try 
    {
        const { applicationId } = req.params;
        const { newStatus } = req.body;

        if(req.user.role!='recruiter')
        {
            return res.status(400).json({ message: 'Only Recruiters can change the job status' });
        }

        const allowedStatuses = ['Applied', 'Shortlisted', 'Interview Scheduled', 'Rejected', 'Hired'];

        if (!newStatus || !allowedStatuses.includes(newStatus)) 
        {
            return res.status(400).json({ message: `Invalid status. Allowed values: ${allowedStatuses.join(', ')}` });
        }

        const result = await applicationModel.updateApplicationStatus(applicationId, newStatus);

        if (result === 0) 
        {
            return res.status(404).json({ message: 'Application not found or no update made' });
        }

        res.json({ message: 'Application status updated successfully' });
    } 
    catch (error) 
    {
        res.status(500).json({ message: 'Error updating application status', error: error.message });
    }
};


const deleteApplicationController = async (req, res) => 
{
    try 
    {
        const { applicationId } = req.params;

        if(req.user.role!='applicant')
        {
            return res.status(400).json({ message: 'Only Applicantiters can delete its application' });
        }

        const checkPoint = await applicationModel.getApplicantByApplicationId(applicationId)

       
        //record is just a name given to objects in the checkPoint array
        if (!checkPoint.some(record => record.applicantId === req.user.userId)) 
        {
            return res.status(400).json({ message: 'Applicants can only delete their own applications.' });
        }

        const result = await applicationModel.deleteApplication(applicationId);

        if (result === 0) 
        {
            return res.status(404).json({ message: 'Application not found' });
        }

        res.json({ message: 'Application deleted successfully' });
    } 
    catch (error) 
    {
        res.status(500).json({ message: 'Error deleting application', error: error.message });
    }
};

module.exports = 
{
    createApplicationController,
    getApplicationsController,
    getApplicationByIdController,
    getApplicationsByApplicantController,
    getApplicationsByJobIdController,
    updateApplicationStatusController,
    deleteApplicationController
};
