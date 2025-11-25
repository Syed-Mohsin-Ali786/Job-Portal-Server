import { Request, Response, NextFunction } from "express";
import Company from "../models/Company";
import bcrypt from "bcryptjs";
import { v2 as cloudinary } from "cloudinary";
import generateToken from "../util/generateToken";
import Job from "../models/Job";
import JobApplication from "../models/JobApplications";

// Register a New company
export const registerCompany = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { name, email, password } = req.body;
  const imageFile = req.file;

  if (!name || !email || !password || !imageFile) {
    return res.json({ success: false, message: "missing details" });
  }
  try {
    const companyExist = await Company.findOne({ email });
    if (companyExist) {
      return res.json({ success: false, message: "Company Already Exist" });
    }

    const salt = await bcrypt.genSalt(12);
    const hashPassword = await bcrypt.hash(password, salt);
    const imageUpload = await cloudinary.uploader.upload(imageFile.path);
    // if(!imageUpload){
    //   return res.json({success:false,message:"cl fail"})
    // }
    const company = await Company.create({
      name,
      email,
      password: hashPassword,
      image: imageUpload.secure_url,
    });
    res.json({
      success: true,
      company: {
        _id: company._id,
        name: company.name,
        email: company.email,
        image: company.image,
      },
      token: generateToken(company._id as string),
    });
  } catch (error) {
    next(error);
  }
};

// Company Login
export const loginCompany = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password } = req.body;

  try {
    const company = await Company.findOne({ email });
    if (!company) {
      return res.json({
        success: false,
        message: "Invalid email ",
      });
    }
    const compare = await bcrypt.compare(password, company.password);
    if (!compare) {
      return res.json({
        success: false,
        message: "Invalid password",
      });
    }

    res.json({
      success: true,
      company: {
        _id: company._id,
        name: company.name,
        email: company.email,
        image: company.image,
      },
      token: generateToken(company._id as string),
    });
  } catch (error) {
    next(error);
  }
};

// Get Comapany Data
export const getCompanyData = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const company = req.company;
    if (!company) {
      res.json({
        success: false,
        message: "Not found",
      });
    }
    res.json({
      success: true,
      company,
    });
  } catch (error) {
    next(error);
  }
};

// Post a new job
export const postJob = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { title, description, location, salary, level, category } = req.body;
  const companyId = req.company?._id;

  try {
    const newJob = new Job({
      title,
      description,
      location,
      salary,
      category,
      companyId,
      level,
      date: Date.now(),
    });
    await newJob.save();
    res.status(200).json({
      success: true,
      newJob,
    });
  } catch (error) {
    next(error);
  }
};

// Get company job applicant
export const getCompanyApplicants = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const companyId = req.company?._id;
    // Find job applications
    const applications = await JobApplication.find({ companyId })
      .populate("userId", "name image resume")
      .populate("jobId", "title location category level salary")
      .exec();
    res.json({
      success: true,
      applications,
    });
  } catch (error) {
    next(error);
  }
};

// Get company Posted job
export const getCompanyPostedJobs = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const companyId = req.company?._id;
    const jobs = await Job.find({ companyId });

    const jobsData = await Promise.all(
      jobs.map(async (job) => {
        const applicants = await JobApplication.find({ jobId: job._id });
        return { ...job.toObject(), applicants: applicants.length };
      })
    );
    res.json({ success: true, jobsData });
    res.json({
      success: true,
      jobsData: jobs,
    });
  } catch (error) {
    next(error);
  }
};

// Change job applicants status
export const changeJobApplicationsStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id, status } = req.body;

    // Find Job Application and update status
    await JobApplication.findOneAndUpdate({ _id: id }, { status });
    res.json({ success: true, message: "status changed" });
  } catch (error) {
    next(error);
  }
};

// Change job Visiblity
export const changeVisibility = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.body;
    const companyId = req.company?._id;
    const job = await Job.findById(id);
    if (!job) {
      return res.json({
        success: false,
        message: "Invalid Id",
      });
    }
    if (companyId?.toString() !== job.companyId.toString()) {
      return res.json({
        success: false,
        message: "You are not authorized to change this job",
      });
    }
    job.visible = !job.visible;

    await job.save();
    res.json({
      success: true,
      job,
    });
  } catch (error) {
    next(error);
  }
};
