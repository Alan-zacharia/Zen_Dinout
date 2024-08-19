import { NextFunction, Request, Response } from "express";
import restaurantModel from "../../infrastructure/database/model.ts/restaurantModel";
import { Console } from "console";


const seller_Exists = async(req: Request, res: Response, next: NextFunction) => {
    const { credentials } = req.body;
    try{
        const restaurant = await restaurantModel.findOne({email : credentials.email});
        console.log(restaurant);
        if(restaurant){
            return res.status(400).json({message : "User already exist" , token : null})
        };
        next()
    }catch(error){
        res.status(400).json({ message: "Internal server error", toke: null });
        console.log("Oops Error in seller_Exists middleware ", error);
    }
};

export default seller_Exists;