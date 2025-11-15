import { NextFunction, Request, Response } from "express";
import User from "../models/User";

// Get user Data
export const getUserData = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
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
) => {};

//Get user applied Applicaiton
export const getUserApplications = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {};

// Update user Profile(resume)
export const updateUserResume = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {};
