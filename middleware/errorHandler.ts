import { Request, Response, NextFunction } from "express";

// Global Error Handler
export const errorHandler = (
  err: unknown,
  req: Request,
  res: Response,
  custom: string,
  next: NextFunction
) => {
  if (err instanceof Error) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  } else if (custom) {
    res.json({
      success: false,
      message: custom,
    });
  } else {
    res.status(500).json({
      success: false,
      message: "An unknown error occurred",
    });
  }
};
