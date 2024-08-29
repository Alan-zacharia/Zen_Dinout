"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.signupValidation = exports.loginValidation = void 0;
const express_validator_1 = require("express-validator");
/** User Login Validation  */
const loginValidation = () => [(0, express_validator_1.check)("email", "Email is required").isEmail(),
    (0, express_validator_1.check)("password", "Password with 8 or more charaters required").isLength({ min: 8 }),
];
exports.loginValidation = loginValidation;
/** User signup Validation  */
const signupValidation = () => [
    (0, express_validator_1.check)("username", "Name is required").isString(),
    (0, express_validator_1.check)("email", "Email is required").isEmail(),
    (0, express_validator_1.check)("password", "Password with 8 or more charaters required").isLength({ min: 8 }),
];
exports.signupValidation = signupValidation;
