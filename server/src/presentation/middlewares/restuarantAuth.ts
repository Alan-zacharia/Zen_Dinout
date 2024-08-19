import { NextFunction, Response, Request } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import configuredKeys from "../../configs/envConfig";
import restaurantModel from "../../infrastructure/database/model.ts/restaurantModel";

interface restaurantType {
  email: string;
  isBlocked: boolean;
  _id: string;
}

const restaurantVerificationMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  console.log(authHeader + "Restaurant Auth header......");
  if (authHeader) {
    console.log(authHeader);
    try {
      const token = authHeader.split(" ")[1];
      const decodeToken = jwt.verify(
        token,
        configuredKeys.JWT_SECRET_KEY
      ) as JwtPayload;
      console.log(decodeToken);
      // if(decodeToken.role == "seller"){
        const restaurant: restaurantType | null = await restaurantModel.findById(
          decodeToken.userId
        );
        if (restaurant) {
          req.userId = restaurant._id as string;
          next();
        // }
      }
    } catch (error) {
      console.log("Jwt verification error :", (error as Error).message);
      return res.status(401).json({ message: "Invalid Token" });
    }
  } else {
    res.status(401).json({ message: "You are not authenticated !" });
  }
};

export default restaurantVerificationMiddleware;
