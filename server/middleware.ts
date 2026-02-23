import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
if (!accessTokenSecret) throw new Error("ACCESS_TOKEN_SECRET is not set");

declare module "express-serve-static-core" {
  interface Request {
    userId?: string;
    user?: { _id: string };
  }
}

interface JwtPayload {
  userId?: string;
}

export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies?.token;
  if (!token) return res.status(401).json({ message: "Authentication required" });

  try {
    const decoded = jwt.verify(token, accessTokenSecret) as JwtPayload;
    if (!decoded.userId) return res.status(401).json({ message: "Invalid token" });
    req.userId = decoded.userId;
    return next();
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
};