"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userController_1 = require("../services/controller/userController");
const userInteractor_1 = require("../../application/usecases/userInteractor");
const userRepositoryImpl_1 = require("../../infrastructure/repositories/userRepositoryImpl");
const userExists_1 = require("../middlewares/userExists");
const userBlocked_1 = require("../middlewares/userBlocked");
const expressValidatorValidation_1 = require("../middlewares/expressValidatorValidation");
const authenticateUser_1 = __importDefault(require("../middlewares/authenticateUser"));
const repository = new userRepositoryImpl_1.userRepositoryImpl();
const interactor = new userInteractor_1.userInteractorImpl(repository);
const controller = new userController_1.userController(interactor);
const userRouter = (0, express_1.Router)();
/** HTTP POST METHODS  */
userRouter.post("/register", (0, expressValidatorValidation_1.signupValidation)(), controller.registerUserController.bind(controller));
userRouter.post("/login", (0, expressValidatorValidation_1.loginValidation)(), userBlocked_1.blockedUserCheck, controller.loginUserController.bind(controller));
userRouter.post("/otp", (0, expressValidatorValidation_1.signupValidation)(), userExists_1.userExists, controller.generateOtpController.bind(controller));
userRouter.post("/google-login", (0, expressValidatorValidation_1.signupValidation)(), userBlocked_1.blockedUserCheck, controller.googleLoginController.bind(controller));
userRouter.post("/review", authenticateUser_1.default, controller.addReviewController.bind(controller));
userRouter.post("/membership", authenticateUser_1.default, controller.createMemberShipPaymentController.bind(controller));
userRouter.post("/apply-coupon", authenticateUser_1.default, controller.applyCouponController.bind(controller));
userRouter.post("/create-payment", authenticateUser_1.default, controller.createBookingController.bind(controller));
userRouter.post("/reset-password-request", controller.resetPasswordController.bind(controller));
userRouter.post("/save-restaurant", authenticateUser_1.default, controller.saveRestaurantController.bind(controller));
userRouter.post("/slots", controller.getTimeSlotController.bind(controller));
userRouter.post("/logout", controller.logoutController.bind(controller));
/** HTTP PATCH METHODS  */
userRouter.patch("/account/:userId", authenticateUser_1.default, controller.updateProfileController.bind(controller));
userRouter.patch("/booking-details/:bookingId", authenticateUser_1.default, controller.cancelBookingController.bind(controller));
userRouter.patch("/payment/status/:bookingId", authenticateUser_1.default, controller.bookingStatusUpdationController.bind(controller));
/** HTTP PUT METHODS  */
userRouter.put("/reset-password/:userId", controller.resetPasswordUpdateController.bind(controller));
/** HTTP GET METHODS  */
userRouter.get("/account/:userId", authenticateUser_1.default, controller.getProfileController.bind(controller));
userRouter.get("/restaurants", controller.getListedRestuarantsController.bind(controller));
userRouter.get("/restaurant-view/:restaurantId", controller.getRestauarantDetailedViewController.bind(controller));
userRouter.get("/bookings/:userId", authenticateUser_1.default, controller.getBookingDataController.bind(controller));
userRouter.get("/booking-details/:bookingId", authenticateUser_1.default, controller.getBookingDetailedController.bind(controller));
userRouter.get("/bookmarks", authenticateUser_1.default, controller.getSavedRestaurantContoller.bind(controller));
userRouter.get("/wallet", authenticateUser_1.default, controller.getUserWalletController.bind(controller));
userRouter.get("/coupons", authenticateUser_1.default, controller.getCouponsController.bind(controller));
userRouter.get("/chek-bookmark/:restaurantId", authenticateUser_1.default, controller.getCheckSavedRestaurantController.bind(controller));
userRouter.get("/reviews/:restaurantId", controller.getReviewsController.bind(controller));
userRouter.get("/menu/:restaurantId", controller.getMenuController.bind(controller));
userRouter.get("/review/:restaurantId", authenticateUser_1.default, controller.getReviewController.bind(controller));
userRouter.get("/membership/:userId", authenticateUser_1.default, controller.getMembershipController.bind(controller));
userRouter.get("/restaurant/:restaurantId/tables", controller.getRestaurantTablesController.bind(controller));
/** HTTPS DELETE METHODS */
userRouter.delete("/membership/:membershipId", authenticateUser_1.default, controller.cancelMembershipController.bind(controller));
exports.default = userRouter;
