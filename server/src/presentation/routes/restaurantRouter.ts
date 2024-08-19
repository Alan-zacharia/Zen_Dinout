import { Router } from "express";
import { sellerController } from "../services/restaurantController";
import { sellerInteractor } from "../../application/usecases/sellerInteractor";
import { sellerRepository } from "../../infrastructure/repositories/sellerRepository";
import { sellerVerifyToken } from "../middlewares/sellerAuth";
import seller_Exists from "../middlewares/seller_Exists";
import { loginValidation } from "../middlewares/expressValidatorValidation";
import restaurantVerificationMiddleware from "../middlewares/restuarantVerificationMiddleware";

const repository = new sellerRepository();
const interactor = new sellerInteractor(repository);
const controller = new sellerController(interactor);
const restaurantRouter: Router = Router();

/** Get Methods  */
restaurantRouter.get(
  "/restaurant-details/:restaurantId",restaurantVerificationMiddleware,
  controller.restuarntDetails.bind(controller)
);
restaurantRouter.get(
  "/table-lists/:restaurantId",restaurantVerificationMiddleware,
  controller.getRestaurantTables.bind(controller)
);
restaurantRouter.get(
  "/table-slot-list/:tableId",restaurantVerificationMiddleware,
  controller.getRestaurantTablesTimeSlots.bind(controller)
);

/** POST METHODS  */
restaurantRouter.post(
  "/restaurant-login",
  loginValidation(),
  controller.restaurantLogin.bind(controller)
);
restaurantRouter.post(
  "/restaurant-regiseteration",
  seller_Exists,
  controller.restaurantRegisteration.bind(controller)
);
restaurantRouter.post(
  "/add-table",restaurantVerificationMiddleware,
  controller.addNewTableSlot.bind(controller)
);
restaurantRouter.post(
  "/table-slot-add",restaurantVerificationMiddleware,
  controller.addNewTableTimeSlot.bind(controller)
);

/** PUT METHODS  */
restaurantRouter.put(
  "/restaurant-updation",restaurantVerificationMiddleware,
  controller.restaurantUpdation.bind(controller)
);
restaurantRouter.put(
  "/table-slot-delete/",restaurantVerificationMiddleware,
  controller.deleteTableTimeSlot.bind(controller)
);

restaurantRouter.get("/validate-token", sellerVerifyToken, (req, res) => {
  res.status(200).send({ userId: req.userId });
});
restaurantRouter.put(
  "/restaurant-logout",
  controller.sellerLogout.bind(controller)
);

export default restaurantRouter;
