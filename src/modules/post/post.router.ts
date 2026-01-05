import express, { NextFunction, Request, Response } from "express";
import { postController } from "./post.controller";
import { auth as betterAuth } from "../../lib/auth";
import { success } from "better-auth/*";
const router = express.Router();

export enum useRole {
  USER = "USER",
  ADMIN = "ADMIN",
}

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        name: string;
        role: string;
        emailVerified: boolean;
      };
    }
  }
}
const auth = (...roles: useRole[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const session = await betterAuth.api.getSession({
      headers: req.headers as any,
    });
    if (!session) {
      return res.status(401).json({
        success: false,
        message: "you are not authorized",
      });
    }
    if (!session.user.emailVerified) {
      return res.status(401).json({
        success: false,
        message: "email verification is must",
      });
    }
    req.user = {
      id: session.user.id,
      email: session.user.email,
      name: session.user.name,
      role: session.user.role as string,
      emailVerified: session.user.emailVerified,
    };
    if (roles.length && !roles.includes(req.user.role as useRole)) {
      return res.status(403).json({
        success: false,
        message: "you don't have permission to access this resources",
      });
    }
    next();
  };
};
router.post("/", auth(useRole.USER), postController.createPost);

export const postRouter = router;
