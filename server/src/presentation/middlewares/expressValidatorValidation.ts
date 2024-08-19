import { check } from  "express-validator";


/** User Login Validation  */
export const loginValidation = ()=> [check("email","Email is required").isEmail(),
    check("password","Password with 8 or more charaters required").isLength({ min : 8}),
]

/** User signup Validation  */
export const signupValidation = ()=> [
    check("username","Name is required").isString(),
    check("email","Email is required").isEmail(),
    check("password","Password with 8 or more charaters required").isLength({ min : 8}),
];