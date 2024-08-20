import { Response, Request, NextFunction } from "express";
import { IUserInteractor } from "../../../domain/interface/use-cases/IUserInteractor";
// import {
//   bookingConfirmationInterface,
//   ReviewAddingInterface,
//   UserInterface,
// } from "../../../domain/entities/User";
import { setAuthTokenCookie } from "../../../functions/auth/cookieFunctions";
import logger from "../../../infrastructure/lib/Wintson";
import tableSlots from "../../../infrastructure/database/model.ts/tableSlots";
// import {
//   createMembershipPaymentIntent,
//   createPaymentIntent,
// } from "../../../functions/booking/paymentIntegration";
import {
  jwtGenerateRefreshToken,
  jwtGenerateToken,
} from "../../../functions/auth/jwtTokenFunctions";
import mongoose from "mongoose";
// import { tableSlotsGetRequestInterface } from "../../../domain/entities/restaurants";
import bookingModel from "../../../infrastructure/database/model.ts/bookingModel";
import couponModel from "../../../infrastructure/database/model.ts/couponModel";

import bookMarkModel from "../../../infrastructure/database/model.ts/bookMarkModel";
import membershipModel from "../../../infrastructure/database/model.ts/membershipModel";
import UserModel from "../../../infrastructure/database/model.ts/userModel";
import Wallet from "../../../infrastructure/database/model.ts/wallet";
import { AppError } from "../../middlewares/appError";
import { MESSAGES, STATUS_CODES } from "../../../configs/constants";
import TimeSlot from "../../../infrastructure/database/model.ts/restaurantTimeSlot";
import restaurantTableModel from "../../../infrastructure/database/model.ts/restaurantTable";

export class userController {
  constructor(private readonly interactor: IUserInteractor) {}

  /**
   * User Registeration service
   * @param credentials - Object containing username , email and
   * password  for registeration.
   * @method - POST METHOD
   * @returns Object containing message, token , and refreshToken
   */
  public async userRegisterController(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    console.log("User Registeration service..........");
    let credentials: UserInterface = req.body;
    try {
      const result = await this.interactor.userRegisterInteractor(credentials);
      const { message, user } = result;
      if (!user) {
        return res.status(500).json({ message: "Failed to register user" });
      }
      return res.status(STATUS_CODES.CREATED).json({ message });
    } catch (error) {
      logger.error(`Error in register service: ${(error as Error).message} `);
      next(
        new AppError(
          MESSAGES.INTERNAL_SERVER_ERROR,
          STATUS_CODES.INTERNAL_SERVER_ERROR
        )
      );
    }
  }

  /**
   * User Login service
   * @param credentials - Object containing email and password for login
   * @method - POST METHOD
   * @returns Object containing user data, message, token, and refreshToken
   */
  async userLoginController(req: Request, res: Response, next: NextFunction) {
    console.log("User Login Service..........");
    const { email, password } = req.body;
    try {
      const { user, token, refreshToken, message } =
        await this.interactor.userLoginInteractor({ email, password });
      if (!user) {
        console.log("User Login failed......");
        return res.status(401).json({ user: null, message, token: null });
      }
      if (refreshToken) setAuthTokenCookie(res, "refreshToken", refreshToken);
      logger.info("User Login successfull....");
      return res.status(200).json({ message, user, token });
    } catch (error) {
      logger.error(
        `OOps ! error during Login..........: ${(error as Error).message}`
      );
      return res.status(500).send({ message: "Internal server error...." });
    }
  }

