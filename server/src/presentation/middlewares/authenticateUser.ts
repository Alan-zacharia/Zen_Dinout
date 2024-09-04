import { NextFunction, Request, Response } from "express";
import UserModel from "../../infrastructure/database/model/userModel"; // User's database model
import { jwtVerifyToken } from "../../infrastructure/utils/jwtUtils";
import configuredKeys from "../../configs/envConfig";
import { MESSAGES, STATUS_CODES } from "../../configs/constants";
import { AppError } from "./appError";

declare global {
  namespace Express {
    interface Request {
      userId: string;
    }
  }
}

const authenticateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    const { message, decode } = jwtVerifyToken(
      token,
      configuredKeys.JWT_SECRET_KEY as string
    );
    if (decode && decode.role == "user") {
      try {
        const user = await UserModel.findById(decode.userId);
        if (user && user.isBlocked) {
          return res
            .status(STATUS_CODES.BLOCKED)
            .json({ message: MESSAGES.USER_BLOCKED });
        }
        if (user) {
          req.userId = user._id as string;
          next();
        }
      } catch (error) {
        console.log("Error fetching user:", (error as Error).message);
        next(
          new AppError(
            MESSAGES.RESOURCE_NOT_FOUND,
            STATUS_CODES.INTERNAL_SERVER_ERROR
          )
        );
      }
    } else {
      console.log("JWT Verification Error:", message);
      return res.status(STATUS_CODES.UNAUTHORIZED).json({ message });
    }
  } else {
    return res
      .status(STATUS_CODES.UNAUTHORIZED)
      .json({ message: "You are not authenticated!" });
  }
};

export default authenticateUser;
