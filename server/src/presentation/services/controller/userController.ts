import { Response, Request, NextFunction } from "express";
import { IUserInteractor } from "../../../domain/interface/use-cases/IUserInteractor";
import logger from "../../../infrastructure/lib/Wintson";
import mongoose from "mongoose";
import bookingModel from "../../../infrastructure/database/model.ts/bookingModel";
import couponModel from "../../../infrastructure/database/model.ts/couponModel";
import membershipModel from "../../../infrastructure/database/model.ts/membershipModel";
import UserModel from "../../../infrastructure/database/model.ts/userModel";
import Wallet from "../../../infrastructure/database/model.ts/wallet";
import { AppError } from "../../middlewares/appError";
import {
  MESSAGES,
  STATUS_CODES,
  SUCCESS_MESSAGES,
} from "../../../configs/constants";
import TimeSlot from "../../../infrastructure/database/model.ts/restaurantTimeSlot";
import restaurantTableModel from "../../../infrastructure/database/model.ts/restaurantTable";
import {
  BookingConfirmationType,
  ReviewType,
  UserType,
} from "../../../domain/entities/UserType";
import { setAuthTokenCookie } from "../../../infrastructure/utils/cookieUtils";
import createMembershipPaymentIntent from "../../../infrastructure/payment/stripeMembershipService";
import { createPaymentIntent } from "../../../infrastructure/payment/stripePaymentservice";

export class userController {
  constructor(private readonly interactor: IUserInteractor) {}

  public async registerUserController(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    console.log("User register service..........");
    const credentials: UserType = req.body;
    try {
      const result = await this.interactor.registerUserInteractor(credentials);
      const { message, user } = result;
      if (!user) {
        return res.status(STATUS_CODES.BAD_REQUEST).json({ message });
      }
      return res.status(STATUS_CODES.CREATED).json({ message });
    } catch (error) {
      logger.error(
        `Error in user register service: ${(error as Error).message} `
      );
      next(
        new AppError(
          MESSAGES.INTERNAL_SERVER_ERROR,
          STATUS_CODES.INTERNAL_SERVER_ERROR
        )
      );
    }
  }

  public async loginUserController(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    console.log("User Login Service..........");
    const { email, password } = req.body;
    try {
      const { user, token, refreshToken, message } =
        await this.interactor.loginUserInteractor({ email, password });
      if (!user) {
        return res
          .status(STATUS_CODES.UNAUTHORIZED)
          .json({ user: null, message, token: null });
      }
      if (refreshToken) setAuthTokenCookie(res, "refreshToken", refreshToken);
      return res.status(STATUS_CODES.OK).json({ message, user, token });
    } catch (error) {
      logger.error(
        `Error in google login service: ${(error as Error).message} `
      );
      next(
        new AppError(
          MESSAGES.INTERNAL_SERVER_ERROR,
          STATUS_CODES.INTERNAL_SERVER_ERROR
        )
      );
    }
  }

  public async googleLoginController(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    console.log("Google login user........");
    const credentials: UserType = req.body;
    try {
      const { user, message, refreshToken, token } =
        await this.interactor.googleLoginInteractor(credentials);
      if (!user) {
        return res
          .status(STATUS_CODES.UNAUTHORIZED)
          .json({ user: null, message, token: null });
      }
      if (refreshToken) setAuthTokenCookie(res, "refreshToken", refreshToken);
      return res.status(STATUS_CODES.CREATED).json({ message, user, token });
    } catch (error) {
      logger.error(
        `Error in google login service: ${(error as Error).message} `
      );
      next(
        new AppError(
          MESSAGES.INTERNAL_SERVER_ERROR,
          STATUS_CODES.INTERNAL_SERVER_ERROR
        )
      );
    }
  }

  public async generateOtpController(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    console.log("Generate otp service............");
    const { email } = req.body;
    try {
      const { message, otp } = await this.interactor.generateOtpInteractor(
        email
      );
      if (!otp) {
        return res.status(STATUS_CODES.BAD_REQUEST).json({ message });
      }
      return res.status(STATUS_CODES.OK).json({ otp: otp, message });
    } catch (error) {
      logger.error(
        `Error in generate otp service: ${(error as Error).message} `
      );
      next(
        new AppError(
          MESSAGES.INTERNAL_SERVER_ERROR,
          STATUS_CODES.INTERNAL_SERVER_ERROR
        )
      );
    }
  }

