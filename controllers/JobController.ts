import Job from "../models/Job";
import { Request, Response, NextFunction } from "express";
// Get all jobs
export const getJobs = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {

  try {
    const jobs = await Job.find({ visible: true }).populate({
      path: "companyId",
      select: "-password",
    });
 
    res.json({
      success: true,
      jobs,
    });
  } catch (error) {
    next(error);
  }
};

//Get single job by id
export const getJobById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.params;
    const job = await Job.findById(id).populate({
        path:'companyId',
        select:'-password'
    });
    if (!job) {
      return res.json({
        success: false,
        message: "Job not found",
      });
    }
    res.json({
      success: true,
      job,
    });
  } catch (error) {
    next(error);
  }
};
