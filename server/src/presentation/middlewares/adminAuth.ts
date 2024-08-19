// server/middlewares/adminVerifyMiddleware.ts

import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import configuredKeys from "../../configs/config";
import UserModel from "../../infrastructure/database/model.ts/userModel";

const adminVerifyMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  console.log(authHeader);
  if (authHeader) {
    try {
      const token = authHeader.split(" ")[1];
      const decodedToken = jwt.verify(
        token,
        configuredKeys.JWT_SECRET_KEY
      ) as JwtPayload;
      const user = await UserModel.findById(decodedToken.userId);
      console.log(user, decodedToken);
      if (user && !user.isAdmin) {
        return res.status(401).json({ message: "Token is not valid." });
      }

      next();
    } catch (error) {
      console.error("JWT Verification Error:", (error as Error).message);
      return res.status(401).json({ message: "Invalid Token" });
    }
  } else {
    res.status(401).json({ message: "You are not authenticated!" });
  }
};

export default adminVerifyMiddleware;
