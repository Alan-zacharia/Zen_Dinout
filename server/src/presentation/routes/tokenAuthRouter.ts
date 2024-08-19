import { Router } from "express";
import { refreshAccessToken } from "../middlewares/tokenAuthMiddleware";




const tokenRouters : Router = Router();


// tokenRouters.get("/accessToken",getNewAccessToken  )
tokenRouters.post("/refreshToken" ,refreshAccessToken);




export default tokenRouters;