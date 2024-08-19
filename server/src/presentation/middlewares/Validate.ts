import { NextFunction, Request, Response } from "express";
import Joi from "joi";


const validate = (schema: Joi.ObjectSchema) => (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body);
    if (error) {
      console.log(error)
      const messages = error.details.map((detail: any) => detail.message);
      return res.status(400).json({ message : messages });
    }
    next();
  };
  


export default validate;