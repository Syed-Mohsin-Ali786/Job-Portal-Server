import express, { NextFunction, Response, Request } from "express";
import {
  applyForJob,
  getUserApplications,
  getUserData,
  updateUserResume,
} from "../controllers/UserController";
import upload from "../config/multer";

const router = express.Router();

// Get user Data
router.get("/user", getUserData);

// Apply for jobs
router.post("/apply", applyForJob);

// Get applied jobs
router.get("/applications", getUserApplications);

// Update user profile resume
router.post("/update-resume", upload.single("resume"), updateUserResume);

export default router;
