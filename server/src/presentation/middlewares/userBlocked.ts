import { NextFunction, Request, Response } from "express";
import UserModel from "../../infrastructure/database/model.ts/userModel";
import { validationResult } from "express-validator";

/**
 * Checking user already existed
 * @param email - email for checking
 * @returns if exist return exist message otherwise next()
 */
export const userBlocked = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessage = errors.array()[0].msg;
    return res.status(400).json({ message: errorMessage });
  }
    const {email} = req.body;
  try {
    console.log(req.body)
    const user = await UserModel.findOne({email : email});
    console.log(user);
    if(user && user.isBlocked){
        return res.status(403).json({message : "User Blocked"});
    }
    next();
  } catch (error) {
    res.status(400).json({ message: "Internal server error", token: null });
    console.log("Oops Error in userExists middleware ", error);
  }
};
