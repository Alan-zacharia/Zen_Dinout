import { NextFunction, Request, Response } from "express";
import { IAdminInteractor } from "../../../domain/interface/use-cases/IAdminInteractor";
import { validationResult } from "express-validator";
import UserModel from "../../../infrastructure/database/model/userModel";
import restaurantModel from "../../../infrastructure/database/model/restaurantModel";
import logger from "../../../infrastructure/lib/Wintson";
import { AppError } from "../../middlewares/appError";
import { STATES } from "mongoose";
import { MESSAGES, STATUS_CODES } from "../../../configs/constants";
import { setAuthTokenCookie } from "../../../infrastructure/utils/cookieUtils";
import { CouponType, MemberShipType } from "../../../domain/entities/UserType";

export class adminController {
  constructor(private readonly interactor: IAdminInteractor) {}

  async adminLoginController(req: Request, res: Response, next: NextFunction) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorMessage = errors.array()[0].msg;
      return res
        .status(STATUS_CODES.BAD_REQUEST)
        .json({ message: errorMessage });
    }
    console.log("admin login service .....");
    const { email, password } = req.body;
    try {
      const { admin, message, token, refreshToken } =
        await this.interactor.adminLoginInteractor({ email, password });
      console.log(admin);
      if (!admin) {
        return res.status(STATUS_CODES.UNAUTHORIZED).json({ message });
      }
      console.log(refreshToken);
      if (refreshToken) setAuthTokenCookie(res, "refreshToken", refreshToken);
      return res.status(STATUS_CODES.OK).json({ user: admin, message, token });
    } catch (error) {
      logger.error(`Error in admin login ${(error as Error).message}`);
      next(
        new AppError(
          (error as Error).message,
          STATUS_CODES.INTERNAL_SERVER_ERROR
        )
      );
    }
  }

  public async getUserListContoller(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    console.log("Get User service.......");
    const page = parseInt(req.query.page as string) || 1;
    const pageNumber = isNaN(page) ? 1 : page;
    try {
      const result = await this.interactor.getUserListInteractor(pageNumber);
      const { message, users, totalPages } = result;
      return res.status(STATUS_CODES.OK).json({ message, users, totalPages });
    } catch (error) {
      logger.error(`Error in Get users : ${(error as Error).message}`);
      next(
        new AppError(
          (error as Error).message,
          STATUS_CODES.INTERNAL_SERVER_ERROR
        )
      );
    }
  }

  public async getApproveRestaurantListController(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    console.log("Get approve restaurants service ....");
    try {
      const result = await this.interactor.getApproveRestaurantListInteractor();
      const { message, restaurants } = result;
      return res.status(STATUS_CODES.OK).json({ message, restaurants });
    } catch (error) {
      logger.error(
        `Error in get approve restaurant service ${(error as Error).message}`
      );
      next(
        new AppError(
          (error as Error).message,
          STATUS_CODES.INTERNAL_SERVER_ERROR
        )
      );
    }
  }

  public async getRestaurantListController(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    console.log("Get restaurant service......");
    const page = parseInt(req.query.page as string);
    const pageNumber = isNaN(page) ? 1 : page;
    try {
      const result = await this.interactor.getRestaurantListInteractor(
        pageNumber
      );
      const { message, restaurants, totalPages } = result;
      return res
        .status(STATUS_CODES.OK)
        .json({ message, restaurants, totalPages });
    } catch (error) {
      logger.error(
        `Error in get restaurant service ${(error as Error).message}`
      );
      next(
        new AppError(
          (error as Error).message,
          STATUS_CODES.INTERNAL_SERVER_ERROR
        )
      );
    }
  }

  public async getApproveRestaurantController(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    console.log("Get approve restauarnt service ....");
    const { restaurantId } = req.params;
    try {
      const result = await this.interactor.getApproveRestaurantInteractor(
        restaurantId
      );
      const { message, restaurant } = result;
      return res.status(STATUS_CODES.OK).json({ message, restaurant });
    } catch (error) {
      logger.error(
        `Error in get Approve Restaurant service ${(error as Error).message}`
      );
      next(
        new AppError(
          (error as Error).message,
          STATUS_CODES.INTERNAL_SERVER_ERROR
        )
      );
    }
  }

  public async userActionController(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    console.log("User Action service......");
    const { userId, action } = req.params;
    try {
      const result = await this.interactor.userActionInteractor(userId, action);
      const { message, user } = result;
      return res.status(STATUS_CODES.OK).json({ message, user });
    } catch (error) {
      logger.error(`Error in user action service ${(error as Error).message}`);
      next(
        new AppError(
          (error as Error).message,
          STATUS_CODES.INTERNAL_SERVER_ERROR
        )
      );
    }
  }
  public async approveRestaurantController(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    console.log("Confirm restaurants service......");
    const { restaurantId } = req.params;
    const { logic, rejectReason } = req.body;
    try {
      const result = await this.interactor.approveRestaurantInteractor(
        restaurantId,
        logic,
        rejectReason
      );
      const { message, success } = result;
      return res.status(STATUS_CODES.OK).json({ message, success });
    } catch (error) {
      logger.error(
        `Error in apporve restaurant service ${(error as Error).message}`
      );
      next(
        new AppError(
          (error as Error).message,
          STATUS_CODES.INTERNAL_SERVER_ERROR
        )
      );
    }
  }

  public async getCouponController(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    console.log("Get coupons controller.....");
    try {
      const result = await this.interactor.getCouponsInteractor();
      const { Coupons, message } = result;
      return res.status(STATUS_CODES.OK).json({ message, Coupons });
    } catch (error) {
      logger.error(`Error in get Coupons service ${(error as Error).message}`);
      next(
        new AppError(
          (error as Error).message,
          STATUS_CODES.INTERNAL_SERVER_ERROR
        )
      );
    }
  }
  public async getMembershipController(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    console.log("Get memberships controller.....");
    try {
      const result = await this.interactor.getMembershipInteractor();
      const { Memberships, message } = result;
      return res
        .status(STATUS_CODES.OK)
        .json({ message, memberships: Memberships });
    } catch (error) {
      logger.error(
        `Error in get membership service ${(error as Error).message}`
      );
      next(
        new AppError(
          (error as Error).message,
          STATUS_CODES.INTERNAL_SERVER_ERROR
        )
      );
    }
  }
  public async getDashboardDetailsController(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    console.log("Get dashboard controller.....");
    try {
      const result = await this.interactor.getDashboardDetailsInteractor();
      const {
        restaurantCount,
        totalAmount,
        userCount,
        status,
        revenueData,
        salesData,
        restaurants,
        users,
      } = result;
      return res
        .status(STATUS_CODES.OK)
        .json({
          status,
          restaurantCount,
          totalAmount,
          userCount,
          revenueData,
          salesData,
          restaurants,
          users,
        });
    } catch (error) {
      logger.error(
        `Error in get membership service ${(error as Error).message}`
      );
      next(
        new AppError(
          (error as Error).message,
          STATUS_CODES.INTERNAL_SERVER_ERROR
        )
      );
    }
  }
  public async updateMembershipController(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const { updatedMembership } = req.body;
    console.log("Update memberships controller.....");
    try {
      const result = await this.interactor.updateMembershipInteractor(
        updatedMembership
      );
      const { Membership, message } = result;
      if (!Membership) {
        return res
          .status(STATUS_CODES.BAD_REQUEST)
          .json({ message, Membership });
      }
      return res
        .status(STATUS_CODES.CREATED)
        .json({ message, membership: Membership });
    } catch (error) {
      logger.error(
        `Error in update membership service ${(error as Error).message}`
      );
      next(
        new AppError(
          (error as Error).message,
          STATUS_CODES.INTERNAL_SERVER_ERROR
        )
      );
    }
  }
  public async createCouponController(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    console.log("Create coupon controller.....");
    try {
      const couponDetails: CouponType = req.body;
      const result = await this.interactor.createCouponInteractor(
        couponDetails
      );
      const { message, status } = result;
      if (!status) {
        return res.status(STATUS_CODES.BAD_REQUEST).json({ message, status });
      }
      return res.status(STATUS_CODES.CREATED).json({ message, status: true });
    } catch (error) {
      logger.error(`Error in create coupon ${(error as Error).message}`);
      next(
        new AppError(
          (error as Error).message,
          STATUS_CODES.INTERNAL_SERVER_ERROR
        )
      );
    }
  }
  public async updateCouponController(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    console.log("update coupon controller.....");
    const { couponId } = req.params;
    const {formData} = req.body;
    try {
      const result = await this.interactor.updateCouponInteractor(couponId , formData);
      const { message, status } = result;
      if (!status) {
        return res.status(STATUS_CODES.BAD_REQUEST).json({ message, status });
      }
      return res.status(STATUS_CODES.CREATED).json({ message, status });
    } catch (error) {
      logger.error(`Error in remove coupon ${(error as Error).message}`);
      next(
        new AppError(
          (error as Error).message,
          STATUS_CODES.INTERNAL_SERVER_ERROR
        )
      );
    }
  }
  public async removeCouponController(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    console.log("Remove coupons controller.....");
    const { couponId } = req.params;
    try {
      const result = await this.interactor.removeCouponInteractor(couponId);
      const { message, status } = result;
      if (!status) {
        return res.status(STATUS_CODES.BAD_REQUEST).json({ message, status });
      }
      return res.status(STATUS_CODES.NO_CONTENT).json({ message, status });
    } catch (error) {
      logger.error(`Error in remove coupon ${(error as Error).message}`);
      next(
        new AppError(
          (error as Error).message,
          STATUS_CODES.INTERNAL_SERVER_ERROR
        )
      );
    }
  }
  public async removeMembershipController(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    console.log("Remove coupons controller.....");
    const { membershipId } = req.params;
    try {
      const result = await this.interactor.removeMembershipInteractor(
        membershipId
      );
      const { message, status } = result;
      if (!status) {
        return res.status(STATUS_CODES.BAD_REQUEST).json({ message, status });
      }
      return res.status(STATUS_CODES.NO_CONTENT).json({ message, status });
    } catch (error) {
      logger.error(`Error in remove coupon ${(error as Error).message}`);
      next(
        new AppError(
          (error as Error).message,
          STATUS_CODES.INTERNAL_SERVER_ERROR
        )
      );
    }
  }
  public async createMembershipController(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    console.log("Add Membership controller.....");
    const membershipData: MemberShipType = req.body;
    try {
      const result = await this.interactor.createMembershipInteractor(
        membershipData
      );
      const { message, status } = result;
      if (!status) {
        return res
          .status(STATUS_CODES.BAD_REQUEST)
          .json({ message: message, status });
      }
      return res.status(STATUS_CODES.CREATED).json({ message, status });
    } catch (error) {
      logger.error(
        `Error in create membership coupon ${(error as Error).message}`
      );
      next(
        new AppError(
          (error as Error).message,
          STATUS_CODES.INTERNAL_SERVER_ERROR
        )
      );
    }
  }
}
