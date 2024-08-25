import { Router } from "express";
import { sellerController } from "../services/controller/restaurantController";
import { sellerInteractor } from "../../application/usecases/restaurantInteractor";
import { sellerRepository } from "../../infrastructure/repositories/restaurantRepository";
import { sellerVerifyToken } from "../middlewares/sellerAuth";
import { loginValidation } from "../middlewares/expressValidatorValidation";
import restaurantVerificationMiddleware from "../middlewares/restuarantVerificationMiddleware";

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

/** HTTP GET METHODS  */
restaurantRouter.get(
  "/restaurant-details/:restaurantId",
  restaurantVerificationMiddleware,
  controller.getRestaurantDetailController.bind(controller)
);
restaurantRouter.get(
  "/reservations",
  restaurantVerificationMiddleware,
  controller.getReservationListController.bind(controller)
);
restaurantRouter.get(
  "/reservations/:reservationId",
  restaurantVerificationMiddleware,
  controller.getReservationController.bind(controller)
);
restaurantRouter.get(
  "/tables",
  restaurantVerificationMiddleware,
  controller.getRestaurantTableController.bind(controller)
);
restaurantRouter.get(
  "/timeslots/:date",
  restaurantVerificationMiddleware,
  controller.getTimeSlotController.bind(controller)
);

/** HTTP PATCH METHODS  */
restaurantRouter.patch(
  "/reservations/:reservationId",
  restaurantVerificationMiddleware,
  controller.updateReservationStatusController.bind(controller)
);
restaurantRouter.patch(
  "/tables/:tableId",
  restaurantVerificationMiddleware,
  controller.updateRestaurantTableIsAvailableController.bind(controller)
);
restaurantRouter.patch(
  "/timeslots/:timeSlotId",
  restaurantVerificationMiddleware,
  controller.updateRestaurantTimeSlotAvailableController.bind(controller)
);

/** HTTP POST METHODS  */
restaurantRouter.post(
  "/tables",
  restaurantVerificationMiddleware,
  controller.createRestaurantTableController.bind(controller)
);

restaurantRouter.post(
  "/times",
  restaurantVerificationMiddleware,
  controller.createTimeSlotController.bind(controller)
);

/** HTTP DELETE METHODS  */
restaurantRouter.delete(
  "/tables/:tableId",
  restaurantVerificationMiddleware,
  controller.deleteRestaurantTableController.bind(controller)
);
restaurantRouter.delete(
  "/featuredImage",
  restaurantVerificationMiddleware,
  controller.deleteRestaurantFeaturedImageController.bind(controller)
);
restaurantRouter.delete(
  "/secondary-images",
  restaurantVerificationMiddleware,
  controller.deleteRestaurantSecondaryImagesController.bind(controller)
);

/** HTTP PUT METHODS  */
restaurantRouter.put(
  "/restaurant-details/:restaurantId",
  restaurantVerificationMiddleware,
  controller.restaurantProfileUpdateController.bind(controller)
);


export default restaurantRouter;