  public async resetPasswordController(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    console.log("Reset password service.........");
    const { email } = req.body;
    try {
      const { message, success } =
        await this.interactor.resetPasswordRequestInteractor(email);
      if (!success)
        return res.status(STATUS_CODES.NOT_FOUND).json({ message, success });
      return res
        .status(STATUS_CODES.OK)
        .json({ message: "Reset Link sent to your email", success });
    } catch (error) {
      logger.error(
        `Error in reset password request service: ${(error as Error).message} `
      );
      next(
        new AppError(
          MESSAGES.INTERNAL_SERVER_ERROR,
          STATUS_CODES.INTERNAL_SERVER_ERROR
        )
      );
    }
  }
  public async getProfileController(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    console.log("User Profile service........");
    const userId = req.userId;
    try {
      const { userDetails, status } =
        await this.interactor.getProfileInteractor(userId);
      if (!status) {
        return res
          .status(STATUS_CODES.NOT_FOUND)
          .json({ message: MESSAGES.RESOURCE_NOT_FOUND, userData: null });
      }
      return res.status(STATUS_CODES.OK).json({
        message: SUCCESS_MESSAGES.FETCHED_SUCCESSFULLY,
        userData: userDetails,
      });
    } catch (error) {
      logger.error(
        `Error in get profile service: ${(error as Error).message} `
      );
      next(
        new AppError(
          MESSAGES.INTERNAL_SERVER_ERROR,
          STATUS_CODES.INTERNAL_SERVER_ERROR
        )
      );
    }
  }

  public async getListedRestuarantsController(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    console.log("Get Restaurants service.....");
    try {
      const { listedRestaurants } =
        await this.interactor.getListedRestuarantInteractor();
      return res.status(STATUS_CODES.OK).json({
        restaurant: listedRestaurants,
        message: SUCCESS_MESSAGES.FETCHED_SUCCESSFULLY,
      });
    } catch (error) {
      logger.error(
        `Error in get restaurants service: ${(error as Error).message} `
      );
      next(
        new AppError(
          MESSAGES.INTERNAL_SERVER_ERROR,
          STATUS_CODES.INTERNAL_SERVER_ERROR
        )
      );
    }
  }
  public async getRestauarantDetailedViewController(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    console.log("Restaurants service.....");
    const { restaurantId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(restaurantId)) {
      return res
        .status(STATUS_CODES.BAD_REQUEST)
        .json({ message: MESSAGES.INVALID_FORMAT });
    }
    try {
      const { restaurant, status, restaurantImages } =
        await this.interactor.getRestaurantDetailedViewInteractor(restaurantId);
      if (!status) {
        return res.status(STATUS_CODES.NOT_FOUND).json({
          message: MESSAGES.RESOURCE_NOT_FOUND,
          restaurant: null,
          restaurantImages: null,
        });
      }
      return res.status(STATUS_CODES.OK).json({
        restaurant,
        restaurantImages,
        message: SUCCESS_MESSAGES.FETCHED_SUCCESSFULLY,
      });
    } catch (error) {
      logger.error(
        `Error in get restaurant detailed service: ${(error as Error).message} `
      );
      next(
        new AppError(
          MESSAGES.INTERNAL_SERVER_ERROR,
          STATUS_CODES.INTERNAL_SERVER_ERROR
        )
      );
    }
  }
  public async getBookingDataController(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    console.log("Get Booking service.....");
    const userId = req.userId;
    try {
      const { bookingData, status } =
        await this.interactor.getBookingDataInteractor(userId);
      if (!status) {
        return res.status(STATUS_CODES.NOT_FOUND).json({
          message: MESSAGES.RESOURCE_NOT_FOUND,
          status,
          bookingData: null,
        });
      }
      return res.status(STATUS_CODES.OK).json({
        status,
        bookingData,
        message: SUCCESS_MESSAGES.FETCHED_SUCCESSFULLY,
      });
    } catch (error) {
      logger.error(
        `Error in get booking details service: ${(error as Error).message} `
      );
      next(
        new AppError(
          MESSAGES.INTERNAL_SERVER_ERROR,
          STATUS_CODES.INTERNAL_SERVER_ERROR
        )
      );
    }
  }
  public async getBookingDetailedController(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    console.log("Get Booking service.....");
    const { bookingId } = req.params;
    try {
      const { bookingData, status } =
        await this.interactor.getBookingDetailedInteractor(bookingId);
      if (!status) {
        return res.status(STATUS_CODES.NOT_FOUND).json({
          message: MESSAGES.RESOURCE_NOT_FOUND,
          status,
          bookingData: null,
        });
      }
      return res.status(STATUS_CODES.OK).json({
        status,
        bookingData,
        message: SUCCESS_MESSAGES.FETCHED_SUCCESSFULLY,
      });
    } catch (error) {
      logger.error(
        `Error in get booking detailed view service: ${
          (error as Error).message
        } `
      );
      next(
        new AppError(
          MESSAGES.INTERNAL_SERVER_ERROR,
          STATUS_CODES.INTERNAL_SERVER_ERROR
        )
      );
    }
  }

