import "express";

declare global {
  namespace Express {
    interface UserPayload {
      userId: string;
      email?: string;
    }
    interface Request {
      user?: UserPayload;
    }
  }
}