  /**
   * Google auth service
   * @body   - credential contain google user data
   * @method - POST METHOD
   * @return   Object containing user data, message, token, and refreshToken
   */
  async googleLoginController(req: Request, res: Response, next: NextFunction) {
    console.log("Google login user........");
    const credentials: UserInterface = req.body;
    try {
      const { user, message } = await this.interactor.userRegisterInteractor(
        credentials
      );
      if (!user) {
        console.log("User google Login failed......");
        return res.status(401).json({ user: null, message, token: null });
      }
      let token = jwtGenerateToken(user._id as string, user.role as string);
      let refreshToken = jwtGenerateRefreshToken(
        user._id as string,
        user.role as string
      );
      if (refreshToken) setAuthTokenCookie(res, "refreshToken", refreshToken);
      logger.info("User google Login successfull....");
      return res.status(201).json({ message, user, token });
    } catch (error) {
      logger.error(
        `Oops an error during in google Login service .......! : ${
          (error as Error).message
        }`
      );
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  /**
   * Genrate otp service
   * @params data - email for otp generation
   * @method - POST METHOD
   * @return  otp to users mail
   */
  async generateOtpController(req: Request, res: Response, next: NextFunction) {
    console.log("Generate otp service............");
    const { email } = req.body;
    try {
      const { message, otp } = await this.interactor.generateOtpInteractor(
        email
      );
      if (!otp) {
        return res.status(400).json({ message });
      }
      return res.status(200).json({ otp: otp, message });
    } catch (error) {
      logger.error(
        `Oops an error during in otp service ! : ${(error as Error).message}`
      );
      return res.status(500).json({ message: "Internal server error" });
    }
  }
  /**
   * Get User profile service
   * @method - GET METHOD
   * @return  User Details
   */
  async getProfileController(req: Request, res: Response, next: NextFunction) {
    console.log("User Profile service........");
    const userId = req.userId;
    try {
      const { userDetails, status } =
        await this.interactor.getProfileInteractor(userId);
      console.log(userDetails);
      if (!status) {
        return res
          .status(404)
          .json({ message: "Failed to fetch the data", userData: null });
      }
      return res
        .status(200)
        .json({ message: "User Details....", userData: userDetails });
    } catch (error) {
      logger.error(
        `Oops an error occured in getProfile service...... : ${
          (error as Error).message
        }`
      );
      return res.status(500).json({ message: "Internal server error" });
    }
  }
  async getUserDataController(req: Request, res: Response, next: NextFunction) {
    console.log("User Profile service........");
    const userId = req.userId;
    try {
     const userDetails = await UserModel.findById(userId).populate("primeSubscription.membershipId");
     if (!userDetails) {
      return res.status(404).json({ message: "User not found" });
      }
      return res
        .status(200)
        .json({ message: "User Details....", userData: userDetails });
    } catch (error) {
      logger.error(
        `Oops an error occured in getProfile service...... : ${
          (error as Error).message
        }`
      );
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  /**
   * Update profile details service
   * @body   - credential contain user details
   * @method - PATCH METHOD
   * @return  userData , message and status
   */
  async updateProfileController(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    console.log("Update user details service......");
    const { credentials } = req.body;
    try {
      const userId = req.userId;
      const { updatedUser, status } =
        await this.interactor.updateUserDetailsInteractor(userId, credentials);
      if (!status)
        return res
          .status(500)
          .json({ message: "Failed to update", status, updatedUser });
      return res.status(201).json({
        message: "Updated successfull...",
        userData: updatedUser,
        status,
      });
    } catch (error) {
      logger.error(
        `Oops an error during in profile update service : ${
          (error as Error).message
        }`
      );
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  /**
   * Reset password service for get email
   * @body   - User Email address
   * @method - POST METHOD
   * @return - message and success
   */
  async resetPasswordController(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    console.log("Reset password service.........");
    const { email } = req.body;
    try {
      const { message, success } =
        await this.interactor.resetPasswordInteractor(email);
      if (!success) return res.status(404).json({ message, success });
      return res
        .status(200)
        .json({ message: "Reset Link sent to your email", success });
    } catch (error) {
      logger.error(
        "Oops an error during in reset password data getting service:",
        error
      );
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  /**
   * Reset password Updation service
   * @body   - credential contain password
   * @method - PATCH METHOD
   * @return  message and status
   */
  async resetPasswordUpdateController(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    console.log("Reset Password Updation service......");
    const { credentials } = req.body;
    try {
      const { id } = req.params;
      const userId = id.split(":");
      console.log(userId[1]);
      const { message, status } =
        await this.interactor.resetPasswordUpdateInteractor(
          userId[1],
          credentials.password
        );
      if (!status) return res.status(422).json({ message, status });
      return res.status(201).json({ message, status });
    } catch (error) {
      logger.error("Oops an error during in reset password service:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  /**
   * Get Restaurants service
   * @method - GET METHOD
   * @return  All approved restaurants List
   */
  async getRestaurantsController(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    console.log("Get Restaurants service.....");
    try {
      const { listedRestaurants } =
        await this.interactor.getListedRestaurantsInteractor();
      logger.info("Get restaurants....");
      return res.status(200).json({
        restaurant: listedRestaurants,
        message: "Succesfully fetched ......",
      });
    } catch (error) {
      logger.error(
        `Oops an error during get restaurants list service : ${
          (error as Error).message
        }`
      );
      return res.status(500).send("Internal server error");
    }
  }

  /**
   * Restaurant Detail service
   * @params - restaurantId
   * @method - GET METHOD
   * @return  restaurant details
   */
  async restaurantDetailsController(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    console.log("Restaurants service.....");
    const { restaurantId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(restaurantId)) {
      return res.status(400).json({ message: "Invalid restaurantId format" });
    }
    try {
      const { restaurantData, status } =
        await this.interactor.getRestaurantDetailsInteractor(restaurantId);
      let restaurantImages: string[] = [];
      if (restaurantData && restaurantData.featuredImage) {
        restaurantImages.push(restaurantData.featuredImage);
      }
      restaurantData?.secondaryImages?.map((image) => {
        restaurantImages.push(image);
      });
      if (!status) {
        return res.status(404).json({
          message: "Something went wrong",
          restaurant: null,
          restaurantImages: null,
        });
      }
      return res.status(200).json({
        restaurant: restaurantData,
        restaurantImages,
        message: "Successfully fetched....",
      });
    } catch (error) {
      logger.error(
        `Oops an error during in restaurant detail service : ${
          (error as Error).message
        }`
      );
      return res.status(500).json({ message: "Internal server error" });
    }
  }
  /**
   * Restaurant table Time slots service
   * @body - restaurantId , date , guests
   * @method - GET METHOD
   * @return  restaurant Table details
   */
  async restaurantTableSlotsController(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    console.log("Restaurants Table slot service.....");
    const tableSlotsGetData: tableSlotsGetRequestInterface = req.body;
    try {
      const { status, timeSlots } =
        await this.interactor.getRestaurantTableTimeSlotsInteractor(
          tableSlotsGetData
        );
      if (timeSlots && timeSlots.length > 0) {
        return res.status(200).json({
          status,
          TimeSlots: timeSlots,
          message: "Time Slots fetched successfully.....",
        });
      } else {
        return res
          .status(200)
          .json({ status, TimeSlots: [], message: "No available time slots" });
      }
    } catch (error) {
      logger.error(
        `Oops an error occurred in Table time slot service:
        ${(error as Error).message}`
      );
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  /**
   * Create Reviews service
   * @params - userId, restaurantId, reviewText, rating
   * @method - POST METHOD
   * @return  message
   */
  async addReviewController(req: Request, res: Response) {
    logger.info("Create Review.....");
    const reviewDatas: ReviewAddingInterface = req.body;
    try {
      const { message, status } = await this.interactor.addReviewInteractor(
        reviewDatas
      );
      if (!status) {
        return res.status(500).json({ message: message, status });
      }
      return res
        .status(200)
        .json({ message: "Review added succesfully..", status });
    } catch (error: any) {
      console.log("Oops an error in  create review : ", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  /**
   * Restaurant table  service
   * @body - tableId
   * @method - GET METHOD
   * @return  restaurant Table details
   */
  async restaurantTableDetailsController(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    console.log("Restaurants Table details service.....");
    const { tableId } = req.params;
    try {
      const { tableDetails, status } =
        await this.interactor.restaurantTableSlotsInteractor(tableId);
      if (!status) {
        console.log("Error fetching tables.....");
        return res
          .status(404)
          .json({ restaurantTable: null, message: "Something went wrong..." });
      }
      console.log(tableSlots);
      return res.status(200).json({
        restaurantTable: tableDetails,
        message: "Successfully fetched.....",
      });
    } catch (error) {
      logger.error(
        `Oops an error during in restaurant detail service: ${
          (error as Error).message
        }`
      );
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  /**
   * Get Booking history service
   * @params - userId
   * @method - GET METHOD
   * @return  Bookings
   */
  async getBookingDetailsController(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    console.log("Get Booking history service.....");
    const userId = req.userId;
    try {
      const { Bookings, status } =
        await this.interactor.getBookingDetailsInteractor(userId);

      return res
        .status(200)
        .json({ Bookings, message: "succesfully fetched....." });
    } catch (error) {
      logger.error(
        `Oops an error during in get booking detail service: ${
          (error as Error).message
        }`
      );
      return res.status(500).json({ message: "Internal server error" });
    }
  }
  /**
   * Get Reviews service
   * @params - restuarantId
   * @method - GET METHOD
   * @return  Reviews..
   */
  async getReviewsController(req: Request, res: Response, next: NextFunction) {
    console.log("Get Reviews service.....");
    const { restaurantId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(restaurantId)) {
      return res.status(400).json({ message: "Invalid restaurantId format" });
    }
    try {
      const { reviews, status } = await this.interactor.getReviewsInteractor(
        restaurantId
      );
      return res
        .status(200)
        .json({ reviews, message: "Succesfully fetched.....", status });
    } catch (error) {
      logger.error(
        `Oops an error during in get review service: ${
          (error as Error).message
        }`
      );
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  /**
   * Restaurant table slots service
   * @body - bookingId , status
   * @method - POST METHOD
   * @return  booking message
   */
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
        return res.status(201).json({ message: "Failed to book the table" });
      }
      console.log(bookingId, paymentStatus);
      return res.status(200).json({ message: "Booking Succesfull" });
    } catch (error) {
      logger.error("Oops an error during in booking status service:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }
  /**
   * Restaurant table slots service
   * @body - bookingId , status
   * @method - POST METHOD
   * @return  booking message
   */
  async cancelBookingController(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    console.log("Cancel booking service.....");
    const bookingId = req.params.bookingId;
    const userId = req.userId;
    try {
      const cancelBookingData = await bookingModel.findOneAndUpdate(
        { bookingId },
        {
          bookingStatus: "CANCELLED",
          paymentStatus: "REFUNDED",
        }
      );
      if (!cancelBookingData) {
        return res.status(404).json({ message: "Booking not found" });
      }
      const wallet = await Wallet.findOne({ userId });
      if (wallet) {
        const amount = cancelBookingData.totalAmount;
        wallet.balance += amount;
        wallet.transactions.push({
          amount,
          type: "credit",
          description: "Added funds",
        });
        await wallet.save();
      }
      return res.status(200).json({ message: "Booking Cancelled...." });
    } catch (error) {
      logger.error("Oops an error during in booking status service:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  /**
   * Restaurant table slots service
   * @body - bookingId , status
   * @method - POST METHOD
   * @return  booking message
   */
  async createBookingController(req: Request, res: Response) {
    logger.info("Create payment.....");
    const { email, name, restaurantDatas } = req.body;
    const bookingComfirmationDatas: bookingConfirmationInterface = req.body;
    console.log(bookingComfirmationDatas);
    const userId = req.userId;
    const totalCost = restaurantDatas.price;
    try {
      const { status, bookingId } =
        await this.interactor.tableBookingInteractor(
          userId,
          bookingComfirmationDatas,
          totalCost
        );
      const session = await createPaymentIntent(
        { name, email },
        totalCost,
        bookingId
      );
      return res.status(200).json({ sessionId: session.id });
    } catch (error: any) {
      console.log("Oops an error in payment : ", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }
  /**
   * Restaurant table slots service
   * @body - bookingId , status
   * @method - POST METHOD
   * @return  booking message
   */
  // async createMemberShipPaymentController(req: Request, res: Response) {
  //   logger.info("Create membership payment.....");
  //   const { membershipId } = req.body;
  //   const userId = req.userId;
  //   try {
  //     const membership = await membershipModel.findByIdAndUpdate(membershipId, {
  //       $inc: { users: 1 },
  //     });
  //     if (!membership) {
  //       return res.status(404).json({ message: "Something went wrong...." });
  //     }
  //     const totalCost = membership.cost;
  //     const user = await UserModel.findByIdAndUpdate(
  //       userId,
  //       {
  //         isPrimeMember: true,
  //         primeSubscription: {
  //           membershipId: membershipId,
  //           startDate: new Date(),
  //           endDate: new Date(
  //             new Date().setFullYear(new Date().getFullYear() + 1)
  //           ),
  //           type: "annual",
  //           status: "active",
  //         },
  //       },
  //       { new: true }
  //     );
  //     if (!user) {
  //       return res.status(404).json({ message: "Something went wrong...." });
  //     }
  //     const name = user?.username;
  //     const email = user?.email;
  //     const session = await createMembershipPaymentIntent(
  //       { name, email },
  //       totalCost
  //     );
  //     return res.status(200).json({ sessionId: session.id });
  //   } catch (error: any) {
  //     console.log("Oops an error in payment : ", error);
  //     return res.status(500).json({ message: "Internal server error" });
  //   }
  // }

  public async createMemberShipPaymentController(req: Request, res: Response) {
    console.log("Create membership payment.....");
    const { membershipId } = req.body;
    const userId = req.userId;
    try {
      const membership = await membershipModel.findById(membershipId);
      if (!membership) {
        return res.status(404).json({ message: "Membership not found." });
      }
      await membershipModel.findByIdAndUpdate(membershipId, {
        $inc: { users: 1 },
      });
  
      const totalCost = membership.cost;
      const now = new Date();
      let endDate;
  
      if (membership.type === "Monthly") {
        endDate = new Date(now.setMonth(now.getMonth() + 1));
      } else if (membership.type === "Annual") {
        endDate = new Date(now.setFullYear(now.getFullYear() + 1));
      } else {
        return res.status(400).json({ message: "Invalid membership type." });
      }
      const user = await UserModel.findByIdAndUpdate(
        userId,
        {
          isPrimeMember: true,
          primeSubscription: {
            membershipId,
            startDate: new Date(),
            endDate,
            type: membership.type,
            status: "active",
          },
        },
        { new: true }
      );
      if (!user) {
        return res.status(404).json({ message: "User not found." });
      }
      const name = user.username;
      const email = user.email;
      const session = await createMembershipPaymentIntent({ name, email }, totalCost);
      return res.status(200).json({ sessionId: session.id });
    } catch (error) {
      console.log("Error in payment: ", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  async cancelMembershipController(req: Request, res: Response) {
    const { membershipId } = req.body;
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

  /**
   * Apply coupon service
   * @body - coupon name
   * @method - POST METHOD
   * @return  coupon discount
   */
  async applyCouponController(req: Request, res: Response) {
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

  public async getTimeSlotController(req: Request, res: Response) {
    console.log("Fetching time slots...");
    const { date, restaurantId } = req.body;
    try {
      const allTimeSlots = await TimeSlot.find({ restaurantId, date });
      const bookedTimeSlots = await bookingModel
        .find({
          restaurantId,
          bookingDate: date,
          bookingStatus: { $ne: "CANCELLED" },
        })
        .select("timeSlot");

      const table = await restaurantTableModel.find({ restaurantId });
      const totalTables = table.length || 0;
      const bookingCountMap: { [key: string]: number } = {};
      bookedTimeSlots.forEach((booking) => {
        const timeSlotId = booking.timeSlot.toString();
        bookingCountMap[timeSlotId] = (bookingCountMap[timeSlotId] || 0) + 1;
      });
      const availableTimeSlots = allTimeSlots.filter((timeSlot) => {
        const isBooked =
          (bookingCountMap[timeSlot._id.toString()] || 0) >= totalTables;
        return timeSlot.isAvailable && !isBooked;
      });
      return res.status(200).json({ TimeSlots: availableTimeSlots });
    } catch (error) {
      console.log(`Error fetching time slots: ${(error as Error).message}`);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  /**
   * Bookings data detailed view service
   * @body - bookingId
   * @method - GET METHOD
   * @return  bookingDetails , status
   */
  async getBookingDetailedViewController(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const bookingId = req.params.bookingId;
    try {
      const { bookedDetails, status } =
        await this.interactor.getBookingDetailedViewInteractor(bookingId);
      if (!status) {
        return res.status(500).json({ message: "Something went wrong....." });
      }
      return res
        .status(200)
        .json({ apiStatus: status, bookingDetails: bookedDetails });
    } catch (error) {
      logger.error(
        `Error during in get booking detailed view ${(error as Error).message}`
      );
      return res.status(500).json({ message: "Internal server error.." });
    }
  }
  /**
   * Restaurant Tables detailed view service
   * @body - restaurant Id , table seats
   * @method - GET METHOD
   * @return  bookingDetails , status
   */
  async getRestaurantTablesController(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const restaurantId = req.params.restaurantId;
    const tableSize = parseInt(req.query.size as string) || 1;
    const slot = req.query.slot as string;
    const selectedDate = req.query.date as string;
    console.log(tableSize, restaurantId, slot, selectedDate);
    try {
      const { availableTables } =
        await this.interactor.getRestaurantTablesInteractor(
          restaurantId,
          tableSize,
          slot,
          selectedDate
        );
      return res
        .status(200)
        .json({ apiStatus: true, availableTables: availableTables });
    } catch (error) {
      logger.error(
        `Error during in get tables :------> ${(error as Error).message}`
      );
      return res.status(500).json({ message: "Internal server error.." });
    }
  }
  /**
   * Get Wallet service
   * @body - userId
   * @method - GET METHOD
   * @return  Wallet details
   */
  async getWalletController(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.userId;
      const wallet = await Wallet.findOne({ userId });
      return res.status(200).json({
        message: "Wallet details fetched successfully....",
        wallet: wallet,
      });
    } catch (error) {
      logger.error(
        `Error during in get Wallet :------> ${(error as Error).message}`
      );
      return res.status(500).json({ message: "Internal server error.." });
    }
  }
  /**
   * Get Coupons service
   * @body  - "..."
   * @method - GET METHOD
   * @return  All Coupons
   */
  async getCouponsController(req: Request, res: Response, next: NextFunction) {
    try {
      const today = new Date();
      const coupons = await couponModel.find({
        expiryDate: { $gte: today },
      });
      return res.status(200).json({
        message: "Coupons fetched successfully....",
        coupons: coupons,
      });
    } catch (error) {
      logger.error(
        `Error during in get Wallet :------> ${(error as Error).message}`
      );
      return res.status(500).json({ message: "Internal server error.." });
    }
  }
  /**
   * Check if a restaurant is bookmarked by the user
   * @method - GET
   * @body - { restaurantId: string }
   * @return - Whether the restaurant is bookmarked
   */
  async checkBookmarkController(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { restaurantId } = req.params;
      if (!restaurantId) {
        return res.status(400).json({ message: "Restaurant ID is required." });
      }
      const bookmark = await bookMarkModel.findOne({
        userId: req.userId,
        restaurantId: restaurantId,
      });
      if (bookmark) {
        return res.status(200).json({
          message: "Restaurant is bookmarked.",
          isBookmarked: true,
        });
      } else {
        return res.status(200).json({
          message: "Restaurant is not bookmarked.",
          isBookmarked: false,
        });
      }
    } catch (error) {
      logger.error(`Error checking bookmark: ${(error as Error).message}`);
      return res.status(500).json({ message: "Internal server error." });
    }
  }

  /**
   * Save Restaurant Controller
   * @body - { restaurantId: string }
   * @method - POST METHOD
   * @return - Confirmation message
   */
  async saveRestaurantController(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { restaurantId } = req.body;
      if (!restaurantId) {
        return res.status(400).json({ message: "Restaurant ID is required." });
      }
      const existingBookmark = await bookMarkModel.findOne({
        userId: req.userId,
        restaurantId,
      });
      if (existingBookmark) {
        await bookMarkModel.deleteOne({
          userId: req.userId,
          restaurantId,
        });
        return res
          .status(200)
          .json({ message: "Restuarant removed successfully." });
      }
      const saveRestaurant = new bookMarkModel({
        userId: req.userId,
        restaurantId,
      });
      await saveRestaurant.save();
      return res.status(201).json({
        message: "Restaurant saved successfully.",
      });
    } catch (error) {
      logger.error(`Error saving restaurant: ${(error as Error).message}`);
      return res.status(500).json({ message: "Internal server error." });
    }
  }
  /**
   * Get Saved Restaurant Controller
   * @body - { userId: string }
   * @method - GET METHOD
   * @return - Restaurants
   */
  async getSavedRestaurantController(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const userId = req.userId;
      if (!userId) {
        return res.status(400).json({ message: "userId is required." });
      }
      const savedRestaurants = await bookMarkModel
        .find({ userId })
        .populate("restaurantId");
      return res.status(200).json({
        message: "SavedRestaurants fetched successfully.......",
        savedRestaurants,
      });
    } catch (error) {
      logger.error(`Error saving restaurant: ${(error as Error).message}`);
      return res.status(500).json({ message: "Internal server error." });
    }
  }
  /**
   * Get memberships
   * @body - ""
   * @method - GET METHOD
   * @return - Memberships
   */
  async getMembershipsController(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const userId = req.userId;
      const user = await UserModel.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found." });
      }
      console.log(user.primeSubscription?.membershipId);
      if (user.isPrimeMember && user.primeSubscription?.status === "active") {
        const existingMembership = await membershipModel.findById(
          user.primeSubscription.membershipId
        );
        return res.status(200).json({
          message: "User's active membership fetched successfully.......",
          existingMembership,
          membership: [],
        });
      } else {
        const memberships = await membershipModel.find({});
        return res.status(200).json({
          message: "All memberships fetched successfully.......",
          memberships,
        });
      }
    } catch (error) {
      console.error(`Error fetching memberships: ${(error as Error).message}`);
      return res.status(500).json({ message: "Internal server error." });
    }
  }
  /**
   * Get memberships
   * @body - ""
   * @method - GET METHOD
   * @return - Memberships
   */
  async logoutController(req: Request, res: Response, next: NextFunction) {
    try {
      res.clearCookie("../");
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
