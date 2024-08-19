import { Request, Response, Router } from "express";
import { adminRepositoryImpl } from "../../infrastructure/repositories/adminRepositoryImpl";
import { adminInteractorImpl } from "../../application/usecases/adminInteractor";
import { adminController } from "../services/adminController";
import { loginValidation } from "../middlewares/expressValidatorValidation";
import adminVerifyMiddleware from "../middlewares/adminAuth";

const repository = new adminRepositoryImpl();
const interactor = new adminInteractorImpl(repository);
const controller = new adminController(interactor);

const adminRouter: Router = Router();

/** Post Methods  */
adminRouter.post(
  "/login",
  loginValidation(),
  controller.loginAdmin.bind(controller)
);

/** Get Methods  */
adminRouter.get(
  "/users-list",
  adminVerifyMiddleware,
  controller.getUsers.bind(controller)
);
adminRouter.get(
  "/restaurants-approval-lists",
  adminVerifyMiddleware,
  controller.approveRestaurant.bind(controller)
);
adminRouter.get(
  "/restaurant-approval/:id",
  adminVerifyMiddleware,
  controller.approval_restaurant.bind(controller)
);
adminRouter.get(
  "/restaurants-list",
  adminVerifyMiddleware,
  controller.getRestaurants.bind(controller)
);

/** Put Methods */
adminRouter.put(
  "/user-actions/:id/:block",
  adminVerifyMiddleware,
  controller.userActions.bind(controller)
);
adminRouter.put(
  "/restaurant-approval/:id",
  adminVerifyMiddleware,
  controller.confirmRestaurant_Approval.bind(controller)
);

adminRouter.get(
  "/validate-token",

  (req: Request, res: Response) => {
    res.status(200).send({ userId: req.userId });
  }
);

adminRouter.post("/logout", controller.Logout.bind(controller));

export default adminRouter;
