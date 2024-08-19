import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import { check } from "express-validator";
import { STATUS_CODES , MESSAGES } from "../../configs/constants";

/** <--------- Request Validations --------> */

/** Login Validation  */
export const validateLoginRequest = () => [
  check("email").isEmail().withMessage(MESSAGES.INVALID_EMAIL_FORMAT),
  check("password", MESSAGES.PASSWORD_REQUIRED).isLength({
    min: 8,
  }),
];
/** Signup Validation  */
export const signupValidation = () => [
  check("username", "Name is required").isString(),
  check("email", "Email is required").isEmail(),
  check("password", "Password with 8 or more charaters required").isLength({
    min: 8,
  }),
];
/** Restaurant register Validation  */
export const validateResaturantRequest = () => [
  check("restaurantName", "Restaurant name is required!").isString(),
  check("email").isEmail().withMessage(MESSAGES.INVALID_EMAIL_FORMAT),
  check(
    "contact",
    "Contact number is required and should be exactly 10 digits"
  ).matches(/^\d{10}$/),
  check("password", MESSAGES.PASSWORD_REQUIRED).isLength({
    min: 8,
  }),
];

/** <--------- Validator Functions --------> */

export const handleValidationErrors  = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessage = errors.array()[0].msg;
    return res.status(STATUS_CODES.BAD_REQUEST).json({ message: errorMessage });
  }
  next();
};