  public async resetPasswordUpdateController(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    console.log("Reset Password Updation service......");
    const { credentials } = req.body;
    const { userId } = req.params;
    try {
      const { message, status } =
        await this.interactor.resetPasswordUpdateInteractor(
          userId,
          credentials.password
        );
      if (!status) return res.status(422).json({ message, status });
      return res.status(201).json({ message, status });
    } catch (error) {
      logger.error(
        `Error in update password service: ${(error as Error).message} `
      );
      next(
        new AppError(
          MESSAGES.INTERNAL_SERVER_ERROR,
          STATUS_CODES.INTERNAL_SERVER_ERROR
        )
      );
    }
  }

  public async updateProfileController(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    console.log("Update user details service......");
    const { credentials } = req.body;
    const userId = req.userId;
    try {
      const { updatedUser, status } =
        await this.interactor.updateUserProfileInteractor(userId, credentials);
      if (!status) {
        return res
          .status(STATUS_CODES.NOT_FOUND)
          .json({ message: MESSAGES.RESOURCE_NOT_FOUND, status, updatedUser });
      }
      return res.status(STATUS_CODES.CREATED).json({
        message: SUCCESS_MESSAGES.UPDATED_SUCCESSFULLY,
        userData: updatedUser,
        status,
      });
    } catch (error) {
      logger.error(
        `Error in update profile service: ${(error as Error).message} `
      );
      next(
        new AppError(
          MESSAGES.INTERNAL_SERVER_ERROR,
          STATUS_CODES.INTERNAL_SERVER_ERROR
        )
      );
    }
  }
  public async cancelBookingController(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    console.log("Cancel booking service.....");
    const bookingId = req.params.bookingId;
    const userId = req.userId;
    try {
      const { bookingData, status } =
        await this.interactor.cancelBookingInteractor(bookingId);
      if (!bookingData) {
        return res
          .status(STATUS_CODES.BAD_REQUEST)
          .json({ message: MESSAGES.INVALID_DATA, status });
      }
      return res
        .status(STATUS_CODES.OK)
        .json({ message: "Booking Cancelled...." });
    } catch (error) {
      logger.error(
        `Error in cancel Booking service: ${(error as Error).message} `
      );
      next(
        new AppError(
          MESSAGES.INTERNAL_SERVER_ERROR,
          STATUS_CODES.INTERNAL_SERVER_ERROR
        )
      );
    }
  }

  public async getUserWalletController(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const userId = req.userId;
    try {
      const { status, wallet } = await this.interactor.getUserWalletInteractor(
        userId
      );
      if (!wallet) {
        return res
          .status(STATUS_CODES.NOT_FOUND)
          .json({ message: MESSAGES.DATA_NOT_FOUND });
      }
      return res.status(STATUS_CODES.OK).json({
        message: SUCCESS_MESSAGES.FETCHED_SUCCESSFULLY,
        wallet,
      });
    } catch (error) {
      logger.error(`Error in get wallet service: ${(error as Error).message} `);
      next(
        new AppError(
          MESSAGES.INTERNAL_SERVER_ERROR,
          STATUS_CODES.INTERNAL_SERVER_ERROR
        )
      );
    }
  }
  public async getCouponsController(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const today = new Date();
    try {
      const { coupons, status } = await this.interactor.getCouponsInteractor(
        today
      );
      if (!status) {
        return res
          .status(STATUS_CODES.NOT_FOUND)
          .json({ message: "No coupons available..." });
      }
      return res.status(STATUS_CODES.OK).json({
        message: SUCCESS_MESSAGES.FETCHED_SUCCESSFULLY,
        coupons,
      });
    } catch (error) {
      logger.error(
        `Error in get coupons service: ${(error as Error).message} `
      );
      next(
        new AppError(
          MESSAGES.INTERNAL_SERVER_ERROR,
          STATUS_CODES.INTERNAL_SERVER_ERROR
        )
      );
    }
  }

