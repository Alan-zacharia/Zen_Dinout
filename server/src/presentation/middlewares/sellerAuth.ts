import { NextFunction, Request, Response } from "express";
import configuredKeys from "../../configs/config";
import jwt,{ JwtPayload } from "jsonwebtoken";




export const sellerVerifyToken = (req:Request , res : Response , next : NextFunction) =>{
     const token = req.cookies["seller_auth"];
     if(!token){
        return res.status(400).json({message  : "unauthorized"})
     }

     try{
        const decodes = jwt.verify( token , configuredKeys.JWT_SECRET_KEY as string );
        req.userId = (decodes as JwtPayload).userId;
        next();
     }catch(error){
        return res.status(401).json({message : "unautharized"});
     }
} 