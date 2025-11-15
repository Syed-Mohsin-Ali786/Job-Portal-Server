import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import Company, { CompanyDocument } from "../models/Company";

declare global {
  namespace Express {
    interface Request {
      company?: CompanyDocument; // or `any` if you don't have a type
    }
  }
}
const protectCompany = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let token: string | undefined;
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer")) {
    // Extract the token part: 'Bearer xyz.abc.123' -> 'xyz.abc.123'
    token = authHeader.split(" ")[1];
  }
  if (!token && req.headers.token) {
    token = req.headers.token as string;
  }
  
  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Not authorized, token missing.",
    });
  }
  try {
    const decode = jwt.verify(token, process.env.JWT_SECRET as string) as {
      id: string;
    };
    const company = await Company.findById(decode.id).select("-password");

    if (!company) {
      return res.status(401).json({
        success: false,
        message: "Not authorized, company not found.",
      });
    }
    req.company = company;
    next();
  } catch (error) {
    let errorMessage = "Not authorized, token failed.";
    if (error instanceof jwt.TokenExpiredError) {
      errorMessage = "Not authorized, token expired.";
    } else if (error instanceof jwt.JsonWebTokenError) {
      errorMessage = "Not authorized, invalid token.";
    }
    return res.status(401).json({
      success: false,
      message: errorMessage,
    });
  }
};

export default protectCompany;
