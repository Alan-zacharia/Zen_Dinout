import { Router } from "express";
import { refreshAccessToken } from "../middlewares/tokenAuthMiddleware";

const tokenRouters: Router = Router();

tokenRouters.post("/refreshToken", refreshAccessToken);

export default tokenRouters;
