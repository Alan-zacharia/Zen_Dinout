"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const adminRepositoryImpl_1 = require("../../infrastructure/repositories/adminRepositoryImpl");
const adminInteractor_1 = require("../../application/usecases/adminInteractor");
const adminController_1 = require("../services/controller/adminController");
const expressValidatorValidation_1 = require("../middlewares/expressValidatorValidation");
const authenticateAdmin_1 = __importDefault(require("../middlewares/authenticateAdmin"));
const repository = new adminRepositoryImpl_1.adminRepositoryImpl();
const interactor = new adminInteractor_1.adminInteractorImpl(repository);
const controller = new adminController_1.adminController(interactor);
const adminRouter = (0, express_1.Router)();
/** HTTP POST METHODS  */
adminRouter.post("/login", (0, expressValidatorValidation_1.loginValidation)(), controller.adminLoginController.bind(controller));
adminRouter.post("/coupons", (0, expressValidatorValidation_1.loginValidation)(), controller.createCouponController.bind(controller));
adminRouter.post("/memeberships", (0, expressValidatorValidation_1.loginValidation)(), controller.createMembershipController.bind(controller));
/** HTTP GET METHODS  */
adminRouter.get("/users", authenticateAdmin_1.default, controller.getUserListContoller.bind(controller));
adminRouter.get("/approval-restaurants", authenticateAdmin_1.default, controller.getApproveRestaurantListController.bind(controller));
adminRouter.get("/restaurants", authenticateAdmin_1.default, controller.getRestaurantListController.bind(controller));
adminRouter.get("/approval-restaurant/:restaurantId", authenticateAdmin_1.default, controller.getApproveRestaurantController.bind(controller));
adminRouter.get("/coupons", authenticateAdmin_1.default, controller.getCouponController.bind(controller));
adminRouter.get("/memberships", authenticateAdmin_1.default, controller.getMembershipController.bind(controller));
/** HTTP PATCH METHODS */
adminRouter.patch("/users/:userId/:action", authenticateAdmin_1.default, controller.userActionController.bind(controller));
adminRouter.patch("/approval-restaurant/:restaurantId", authenticateAdmin_1.default, controller.approveRestaurantController.bind(controller));
/** HTTP DELETE METHODS */
adminRouter.delete("/coupons/:couponId", authenticateAdmin_1.default, controller.removeCouponController.bind(controller));
exports.default = adminRouter;
