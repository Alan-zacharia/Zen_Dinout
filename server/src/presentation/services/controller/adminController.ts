import { NextFunction, Request, Response } from "express";
import { IAdminInteractor } from "../../../domain/interface/use-cases/IAdminInteractor";
import { validationResult } from "express-validator";
import { setAuthTokenCookie } from "../../../functions/auth/cookieFunctions";
import UserModel from "../../../infrastructure/database/model.ts/userModel";
import restaurantModel from "../../../infrastructure/database/model.ts/restaurantModel";
import logger from "../../../infrastructure/lib/Wintson";
import {
  CouponDetailsInterface,
  memberShipType,
} from "../../../domain/entities/admin";

export class adminController {
  constructor(private readonly interactor: IAdminInteractor) {}

  /**
   * Login verification service
   * @param credentials - Object containing email and password for admin login
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
  async getUserListContoller(req: Request, res: Response, next: NextFunction) {
    console.log("Get User service");
    const page = parseInt(req.query.page as string) || 1;
    try {
      const { message, users, totalPages } =
        await this.interactor.getUserListIntercator(page);
      return res.status(200).json({ message, users, totalPages });
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
  async getRestaurantListController(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    console.log("Get restaurant service......");
    const page = parseInt(req.query.page as string);
    try {
      const { message, restaurants, totalPages } =
        await this.interactor.getRestaurantListInteractor(page);
      return res.status(200).json({ message, restaurants, totalPages });
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
   * @returns Object containing restaurants is approved data, message
   */
  async getDashBoardController(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    console.log("Get restaurant service......");
    try {
      const users = await UserModel.find({ isVerified: true }).limit(5);
      const restaurants = await restaurantModel
        .find({ isApproved: true })
        .sort({ createdAt: -1 })
        .limit(5);
      const totalUsers = await UserModel.countDocuments();
      const totalRestaurants = await restaurantModel.countDocuments();
      return res
        .status(200)
        .json({ restaurants, users, totalUsers, totalRestaurants });
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

  async addCouponController(req: Request, res: Response, next: NextFunction) {
    console.log("Coupon create controller.....");
    try {
      const couponDetails: CouponDetailsInterface = req.body;
      const { message, status } = await this.interactor.addCouponInteractor(
        couponDetails
      );
      if (!status) {
        return res.status(500).json({ message, status });
      }
      return res.status(201).json({ message, status: true });
    } catch (error) {
      logger.error(
        `Error during in coupon create controller : ${(error as Error).message}`
      );
      return res.status(500).json({ message: "Internal server error." });
    }
  }
  async getCouponsController(req: Request, res: Response, next: NextFunction) {
    console.log("Get coupons controller.....");
    try {
      const { Coupons, message } = await this.interactor.getCouponsInteractor();
      return res.status(200).json({ message, Coupons });
    } catch (error) {
      logger.error(
        `Error during in get coupons controller : ${(error as Error).message}`
      );
      return res.status(500).json({ message: "Internal server error." });
    }
  }
  async getMembershipsController(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    console.log("Get memberships controller.....");
    try {
      const { memberships, message } =
        await this.interactor.getMembershipsInteractor();
      return res.status(200).json({ message, memberships });
    } catch (error) {
      logger.error(
        `Error during in get coupons controller : ${(error as Error).message}`
      );
      return res.status(500).json({ message: "Internal server error." });
    }
  }
  async removeCouponController(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    console.log("Remove coupons controller.....");
    const { couponId } = req.params;
    try {
      const { status, message } = await this.interactor.removeCouponInteractor(
        couponId
      );
      return res.status(200).json({ message, status });
    } catch (error) {
      logger.error(
        `Error during in get coupons controller : ${(error as Error).message}`
      );
      return res.status(500).json({ message: "Internal server error." });
    }
  }
  async addMembershipController(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    console.log("Add Membership controller.....");
    const membershipData: memberShipType = req.body;
    console.log(membershipData);
    try {
      const { status, message } = await this.interactor.addMembershipInteractor(
        membershipData
      );
      return res.status(200).json({ message, status });
    } catch (error) {
      logger.error(
        `Error during in get coupons controller : ${(error as Error).message}`
      );
      return res.status(500).json({ message: "Internal server error." });
    }
  }
}
