import { NextFunction, Request, Response } from "express";
import configuredKeys from "../../configs/config";
import jwt,{ JwtPayload } from "jsonwebtoken";
import UserModel from "../../infrastructure/database/model.ts/userModel";
import { jwtGenerateToken } from "../../functions/auth/jwtTokenFunctions";
import { setAuthTokenCookie } from "../../functions/auth/cookieFunctions";


declare global {
    namespace Express{
        interface Request {
            userId : string
        }
    }
};

const verifyToken = async(req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies["Uauth_token"];
    if(!token){
        return res.status(401).json({message : "unautharized"});
    }
    try{
        const decodes = jwt.verify( token , configuredKeys.JWT_SECRET_KEY as string );
        req.userId = (decodes as JwtPayload).userId;
        const user = await UserModel.findById(req.userId);
        if(user && user.isBlocked){
            return res.status(401).json({message : "User Blocked"});
        }
        next();
    }catch(error){
        return res.status(401).json({message : "unautharized"});
    }
};

export default verifyToken;

export const refreshToken = async (req: Request, res: Response, next: NextFunction) => {
    const previosToken = req.cookies["Uauth_token"];
    if (!previosToken) {
      return res.status(400).json({ message: "Couldn't find the token" });
    }
    try {
      const decoded = jwt.verify(String(previosToken), configuredKeys.JWT_SECRET_KEY as string);
      const newToken = jwtGenerateToken((decoded as JwtPayload).userId , "user");
      setAuthTokenCookie(res,"Uauth_token",newToken);
      req.userId = (decoded as JwtPayload).userId;
      const user = await UserModel.findById(req.userId);
      if(user && user.isBlocked){
          return res.status(401).json({message : "User Blocked"});
      }
      next();
    } catch (error) {
      console.log(error);
      return res.status(403).json({ message: "Authentication failed" });
    }
  };