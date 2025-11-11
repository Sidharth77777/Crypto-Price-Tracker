import type { Request, Response, NextFunction } from "express";
import jwt, {JwtPayload} from "jsonwebtoken";
import { ENV } from "../lib/env";

export type AuthedRequest = Request & { user?: { userId: string; email?: string } };

const JWT_SECRET = ENV.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not set in environment variables");
}

export const checkLogin = async(req:AuthedRequest, res:Response, next:NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ success: false, message: "Unauthorized: No token provided" });
    }

    const token = authHeader.slice(7); 

    try{

        const decoded = jwt.verify(token, JWT_SECRET as string) as JwtPayload | string;

        if (typeof decoded === "string" || !decoded) {
            return res.status(401).json({ success: false, message: "Unauthorized: Invalid token" });
        }

        const userId = (decoded as any).userId;
        const email = (decoded as any).email

        if (typeof userId !== "string" || !userId) {
            return res.status(401).json({ success: false, message: "Unauthorized: Invalid token payload" });
        }
        if (typeof email !== "string" || !email) {
            return res.status(401).json({ success: false, message: "Unauthorized: Invalid token payload" });
        }

        req.user = { userId, email };

        return next();

    } catch (err:any) {
        return res.status(401).json({ success: false, message: "Unauthorized: Invalid or Expired token" });
    }

}