import express, { NextFunction, Response, Request } from "express";
import Job from "../models/Job";
import Comapany from "../models/Company";
import { getJobById, getJobs } from "../controllers/JobController";

const router = express.Router();
router.get("/", getJobs);
router.get("/:id", getJobById);
export default router;
