import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import configuredKeys from "../../configs/envConfig";
import restaurantModel from "../../infrastructure/database/model.ts/restaurantModel";
import userModel from "../../infrastructure/database/model.ts/userModel";

declare global {
  namespace Express {
    interface Request {
      userId: string;
      role: string;
    }
  }
}
interface userType {
  email: string;
  isBlocked: boolean;
  _id: string;
}
const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log("Auth middleware.......");
  const authHeader = req.headers.authorization;
  if (authHeader) {
    try {
      const token = authHeader?.split(" ")[1];
      const decodedToken = jwt.verify(
        token,
        configuredKeys.JWT_SECRET_KEY as string
      ) as JwtPayload;
      if (
        decodedToken.role == "user" ||
        decodedToken.role == "admin" ||
        decodedToken.role == "seller"
      ) {
        let user: any = null;
        if (decodedToken.role == "admin" || decodedToken.role == "user") {
          user = await userModel.findById(decodedToken.userId);
        } else if (decodedToken.role == "seller") {
          user = await restaurantModel.findById(decodedToken.userId);
        }
        if (user) {
          if (decodedToken.role == "admin" && !user.isAdmin) {
            return res.status(401).json({ message: "Token is not valid." });
          }
          if (decodedToken.role === "user" && user.isBlocked) {
            return res
              .status(403)
              .json({ message: "Sorry, this user is blocked by admin." });
          }
          req.userId = user._id;
          req.role = decodedToken.role;
          next();
        } else {
          return res.status(401).json({ message: "User not found." });
        }
      } else {
        return res.status(401).json({ message: "Invalid role." });
      }
    } catch (error) {
      console.log("JWT Verification Error:", error );
      return res.status(401).json({ message: "Invalid Token" });
    }
  } else {
    return res.status(401).json({ message: "You are not authenticated !" });
  }
};

export default authMiddleware;
