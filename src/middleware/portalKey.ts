import { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";

dotenv.config();

const SERVICE_KEY = process.env.SERVICE_KEY!;

export function portalKeyMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const apiKey = req.header("portal-key");

  if (!apiKey) {
    return res.status(401).json({
      success: false,
      message: "PORTAL KEY is required",
    });
  }

  if (apiKey !== SERVICE_KEY) {
    return res.status(403).json({
      success: false,
      message: "Invalid PORTAL key",
    });
  }

  next();
}