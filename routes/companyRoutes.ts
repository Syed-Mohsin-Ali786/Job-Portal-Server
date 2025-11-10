import express from 'express'
import { changeJobApplicationsStatus, changeVisibility, getCompanyApplicants, getCompanyData, getCompanyPostedJobs, loginComapany, postJob, registerCompany } from '../controllers/CompanyController.ts';
import upload from '../config/multer.ts';

const router=express.Router();

// Register Company
router.post('/register',upload.single('image'),registerCompany);

// Company login
router.post('/login',loginComapany);

// Get company data
router.get('/company',getCompanyData);

// Post a Job
router.post('/post-job',postJob);

// Get Applicants Data from company
router.get('/applicants',getCompanyApplicants);

// Get Company Job list
router.get('/list-jobs',getCompanyPostedJobs)

// Change Applicants Status
router.post('/change-status',changeJobApplicationsStatus);

// Change Applications Visibility
router.post('/change-visibility',changeVisibility);

export default router;