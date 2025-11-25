import express from "express";
import {
  changeJobApplicationsStatus,
  changeVisibility,
  getCompanyApplicants,
  getCompanyData,
  getCompanyPostedJobs,
  loginCompany,
  postJob,
  registerCompany,
} from "../controllers/CompanyController.ts";
import upload from "../config/multer.ts";
import protectCompany from "../middleware/authMiddleware.ts";

const router = express.Router();

// Register Company
router.post("/register", upload.single("image"), registerCompany);

// Company login
router.post("/login", loginCompany);

// Get company data
router.get("/company-data", protectCompany, getCompanyData);

// Post a Job
router.post("/post-job", protectCompany, postJob);

// Get Applicants Data from company
router.get("/applicants", protectCompany, getCompanyApplicants);

// Get Company Job list
router.get("/list-jobs", protectCompany, getCompanyPostedJobs);

// Change Applicants Status
router.post("/change-status", protectCompany, changeJobApplicationsStatus);

// Change Applications Visibility
router.post("/change-visibility", protectCompany, changeVisibility);

export default router;