  public async getSavedRestaurantContoller(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const userId = req.userId;
    try {
      const { savedRestaurants, status } =
        await this.interactor.getSavedRestaurantInteractor(userId);
      if (!status) {
        return res
          .status(STATUS_CODES.NOT_FOUND)
          .json({ message: MESSAGES.INVALID_FORMAT });
      }
      return res.status(STATUS_CODES.OK).json({
        message: SUCCESS_MESSAGES.FETCHED_SUCCESSFULLY,
        savedRestaurants,
      });
    } catch (error) {
      logger.error(
        `Error in get saved restaurants service: ${(error as Error).message} `
      );
      next(
        new AppError(
          MESSAGES.INTERNAL_SERVER_ERROR,
          STATUS_CODES.INTERNAL_SERVER_ERROR
        )
      );
    }
  }
  public async getCheckSavedRestaurantController(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    console.log("Check saved restaurant......");
    const { restaurantId } = req.params;
    const userId = req.userId;
    try {
      const { isBookmark, status } =
        await this.interactor.getCheckSavedRestaurantInteractor(
          restaurantId,
          userId
        );
      if (!status) {
        return res
          .status(STATUS_CODES.NOT_FOUND)
          .json({ message: MESSAGES.INVALID_FORMAT });
      }
      return res.status(STATUS_CODES.OK).json({
        message: SUCCESS_MESSAGES.FETCHED_SUCCESSFULLY,
        isBookmark,
      });
    } catch (error) {
      logger.error(
        `Error in get saved restaurant service: ${(error as Error).message} `
      );
      next(
        new AppError(
          MESSAGES.INTERNAL_SERVER_ERROR,
          STATUS_CODES.INTERNAL_SERVER_ERROR
        )
      );
    }
  }

  public async saveRestaurantController(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const { restaurantId } = req.body;
    const userId = req.userId;
    try {
      const { message, status } =
        await this.interactor.saveRestaurantInteractor(restaurantId, userId);
      if (!status) {
        return res.status(STATUS_CODES.BAD_REQUEST).json({ message, status });
      }
      return res.status(STATUS_CODES.OK).json({ message, status });
    } catch (error) {
      logger.error(
        `Error in  save restaurant service: ${(error as Error).message} `
      );
      next(
        new AppError(
          MESSAGES.INTERNAL_SERVER_ERROR,
          STATUS_CODES.INTERNAL_SERVER_ERROR
        )
      );
    }
  }
  public async addReviewController(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    logger.info("Create Review.....");
    const reviewDatas: ReviewType = req.body;
    const userId = req.userId;
    try {
      const { message, status } = await this.interactor.addReviewInteractor(
        reviewDatas,
        userId
      );
      if (!status) {
        return res
          .status(STATUS_CODES.BAD_REQUEST)
          .json({ message: message, status });
      }
      return res
        .status(STATUS_CODES.CREATED)
        .json({ message: SUCCESS_MESSAGES.RESOURCE_CREATED, status });
    } catch (error) {
      logger.error(
        `Error in  add review service: ${(error as Error).message} `
      );
      next(
        new AppError(
          MESSAGES.INTERNAL_SERVER_ERROR,
          STATUS_CODES.INTERNAL_SERVER_ERROR
        )
      );
    }
  }

