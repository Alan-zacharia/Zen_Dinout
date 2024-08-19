import { NextFunction, Request, Response } from "express";
import UserModel from "../../infrastructure/database/model.ts/userModel";
import { validationResult } from "express-validator";

/**
 * Checking user already existed
 * @param email - email for checking
 * @returns if exist return exist message otherwise next()
 */
export const userExists = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorMessage = errors.array()[0].msg;
      return res.status(400).json({ message: errorMessage });
    };
    console.log(req.body)
    const { email } = req.body;
    const user = await UserModel.findOne({ email: email });
    if (user) {
      return res
        .status(400)
        .json({ message: "User already exists.", token: null });
    }
    next();
  } catch (error) {
    res.status(400).json({ message: "Internal server error", token: null });
    console.log("Oops Error in userExists middleware ", error);
  }
};
