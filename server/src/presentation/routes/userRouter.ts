import { Request, Response, Router } from "express";
import { userController } from "../services/userController";
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

/** Post Methods  */
userRouter.post(
  "/login",
  loginValidation(),
  userBlocked,
  controller.userLogin.bind(controller)
);
userRouter.post(
  "/google-login",
  signupValidation(),
  userBlocked,
  userExistGoogle,
  controller.googleLoginService.bind(controller)
);
userRouter.post(
  "/register",
  signupValidation(),
  userExists,
  controller.userRegister.bind(controller)
);
userRouter.post(
  "/generate-otp",
  signupValidation(),
  userExists,
  controller.generateOtp.bind(controller)
);
userRouter.post(
  "/reset-password",
  controller.resetPasswordGetUser.bind(controller)
);
userRouter.post(
  "/restaurant-slots",
  controller.restaurantTableSlots.bind(controller)
);
userRouter.post(
  "/create-payment",
  userVerifyMiddleware,
  controller.createPayment.bind(controller)
);

/** Get Methods  */
userRouter.get("/get-restaurants", controller.getRestaurants.bind(controller));
userRouter.get(
  "/restaurant-view/:restaurantId",
  controller.restaurantDetails.bind(controller)
);
userRouter.get(
  "/user-profile/:userId",
  userVerifyMiddleware,
  controller.getProfile.bind(controller)
);
userRouter.get(
  "/user-details/:userId",
  controller.getUserData.bind(controller)
);
userRouter.get(
  "/restaurant-photos/:restaurantId",
  controller.getRestaurantImages.bind(controller)
);
userRouter.get(
  "/restaurant-table-details/:tableId",
  controller.restaurantTableDetails.bind(controller)
);

/** Put Methods  */
userRouter.put(
  "/reset-password/:id",
  controller.resetPasswordUpdate.bind(controller)
);
userRouter.put(
  "/update-userdetails/:id",
  userVerifyMiddleware,
  controller.updateUserDetails.bind(controller)
);

userRouter.get(
  "/validate-token",
  verifyToken,
  (req: Request, res: Response) => {
    res.status(200).send({ userId: req.userId });
  }
);

userRouter.post("/logout", controller.userLogout.bind(controller));

export default userRouter;
