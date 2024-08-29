"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const restaurantController_1 = require("../services/controller/restaurantController");
const restaurantInteractor_1 = require("../../application/usecases/restaurantInteractor");
const restaurantRepository_1 = require("../../infrastructure/repositories/restaurantRepository");
const expressValidatorValidation_1 = require("../middlewares/expressValidatorValidation");
const authenticateRestaurant_1 = __importDefault(require("../middlewares/authenticateRestaurant"));
const repository = new restaurantRepository_1.sellerRepository();
const interactor = new restaurantInteractor_1.sellerInteractor(repository);
const controller = new restaurantController_1.sellerController(interactor);
const restaurantRouter = (0, express_1.Router)();
/** HTTP POST METHODS  */
restaurantRouter.post("/login", (0, expressValidatorValidation_1.loginValidation)(), controller.loginRestaurantController.bind(controller));
restaurantRouter.post("/register", controller.registerRestaurantController.bind(controller));
/** HTTP GET METHODS  */
restaurantRouter.get("/restaurant-details/:restaurantId", authenticateRestaurant_1.default, controller.getRestaurantDetailController.bind(controller));
restaurantRouter.get("/reservations", authenticateRestaurant_1.default, controller.getReservationListController.bind(controller));
restaurantRouter.get("/reservations/:reservationId", authenticateRestaurant_1.default, controller.getReservationController.bind(controller));
restaurantRouter.get("/tables", authenticateRestaurant_1.default, controller.getRestaurantTableController.bind(controller));
restaurantRouter.get("/timeslots/:date", authenticateRestaurant_1.default, controller.getTimeSlotController.bind(controller));
/** HTTP PATCH METHODS  */
restaurantRouter.patch("/reservations/:reservationId", authenticateRestaurant_1.default, controller.updateReservationStatusController.bind(controller));
restaurantRouter.patch("/tables/:tableId", authenticateRestaurant_1.default, controller.updateRestaurantTableIsAvailableController.bind(controller));
restaurantRouter.patch("/timeslots/:timeSlotId", authenticateRestaurant_1.default, controller.updateRestaurantTimeSlotAvailableController.bind(controller));
/** HTTP POST METHODS  */
restaurantRouter.post("/tables", authenticateRestaurant_1.default, controller.createRestaurantTableController.bind(controller));
restaurantRouter.post("/times", authenticateRestaurant_1.default, controller.createTimeSlotController.bind(controller));
/** HTTP DELETE METHODS  */
restaurantRouter.delete("/tables/:tableId", authenticateRestaurant_1.default, controller.deleteRestaurantTableController.bind(controller));
restaurantRouter.delete("/featuredImage", authenticateRestaurant_1.default, controller.deleteRestaurantFeaturedImageController.bind(controller));
restaurantRouter.delete("/secondary-images", authenticateRestaurant_1.default, controller.deleteRestaurantSecondaryImagesController.bind(controller));
/** HTTP PUT METHODS  */
restaurantRouter.put("/restaurant-details/:restaurantId", authenticateRestaurant_1.default, controller.restaurantProfileUpdateController.bind(controller));
exports.default = restaurantRouter;
