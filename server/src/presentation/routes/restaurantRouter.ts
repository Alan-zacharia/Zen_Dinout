import { Router } from "express";
import { sellerController } from "../services/controller/restaurantController";
import { sellerInteractor } from "../../application/usecases/restaurantInteractor";
import { sellerRepository } from "../../infrastructure/repositories/restaurantRepository";
import { loginValidation } from "../middlewares/expressValidatorValidation";
import authenticateRestaurant from "../middlewares/authenticateRestaurant";

const repository = new sellerRepository();
const interactor = new sellerInteractor(repository);
const controller = new sellerController(interactor);
const restaurantRouter: Router = Router();

/** HTTP POST METHODS  */
restaurantRouter.post(
  "/login",
  loginValidation(),
  controller.loginRestaurantController.bind(controller)
);
restaurantRouter.post(
  "/register",
  controller.registerRestaurantController.bind(controller)
);
restaurantRouter.post(
  "/menu",
  authenticateRestaurant,
  controller.createMenuController.bind(controller)
);

/** HTTP GET METHODS  */
restaurantRouter.get(
  "/restaurant-details/:restaurantId",
  authenticateRestaurant,
  controller.getRestaurantDetailController.bind(controller)
);
restaurantRouter.get(
  "/reservations",
  authenticateRestaurant,
  controller.getReservationListController.bind(controller)
);
restaurantRouter.get(
  "/reservations/:reservationId",
  authenticateRestaurant,
  controller.getReservationController.bind(controller)
);
restaurantRouter.get(
  "/tables",
  authenticateRestaurant,
  controller.getRestaurantTableController.bind(controller)
);
restaurantRouter.get(
  "/timeslots/:date",
  authenticateRestaurant,
  controller.getTimeSlotController.bind(controller)
);
restaurantRouter.get(
  "/menu",
  authenticateRestaurant,
  controller.getMenuController.bind(controller)
);

/** HTTP PATCH METHODS  */
restaurantRouter.patch(
  "/reservations/:reservationId",
  authenticateRestaurant,
  controller.updateReservationStatusController.bind(controller)
);
restaurantRouter.patch(
  "/tables/:tableId",
  authenticateRestaurant,
  controller.updateRestaurantTableIsAvailableController.bind(controller)
);
restaurantRouter.patch(
  "/timeslots/:timeSlotId",
  authenticateRestaurant,
  controller.updateRestaurantTimeSlotAvailableController.bind(controller)
);

/** HTTP POST METHODS  */
restaurantRouter.post(
  "/tables",
  authenticateRestaurant,
  controller.createRestaurantTableController.bind(controller)
);

restaurantRouter.post(
  "/times",
  authenticateRestaurant,
  controller.createTimeSlotController.bind(controller)
);

/** HTTP DELETE METHODS  */
restaurantRouter.delete(
  "/tables/:tableId",
  authenticateRestaurant,
  controller.deleteRestaurantTableController.bind(controller)
);
restaurantRouter.delete(
  "/featuredImage",
  authenticateRestaurant,
  controller.deleteRestaurantFeaturedImageController.bind(controller)
);
restaurantRouter.delete(
  "/secondary-images",
  authenticateRestaurant,
  controller.deleteRestaurantSecondaryImagesController.bind(controller)
);
restaurantRouter.delete(
  "/menu",
  authenticateRestaurant,
  controller.deleteMenuController.bind(controller)
);

/** HTTP PUT METHODS  */
restaurantRouter.put(
  "/restaurant-details/:restaurantId",
  authenticateRestaurant,
  controller.restaurantProfileUpdateController.bind(controller)
);

export default restaurantRouter;
