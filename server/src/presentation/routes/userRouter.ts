import { Request, Response, Router } from "express";
import { userController } from "../services/controller/userController";
import { userInteractorImpl } from "../../application/usecases/userInteractor";
import { userRepositoryImpl } from "../../infrastructure/repositories/userRepositoryImpl";
import { userExists } from "../middlewares/userExists";
import verifyToken, { refreshToken } from "../middlewares/auth";
import { userExistGoogle } from "../middlewares/userExistsForGoogle";
import { userBlocked } from "../middlewares/userBlocked";
import {
  loginValidation,
  signupValidation,
} from "../middlewares/expressValidatorValidation";
import userVerifyMiddleware from "../middlewares/userVerificationMiddleware";

const repository = new userRepositoryImpl();
const interactor = new userInteractorImpl(repository);
const controller = new userController(interactor);
const userRouter: Router = Router();


/** HTTP POST METHODS  */
userRouter.post("/register",signupValidation(),controller.registerUserController.bind(controller));
userRouter.post("/login",loginValidation(),userBlocked,controller.loginUserController.bind(controller));
userRouter.post("/otp",signupValidation(),userExists,controller.generateOtpController.bind(controller));
userRouter.post("/google-login",signupValidation(),userBlocked,controller.googleLoginController.bind(controller));
userRouter.post("/review",userVerifyMiddleware,controller.addReviewController.bind(controller));
userRouter.post("/membership",userVerifyMiddleware,controller.createMemberShipPaymentController.bind(controller));
userRouter.post("/review",userVerifyMiddleware,controller.addReviewController.bind(controller));
userRouter.post("/apply-coupon",userVerifyMiddleware,controller.applyCouponController.bind(controller));
userRouter.post("/create-payment",userVerifyMiddleware,controller.createBookingController.bind(controller));
userRouter.post("/reset-password-request",controller.resetPasswordController.bind(controller));
userRouter.post("/save-restaurant",userVerifyMiddleware,controller.saveRestaurantController.bind(controller));
userRouter.post("/slots",controller.getTimeSlotController.bind(controller));
userRouter.post("/logout",controller.logoutController.bind(controller));


/** HTTP PATCH METHODS  */
userRouter.patch("/account/:userId",userVerifyMiddleware,controller.updateProfileController.bind(controller));
userRouter.patch("/booking-details/:bookingId",userVerifyMiddleware,controller.cancelBookingController.bind(controller));
userRouter.patch("/payment/status/:bookingId",userVerifyMiddleware,controller.bookingStatusUpdationController.bind(controller));


/** HTTP PUT METHODS  */
userRouter.put("/reset-password/:useId",controller.resetPasswordUpdateController.bind(controller));


/** HTTP GET METHODS  */
userRouter.get("/account/:userId",userVerifyMiddleware,controller.getProfileController.bind(controller));
userRouter.get("/restaurants", controller.getListedRestuarantsController.bind(controller));
userRouter.get("/restaurant-view/:restaurantId",controller.getRestauarantDetailedViewController.bind(controller));
userRouter.get("/bookings/:userId",userVerifyMiddleware,controller.getBookingDataController.bind(controller));
userRouter.get("/booking-details/:bookingId",userVerifyMiddleware,controller.getBookingDetailedController.bind(controller));
userRouter.get("/bookmarks",userVerifyMiddleware,controller.getSavedRestaurantContoller.bind(controller));
userRouter.get("/wallet",userVerifyMiddleware,controller.getUserWalletController.bind(controller));
userRouter.get("/coupons",userVerifyMiddleware,controller.getCouponsController.bind(controller));
userRouter.get("/chek-bookmark/:restaurantId",userVerifyMiddleware,controller.getCheckSavedRestaurantController.bind(controller));
userRouter.get("/reviews/:restaurantId",controller.getReviewsController.bind(controller));
userRouter.get("/review/:restaurantId",userVerifyMiddleware,controller.getReviewController.bind(controller));
userRouter.get("/membership/:userId",userVerifyMiddleware,controller.getMembershipController.bind(controller));
userRouter.get("/restaurant/:restaurantId/tables",controller.getRestaurantTablesController.bind(controller));


/** HTTPS DELETE METHODS */
userRouter.delete("/membership/:membershipId",userVerifyMiddleware , controller.cancelMembershipController.bind(controller));


export default userRouter;
