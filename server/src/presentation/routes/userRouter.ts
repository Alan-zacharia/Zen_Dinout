import { Router } from "express";
import { userController } from "../services/controller/userController";
import { userInteractorImpl } from "../../application/usecases/userInteractor";
import { userRepositoryImpl } from "../../infrastructure/repositories/userRepositoryImpl";
import { userExists } from "../middlewares/userExists";
import { blockedUserCheck } from "../middlewares/userBlocked";
import {
  loginValidation,
  signupValidation,
} from "../middlewares/expressValidatorValidation";
import authenticateUser from "../middlewares/authenticateUser";

const repository = new userRepositoryImpl();
const interactor = new userInteractorImpl(repository);
const controller = new userController(interactor);
const userRouter: Router = Router();

/** HTTP POST METHODS  */
userRouter.post(
  "/register",
  signupValidation(),
  controller.registerUserController.bind(controller)
);
userRouter.post(
  "/login",
  loginValidation(),
  blockedUserCheck,
  controller.loginUserController.bind(controller)
);
userRouter.post(
  "/otp",
  signupValidation(),
  userExists,
  controller.generateOtpController.bind(controller)
);
userRouter.post(
  "/google-login",
  signupValidation(),
  blockedUserCheck,
  controller.googleLoginController.bind(controller)
);
userRouter.post(
  "/review",
  authenticateUser,
  controller.addReviewController.bind(controller)
);
userRouter.post(
  "/membership",
  authenticateUser,
  controller.createMemberShipPaymentController.bind(controller)
);
userRouter.post(
  "/apply-coupon",
  authenticateUser,
  controller.applyCouponController.bind(controller)
);
userRouter.post(
  "/create-payment",
  authenticateUser,
  controller.createBookingController.bind(controller)
);
userRouter.post(
  "/reset-password-request",
  controller.resetPasswordController.bind(controller)
);
userRouter.post(
  "/save-restaurant",
  authenticateUser,
  controller.saveRestaurantController.bind(controller)
);
userRouter.post("/slots", controller.getTimeSlotController.bind(controller));
userRouter.post("/logout", controller.logoutController.bind(controller));

/** HTTP PATCH METHODS  */
userRouter.patch(
  "/account/:userId",
  authenticateUser,
  controller.updateProfileController.bind(controller)
);
userRouter.patch(
  "/booking-details/:bookingId",
  authenticateUser,
  controller.cancelBookingController.bind(controller)
);
userRouter.patch(
  "/payment/status/:bookingId",
  authenticateUser,
  controller.bookingStatusUpdationController.bind(controller)
);

/** HTTP PUT METHODS  */
userRouter.put(
  "/reset-password/:userId",
  controller.resetPasswordUpdateController.bind(controller)
);

/** HTTP GET METHODS  */
userRouter.get(
  "/account/:userId",
  authenticateUser,
  controller.getProfileController.bind(controller)
);
userRouter.get(
  "/restaurants",
  controller.getListedRestuarantsController.bind(controller)
);
userRouter.get(
  "/restaurant-view/:restaurantId",
  controller.getRestauarantDetailedViewController.bind(controller)
);
userRouter.get(
  "/bookings/:userId",
  authenticateUser,
  controller.getBookingDataController.bind(controller)
);
userRouter.get(
  "/booking-details/:bookingId",
  authenticateUser,
  controller.getBookingDetailedController.bind(controller)
);
userRouter.get(
  "/bookmarks",
  authenticateUser,
  controller.getSavedRestaurantContoller.bind(controller)
);
userRouter.get(
  "/wallet",
  authenticateUser,
  controller.getUserWalletController.bind(controller)
);
userRouter.get(
  "/coupons",
  authenticateUser,
  controller.getCouponsController.bind(controller)
);
userRouter.get(
  "/chek-bookmark/:restaurantId",
  authenticateUser,
  controller.getCheckSavedRestaurantController.bind(controller)
);
userRouter.get(
  "/reviews/:restaurantId",
  controller.getReviewsController.bind(controller)
);
userRouter.get(
  "/menu/:restaurantId",
  controller.getMenuController.bind(controller)
);
userRouter.get(
  "/review/:restaurantId",
  authenticateUser,
  controller.getReviewController.bind(controller)
);
userRouter.get(
  "/membership/:userId",
  authenticateUser,
  controller.getMembershipController.bind(controller)
);
userRouter.get(
  "/restaurant/:restaurantId/tables",
  controller.getRestaurantTablesController.bind(controller)
);

/** HTTPS DELETE METHODS */
userRouter.delete(
  "/membership/:membershipId",
  authenticateUser,
  controller.cancelMembershipController.bind(controller)
);

export default userRouter;
