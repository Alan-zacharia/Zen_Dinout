import { Request, Response, NextFunction } from "express";
import { AppError } from "./appError";
import { MESSAGES, STATUS_CODES } from "../../configs/constants";

const errorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = err.statusCode || STATUS_CODES.INTERNAL_SERVER_ERROR;
  const message = MESSAGES.INTERNAL_SERVER_ERROR;

  res.status(statusCode).json({
    status: statusCode,
    message,
  });
};

export default errorHandler;
