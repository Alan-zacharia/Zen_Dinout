import { NextFunction, Request, Response } from "express";
import { IAdminInteractor } from "../../domain/interface/use-cases/IAdminInteractor";
import { validationResult } from "express-validator";
import { setAuthTokenCookie } from "../../functions/auth/cookieFunctions";

export class adminController {
  constructor(private readonly interactor: IAdminInteractor) {}

  /**
   * Login verification service
   * @param credentials - Object containing email and password for login
   * @returns Object containing admin data, message, token
   */
  async loginAdmin(req: Request, res: Response, next: NextFunction) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorMessage = errors.array()[0].msg;
      return res.status(400).json({ message: errorMessage });
    }
    console.log("Admin login service");
    try {
      const { email, password } = req.body;
      const { admin, message, token, refreshToken } =
        await this.interactor.adminLogin({ email, password });

      if (!admin) {
        return res.status(401).json({ message: message });
      }
      if (refreshToken) setAuthTokenCookie(res, "refreshToken", refreshToken);
      return res
        .status(201)
        .json({ user: admin, message, token, refreshToken });
    } catch (error) {
      console.error(" OOps ! error during  admin login service:", error);
      res.status(500).send("Internal server error");
    }
  }

  /**
   * get users list service
   * @returns Object containing users data, message
   */
  async getUsers(req: Request, res: Response, next: NextFunction) {
    console.log("Get User service");
    try {
      const { message, users } = await this.interactor.getUsers();
      return res.status(200).json({ message, users });
    } catch (error) {
      console.error(" OOps ! error during  admin get user service:", error);
      res.status(500).send("Internal server error");
    }
  }
  async userActions(req: Request, res: Response, next: NextFunction) {
    console.log("User Actions service");
    const { id, block } = req.params;
    try {
      const { message, users } = await this.interactor.actionInter(id, block);
      return res.status(200).json({ message, users });
    } catch (error) {
      console.error(" OOps ! error during  admin get user service:", error);
      res.status(500).send("Internal server error");
    }
  }

  /**
   * get restaurants list service
   * @returns Object containing restaurants is approved data, message
   */
  async getRestaurants(req: Request, res: Response, next: NextFunction) {
    console.log("Get restaurants service");
    try {
      const { message, restaurants } = await this.interactor.getResataurants();
      return res.status(200).json({ message, restaurants });
    } catch (error) {
      console.error(
        " OOps ! error during  admin get restaurant service:",
        error
      );
      res.status(500).send("Internal server error");
    }
  }
  /**
   * get restaurants list service
   * @returns Object containing restaurants data, message
   */
  async approveRestaurant(req: Request, res: Response, next: NextFunction) {
    console.log("Get restaurants service");
    try {
      const { message, restaurants } =
        await this.interactor.restaurantApprove();
      return res.status(200).json({ message, restaurants });
    } catch (error) {
      console.error(
        " OOps ! error during  admin get restaurant service:",
        error
      );
      res.status(500).send("Internal server error");
    }
  }
  /**
   * get restaurants list service
   * @returns Object containing restaurants data, message
   */
  async approval_restaurant(req: Request, res: Response, next: NextFunction) {
    console.log("Get approval_restaurant service");
    const { id } = req.params;
    try {
      const restaurantId = id.split(":");
      console.log("Resataurant ID :", restaurantId[1]);
      const { message, restaurants } =
        await this.interactor.getRestaurantDetailsInteractor(restaurantId[1]);
      return res.status(200).json({ message, restaurants });
    } catch (error) {
      console.error(
        " OOps ! error during  admin get restaurant service:",
        error
      );
      res.status(500).send("Internal server error");
    }
  }

  /**
   * put restaurants approval service
   * @returns Object containing restaurants data, approve
   */
  async confirmRestaurant_Approval(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    console.log("confirm Restaurant_Approval restaurants service");
    const id = req.params.id;
    const { logic, rejectReason } = req.body;
    console.log(logic);
    try {
      const restaurantId = id.split(":");
      console.log(restaurantId[1]);
      const { message, success } =
        await this.interactor.confirmRestaurantInteractor(
          restaurantId[1],
          logic,
          rejectReason
        );
      return res.status(200).json({ message, success });
    } catch (error) {
      console.error(
        " OOps ! error during  admin get restaurant service:",
        error
      );
      res.status(500).send("Internal server error");
    }
  }

  async Logout(req: Request, res: Response, next: NextFunction) {
    console.log("Admin Logout");
    try {
      res.cookie("Aauth_token", "", {
        expires: new Date(0),
      });
      res.send();
    } catch (error) {
      console.log(" OOps ! error during  admin Logout service:", error);
      res.status(500).send("Internal server error");
    }
  }
}
