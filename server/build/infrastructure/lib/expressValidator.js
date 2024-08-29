"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleValidationErrors = exports.validateResaturantRequest = exports.signupValidation = exports.validateLoginRequest = void 0;
const express_validator_1 = require("express-validator");
const express_validator_2 = require("express-validator");
const constants_1 = require("../../configs/constants");
/** <--------- Request Validations --------> */
/** Login Validation  */
const validateLoginRequest = () => [
    (0, express_validator_2.check)("email").isEmail().withMessage(constants_1.MESSAGES.INVALID_EMAIL_FORMAT),
    (0, express_validator_2.check)("password", constants_1.MESSAGES.PASSWORD_REQUIRED).isLength({
        min: 8,
    }),
];
exports.validateLoginRequest = validateLoginRequest;
/** Signup Validation  */
const signupValidation = () => [
    (0, express_validator_2.check)("username", "Name is required").isString(),
    (0, express_validator_2.check)("email", "Email is required").isEmail(),
    (0, express_validator_2.check)("password", "Password with 8 or more charaters required").isLength({
        min: 8,
    }),
];
exports.signupValidation = signupValidation;
/** Restaurant register Validation  */
const validateResaturantRequest = () => [
    (0, express_validator_2.check)("restaurantName", "Restaurant name is required!").isString(),
    (0, express_validator_2.check)("email").isEmail().withMessage(constants_1.MESSAGES.INVALID_EMAIL_FORMAT),
    (0, express_validator_2.check)("contact", "Contact number is required and should be exactly 10 digits").matches(/^\d{10}$/),
    (0, express_validator_2.check)("password", constants_1.MESSAGES.PASSWORD_REQUIRED).isLength({
        min: 8,
    }),
];
exports.validateResaturantRequest = validateResaturantRequest;
/** <--------- Validator Functions --------> */
const handleValidationErrors = (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        const errorMessage = errors.array()[0].msg;
        return res.status(constants_1.STATUS_CODES.BAD_REQUEST).json({ message: errorMessage });
    }
    next();
};
exports.handleValidationErrors = handleValidationErrors;
