import { Request, Response, Router } from "express";
import { adminRepositoryImpl } from "../../infrastructure/repositories/adminRepositoryImpl";
import { adminInteractorImpl } from "../../application/usecases/adminInteractor";
import { adminController } from "../services/controller/adminController";
import { loginValidation } from "../middlewares/expressValidatorValidation";
import adminVerifyMiddleware from "../middlewares/adminAuth";

const repository = new adminRepositoryImpl();
const interactor = new adminInteractorImpl(repository);
const controller = new adminController(interactor);

const adminRouter: Router = Router();

/** HTTP POST METHODS  */
adminRouter.post(
  "/login",
  loginValidation(),
  controller.adminLoginController.bind(controller)
);
adminRouter.post(
  "/coupons",
  loginValidation(),
  controller.createCouponController.bind(controller)
);
adminRouter.post(
  "/memeberships",
  loginValidation(),
  controller.createMembershipController.bind(controller)
);

/** HTTP GET METHODS  */
adminRouter.get(
  "/users",
  adminVerifyMiddleware,
  controller.getUserListContoller.bind(controller)
);
adminRouter.get(
  "/approval-restaurants",
  adminVerifyMiddleware,
  controller.getApproveRestaurantListController.bind(controller)
);
adminRouter.get(
  "/restaurants",
  adminVerifyMiddleware,
  controller.getRestaurantListController.bind(controller)
);
adminRouter.get(
  "/approval-restaurant/:restaurantId",
  adminVerifyMiddleware,
  controller.getApproveRestaurantController.bind(controller)
);
adminRouter.get(
  "/coupons",
  adminVerifyMiddleware,
  controller.getCouponController.bind(controller)
);
adminRouter.get(
  "/memberships",
  adminVerifyMiddleware,
  controller.getMembershipController.bind(controller)
);

/** HTTP PATCH METHODS */
adminRouter.patch(
  "/users/:userId/:action",
  adminVerifyMiddleware,
  controller.userActionController.bind(controller)
);
adminRouter.patch(
  "/approval-restaurant/:restaurantId",
  adminVerifyMiddleware,
  controller.approveRestaurantController.bind(controller)
);

/** HTTP DELETE METHODS */
adminRouter.delete(
  "/coupons/:couponId",
  adminVerifyMiddleware,
  controller.removeCouponController.bind(controller)
);

export default adminRouter;
