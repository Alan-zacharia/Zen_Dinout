import Joi from 'joi';


export const registerSchema = Joi.object({
    username : Joi.string().min(3).max(30).required(),
    email:Joi.string().email().required(),
    password:Joi.string().min(8).max(30).required(),
    role:Joi.string().valid('seller','user').required()
});

export const loginSchema = Joi.object({
    email : Joi.string().email().required(),
    password:Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{8,30}$')).required(),
    role:Joi.string().valid("seller","user").required()
})
