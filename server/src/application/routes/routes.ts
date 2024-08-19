import { Application } from "express";
import userRouter from "../../presentation/routes/userRouter";
import adminRouter from "../../presentation/routes/adminRouter";
import restaurantRouter from "../../presentation/routes/restaurantRouter";
import tokenRouters from "../../presentation/routes/tokenAuthRouter";

const routes = (app: Application) => {
  app.use("/api/", userRouter);
  app.use("/admin/", adminRouter);
  app.use("/restaurant/", restaurantRouter);
  app.use("/token/", tokenRouters);
};

export default routes;