  public async getReviewsController(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    console.log("Get Reviews service.....");
    const { restaurantId } = req.params;
    try {
      const { reviews, message, status } =
        await this.interactor.getReviewsInteractor(restaurantId);
      return res.status(STATUS_CODES.OK).json({ reviews, message, status });
    } catch (error) {
      logger.error(
        `Error in  get reviews service: ${(error as Error).message} `
      );
      next(
        new AppError(
          MESSAGES.INTERNAL_SERVER_ERROR,
          STATUS_CODES.INTERNAL_SERVER_ERROR
        )
      );
    }
  }
  public async getReviewController(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    console.log("Get Review service.....");
    const { restaurantId } = req.params;
    const userId = req.userId;
    try {
      const { review, message, status } =
        await this.interactor.getReviewInteractor(restaurantId, userId);
      if (!status) {
        return res
          .status(STATUS_CODES.NOT_FOUND)
          .json({ message: MESSAGES.DATA_NOT_FOUND });
      }
      return res.status(STATUS_CODES.OK).json({ review, message, status });
    } catch (error) {
      logger.error(
        `Error in  get reviews service: ${(error as Error).message} `
      );
      next(
        new AppError(
          MESSAGES.INTERNAL_SERVER_ERROR,
          STATUS_CODES.INTERNAL_SERVER_ERROR
        )
      );
    }
  }
  public async getRestaurantTablesController(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const restaurantId = req.params.restaurantId;
    const tableSize = parseInt(req.query.size as string) || 1;
    const page = parseInt(req.query.page as string) || 1;
    const slot = req.query.slot as string;
    const selectedDate = req.query.date as string;
    try {
      const { availableTables, status, message, totalTables, tablesPerPage } =
        await this.interactor.getRestaurantTableInteractor(
          restaurantId,
          tableSize,
          slot,
          selectedDate,
          page
        );
      if (!status) {
        return {
          apiStatus: status,
          availableTables,
          message,
          totalTables,
          tablesPerPage,
        };
      }
      return res.status(STATUS_CODES.OK).json({
        apiStatus: status,
        availableTables: availableTables,
        message,
        totalTables,
        tablesPerPage,
      });
    } catch (error) {
      logger.error(
        `Error in  get tables service: ${(error as Error).message} `
      );
      next(
        new AppError(
          MESSAGES.INTERNAL_SERVER_ERROR,
          STATUS_CODES.INTERNAL_SERVER_ERROR
        )
      );
    }
  }

  public async createBookingController(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    console.log("Creat payment.......");
    const { email, name, restaurantDatas } = req.body;
    const bookingComfirmationDatas: BookingConfirmationType = req.body;
    const userId = req.userId;
    const totalCost = restaurantDatas.price;
    try {
      const { status, bookingId } =
        await this.interactor.createBookingInteractor(
          userId,
          bookingComfirmationDatas,
          totalCost
        );
      if (bookingId) {
        const session = await createPaymentIntent(
          { name, email },
          totalCost,
          bookingId
        );
        return res.status(STATUS_CODES.CREATED).json({ sessionId: session.id });
      }
      return res
        .status(STATUS_CODES.BAD_REQUEST)
        .json({ message: MESSAGES.INVALID_DATA, status });
    } catch (error: any) {
      logger.error(
        `Error in  create booking service: ${(error as Error).message} `
      );
      next(
        new AppError(
          MESSAGES.INTERNAL_SERVER_ERROR,
          STATUS_CODES.INTERNAL_SERVER_ERROR
        )
      );
    }
  }

