import { NextFunction, Request, Response } from "express";
import UserModel from "../../infrastructure/database/model.ts/userModel";
import { validationResult } from "express-validator";
import { MESSAGES, STATUS_CODES } from "../../configs/constants";
import { AppError } from "./appError";

export const blockedUserCheck = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessage = errors.array()[0].msg;
    return res.status(400).json({ message: errorMessage });
  }
  const { email } = req.body;
  try {
    const user = await UserModel.findOne({ email: email });
    if (user && user.isBlocked) {
      return res
        .status(STATUS_CODES.BLOCKED)
        .json({ message: MESSAGES.USER_BLOCKED });
    }
    next();
  } catch (error) {
    next(
      new AppError(
        MESSAGES.INTERNAL_SERVER_ERROR,
        STATUS_CODES.INTERNAL_SERVER_ERROR
      )
    );
  }
};
