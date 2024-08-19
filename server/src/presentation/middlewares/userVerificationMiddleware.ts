import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import configuredKeys from "../../configs/config";
import UserModel from "../../infrastructure/database/model.ts/userModel";

declare global {
  namespace Express {
    interface Request {
      userId: string;
    }
  }
}
interface userType {
  email: string;
  isBlocked: boolean;
  _id: string;
}
const userVerifyMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log("HHHHh");
  const authHeader = req.headers.authorization;
  if (authHeader) {
    console.log(authHeader);
    try {
      const token = authHeader?.split(" ")[1];
      const decodedToken = jwt.verify(
        token,
        configuredKeys.JWT_SECRET_KEY as string
      ) as JwtPayload;
      console.log(decodedToken);
      const user: userType | null = await UserModel.findById(
        decodedToken.userId
      );
      if (user && user.isBlocked) {
        return res.status(403).json({ message: "User Blocked" });
      }
      console.log(user);
      if (user) {
        req.userId = user._id as string;
        next();
      }
    } catch (error) {
      console.log("JWT Verification Error:", (error as Error).message);
      return res.status(401).json({ message: "Invalid Token" });
    }
  } else {
    res.status(401).json({ message: "You are not authenticated !" });
  }
};

export default userVerifyMiddleware;