  public async getTimeSlotController(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    console.log("Get time slots...");
    const { date, restaurantId } = req.body;
    try {
      const { TimeSlots, status } = await this.interactor.getTimeSlotInteractor(
        restaurantId,
        date
      );
      if (!status) {
        return res
          .status(STATUS_CODES.BAD_REQUEST)
          .json({ message: MESSAGES.INVALID_FORMAT });
      }
      return res.status(STATUS_CODES.OK).json({ TimeSlots });
    } catch (error) {
      logger.error(
        `Error in get time slot service: ${(error as Error).message} `
      );
      next(
        new AppError(
          MESSAGES.INTERNAL_SERVER_ERROR,
          STATUS_CODES.INTERNAL_SERVER_ERROR
        )
      );
    }
  }
  public async createMemberShipPaymentController(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    console.log("Create membership payment.....");
    const { membershipId } = req.body;
    const userId = req.userId;
    try {
      const result = await this.interactor.createMembershipPaymentInteractor(
        userId,
        membershipId
      );
      const { sessionId, status } = result;
      if (!status) {
        return res
          .status(STATUS_CODES.BAD_REQUEST)
          .json({ message: MESSAGES.INVALID_FORMAT });
      }
      return res.status(200).json({ sessionId: sessionId });
    } catch (error) {
      logger.error(
        `Error in create membership service: ${(error as Error).message} `
      );
      next(
        new AppError(
          MESSAGES.INTERNAL_SERVER_ERROR,
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
    const userId = req.userId;
    try {
      const { existingMembership, memberships, status } =
        await this.interactor.getMembershipInteractor(userId);
      if (!status) {
        return res
          .status(STATUS_CODES.BAD_REQUEST)
          .json({ status, message: MESSAGES.INVALID_FORMAT });
      }
      return res
        .status(STATUS_CODES.OK)
        .json({ existingMembership, memberships, status });
    } catch (error) {
      logger.error(
        `Error in get membership service: ${(error as Error).message} `
      );
      next(
        new AppError(
          MESSAGES.INTERNAL_SERVER_ERROR,
          STATUS_CODES.INTERNAL_SERVER_ERROR
        )
      );
    }
  }

  ////////////////////////////////

  public async cancelMembershipController(req: Request, res: Response) {
    const membershipId = req.params.membershipId;
    const userId = req.userId;

    try {
      const membership = await membershipModel.findByIdAndUpdate(membershipId, {
        $inc: { users: -1 },
      });

      if (!membership) {
        return res.status(404).json({ message: "Membership not found" });
      }
      const wallet = await Wallet.findOne({ userId });
      if (wallet) {
        const amount = membership.cost;
        wallet.balance += amount;
        wallet.transactions.push({
          amount,
          type: "credit",
          description: "Added funds",
        });
        await wallet.save();
      }
      const user = await UserModel.findByIdAndUpdate(
        userId,
        {
          isPrimeMember: false,
          primeSubscription: {
            membershipId: null,
            startDate: null,
            endDate: null,
            type: null,
            status: "inactive",
          },
        },
        { new: true }
      );
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      return res
        .status(200)
        .json({ message: "Membership canceled successfully" });
    } catch (error: any) {
      console.error(`Error canceling membership: ${error.message}`);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  ////////////////////////////////

  public async applyCouponController(req: Request, res: Response) {
    console.log("Apply coupon.......");
    try {
      const { couponCode, minPurchase } = req.body;
      console.log(couponCode, minPurchase);
      const today = new Date();
      const coupon = await couponModel.findOne({
        couponCode: { $eq: couponCode },
        expiryDate: { $gt: today },
        minPurchase: { $lte: minPurchase },
      });
      if (!coupon) {
        return res
          .status(400)
          .json({ success: false, message: "Invalid or expired coupon code." });
      }
      return res.status(200).json({
        success: true,
        discount: coupon.discount,
        discountPrice: coupon.discountPrice,
      });
    } catch (error: any) {
      console.log(
        `Oops an error in apply coupon... : ${(error as Error).message}`
      );
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  ////////////////////////////////

  async bookingStatusUpdationController(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    console.log("Restaurants bookingStatusUpdation service.....");
    const bookingId = req.params.bookingId;
    const paymentStatus = req.body.paymentStatus;
    try {
      const { status } = await this.interactor.bookingStatusUpdationInteractor(
        bookingId,
        paymentStatus
      );
      if (!status) {
        return res
          .status(STATUS_CODES.OK)
          .json({ message: "Failed to book the table" });
      }
      console.log(bookingId, paymentStatus);
      return res
        .status(STATUS_CODES.CREATED)
        .json({ message: "Booking Succesfull" });
    } catch (error) {
      logger.error(
        `Error in update booking status : ${(error as Error).message}`
      );
      next(
        new AppError(
          MESSAGES.INTERNAL_SERVER_ERROR,
          STATUS_CODES.INTERNAL_SERVER_ERROR
        )
      );
    }
  }

  public async logoutController(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    console.log("Refresh token removed.......");
    try {
      res.clearCookie("refreshToken");
      return res.status(STATUS_CODES.OK).send("Logout successfull...!");
    } catch (error) {
      logger.error(`Error in Logout : ${(error as Error).message}`);
      next(
        new AppError(
          MESSAGES.INTERNAL_SERVER_ERROR,
          STATUS_CODES.INTERNAL_SERVER_ERROR
        )
      );
    }
  }
}
