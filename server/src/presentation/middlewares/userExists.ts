import { NextFunction, Request, Response } from "express";
import UserModel from "../../infrastructure/database/model/userModel";
import { validationResult } from "express-validator";
import { MESSAGES, STATUS_CODES } from "../../configs/constants";
import { AppError } from "./appError";

export const userExists = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorMessage = errors.array()[0].msg;
      return res.status(STATUS_CODES.BAD_REQUEST).json({ message: errorMessage });
    }
    const { email } = req.body;
    const user = await UserModel.findOne({ email: email });
    if (user) {
      return res
        .status(STATUS_CODES.BAD_REQUEST)
        .json({ message: MESSAGES.USER_ALREADY_EXISTS, token: null });
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
