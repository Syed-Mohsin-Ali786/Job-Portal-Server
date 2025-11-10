import { Request, Response } from "express";
import Comapany from "../models/Company";
import bcrypt from "bcryptjs";
import { v2 as cloudinary } from 'cloudinary'

// Register a New company
export const registerCompany = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;
  const imageFile = req.file;
  if (!name || !email || !password || !imageFile) {
    return res.json({ success: false, message: "missing details" });
  }
  try {
    const companyExist = await Comapany.findOne({ email });
    if (companyExist) {
      return res.json({ success: false, message: "Company Already Exist" });
    };

    const salt=await bcrypt.genSalt(12);
    const hashPassword=await bcrypt.hash(password,salt);
    const imageUpload=await cloudinary.uploader.upload(imageFile.path);
    const company=await Comapany.create({
        name,email,password:hashPassword,image:imageUpload

    })
res.json({
    success:true,
    company:{
        _id:company._id,
        name:company.name,
        email:company.email,
        image:company.image

    }
})
  } catch (error) {}
};

// Company Login
export const loginComapany = async (req: Request, res: Response) => {};

// Get Comapany Data
export const getCompanyData = async (req: Request, res: Response) => {};

// Post a new job
export const postJob = async (req: Request, res: Response) => {};

// Get company job applicant
export const getCompanyApplicants = async (req: Request, res: Response) => {};

// Get company Posted job
export const getCompanyPostedJobs = async (req: Request, res: Response) => {};

// Change job applicants status
export const changeJobApplicationsStatus = async (
  req: Request,
  res: Response
) => {};

// Change job Visiblity
export const changeVisibility = async (req: Request, res: Response) => {};
