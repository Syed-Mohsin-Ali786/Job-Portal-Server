import { NextFunction, Request, Response } from "express";
import User from "../models/User";
import JobApplication from "../models/JobApplications";
import Job from "../models/Job";
import { v2 as cloudinary } from "cloudinary";

// Get user Data
export const getUserData = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.json({
    message:"From user Side"
  })
  const userId = req.auth.userId;
  
  if (!userId) {
    return res.json({
      success: false,
      message: "provide id",
    });
  }
  try {
    const user = await User.findById(userId);
    if (!user) {
      return next("No user found");
    }
    res.json({
      success: true,
      user,
    });
  } catch (error) {
    next(error);
  }
};

//Apply for job
export const applyForJob = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { jobId } = req.body;
  const userId = req.auth.userId;
  try {
    const isAlreadyApplied = await JobApplication.findById({ jobId, userId });
    if (isAlreadyApplied) {
      return next("Already Applied");
    }
    const jobData = await Job.findById(jobId);
    if (!jobData) {
      return next("No Job found");
    }
    await JobApplication.create({
      companyId: jobData?.companyId,
      jobId,
      userId,
      date: Date.now(),
    });
    res.json({
      success: true,
      message: "Applied Successfully",
    });
  } catch (error) {
    next(error);
  }
};

//Get user applied Applicaiton
export const getUserApplications = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.auth.userId;
    const applications = await JobApplication.find({ userId })
      .populate("companyId", "name email image")
      .populate("jobId", "title description location category level salary")
      .exec();
    if (!applications) {
      return next("No jobApplications found for this user");
    }

    return res.json({
      success: true,
      applications,
    });
  } catch (error) {
    next(error);
  }
};

// Update user Profile(resume)
export const updateUserResume = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.auth.userId;
    const resumeFile = req.file;
    const userData = await User.findById(userId);
    if (!userData || !resumeFile || !userId) {
      return next("Something is missing");
    }
    const resumeUpload = await cloudinary.uploader.upload(resumeFile.path);
    userData.resume = resumeUpload.secure_url;
    await userData.save();
    res.json({
      success:true,
      message:"Resume updated"
    })
  } catch (error) {
    next(error);
  }
};
