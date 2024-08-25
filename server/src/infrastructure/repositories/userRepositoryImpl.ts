import {
  BookingConfirmationType,
  BookingDataType,
  CouponType,
  ReviewType,
  savedRestaurantType,
  UserType,
  WalletType,
} from "../../domain/entities/UserType";
import { IUserRepository } from "../../domain/interface/repositories/IUserRepository";
import userModel from "../database/model.ts/userModel";
import { otpGenerator } from "../../functions/OtpSetup";
import logger from "../lib/Wintson";
import {
  hashedPasswordCompare,
  hashedPasswordFunction,
} from "../../functions/bcryptFunctions";
import {
  RestaurantType,
  TableDataType,
} from "../../domain/entities/RestaurantType";
import restaurantModel from "../database/model.ts/restaurantModel";
import { MESSAGES, ROLES, SUCCESS_MESSAGES } from "../../configs/constants";
import { generateTokens } from "../utils/jwtUtils";
import EmailService from "../lib/EmailService";
import bookingModel from "../database/model.ts/bookingModel";
import Wallet from "../database/model.ts/wallet";
import couponModel from "../database/model.ts/couponModel";
import bookMarkModel from "../database/model.ts/bookMarkModel";
import reviewModel from "../database/model.ts/reviewModel";
import restaurantTableModel from "../database/model.ts/restaurantTable";
import { generateBookingId } from "../utils/generateBookingId";

export class userRepositoryImpl implements IUserRepository {
  public async findExistingUser(email: string): Promise<boolean> {
    try {
      const user = await userModel.findOne({ email });
      return !!user;
    } catch (error) {
      throw new Error("Failed to find user. Please try again later.");
    }
  }

  public async registerUserRepo(
    user: UserType
  ): Promise<{ user: UserType | null; message: string }> {
    const { username, email, password } = user;
    try {
      const isExist = await this.findExistingUser(email);
      if (isExist) {
        return {
          user: null,
          message: MESSAGES.USER_ALREADY_EXISTS,
        };
      }
      const newUser = new userModel({
        username,
        email,
        password,
      });
      await newUser.save();
      return {
        user: newUser as UserType,
        message: SUCCESS_MESSAGES.RESOURCE_CREATED,
      };
    } catch (error) {
      throw error;
    }
  }

  public async loginUserRepo(
    email: string,
    password: string
  ): Promise<{
    user: UserType | null;
    message: string;
    token: string | null;
    refreshToken: string | null;
  }> {
    try {
      const user = await userModel.findOne({ email: email });
      if (!user) {
        return {
          user: null,
          message: MESSAGES.RESOURCE_NOT_FOUND,
          token: null,
          refreshToken: null,
        };
      }
      const isValidPassword = await hashedPasswordCompare(
        password,
        user.password
      );
      if (isValidPassword) {
        const { generatedAccessToken, generatedRefreshToken } = generateTokens(
          user._id as string,
          ROLES.USER
        );
        const { password, ...userWithoutPassword } = user.toObject();
        return {
          user: userWithoutPassword as UserType,
          message: SUCCESS_MESSAGES.LOGIN_SUCCESS,
          token: generatedAccessToken,
          refreshToken: generatedRefreshToken,
        };
      } else {
        return {
          user: null,
          message: MESSAGES.INVALID_PASSWORD,
          token: null,
          refreshToken: null,
        };
      }
    } catch (error) {
      throw error;
    }
  }

  public async googleLoginRepo(credentials: UserType): Promise<{
    message: string;
    user: UserType;
    token: string;
    refreshToken: string;
  }> {
    const { email, username, password } = credentials;
    try {
      const user = new userModel({
        username: username,
        email: email,
        password: password,
      });
      await user.save();
      const { generatedAccessToken, generatedRefreshToken } = generateTokens(
        user._id as string,
        ROLES.USER
      );
      return {
        user: user as UserType,
        message: SUCCESS_MESSAGES.RESOURCE_CREATED,
        token: generatedAccessToken,
        refreshToken: generatedRefreshToken,
      };
    } catch (error) {
      throw error;
    }
  }

  public async generateOtpRepo(
    email: string
  ): Promise<{ message: string; otp: number }> {
    try {
      const otp = otpGenerator.generateOtp();
      await EmailService.sendOtpEmail(email, otp);
      logger.info(`Otp : ${otp}`);
      return { message: "Otp Sended successfully", otp };
    } catch (error) {
      throw error;
    }
  }

  public async getProfileRepo(
    userId: string
  ): Promise<{ userDetails: UserType | null; status: boolean }> {
    try {
      const userDetails = await userModel
        .findById(userId)
        .select("-password")
        .populate("primeSubscription.membershipId", "discount");
      if (!userDetails) {
        return { status: false, userDetails: null };
      }
      return { status: true, userDetails: userDetails as UserType };
    } catch (error) {
      throw error;
    }
  }
  public async updateUserProfileRepo(
    userId: string,
    datas: UserType
  ): Promise<{ updatedUser: UserType | null; status: boolean }> {
    try {
      const updatedUser = await userModel
        .findByIdAndUpdate(
          userId,
          {
            username: datas.username,
            phone: datas.phone,
          },
          { upsert: true, new: true }
        )
        .select("-password");
      if (!updatedUser) {
        return { status: false, updatedUser: null };
      }
      return { status: true, updatedUser: updatedUser.toObject() };
    } catch (error) {
      throw error;
    }
  }

  public async getListedRestuarantRepo(): Promise<{
    listedRestaurants: RestaurantType[];
  }> {
    try {
      const listedRestaurants: RestaurantType[] =
        await restaurantModel.aggregate([
          { $match: { isApproved: true } },
          {
            $match: {
              $and: [
                { featuredImage: { $exists: true } },
                { address: { $exists: true } },
              ],
            },
          },
          { $sort: { createdAt: -1 } },
          {
            $project: {
              password: 0,
            },
          },
        ]);
      return { listedRestaurants: listedRestaurants };
    } catch (error) {
      throw error;
    }
  }
  public async getRestaurantDetailedViewRepo(restaurantId: string): Promise<{
    restaurant: RestaurantType | null;
    restaurantImages: string[] | null;
    status: boolean;
  }> {
    try {
      let restaurantImages: string[] = [];
      const restaurant = await restaurantModel
        .findById(restaurantId)
        .select("-password");
      if (!restaurant) {
        return { restaurant: null, status: false, restaurantImages: null };
      }
      if (restaurant.featuredImage && restaurant.featuredImage.url) {
        restaurantImages.push(restaurant.featuredImage.url);
      }
      restaurant.secondaryImages?.map((image) => {
        if (image.url) {
          restaurantImages.push(image.url);
        }
      });
      return {
        restaurant: restaurant.toObject(),
        restaurantImages,
        status: true,
      };
    } catch (error) {
      throw error;
    }
  }

  public async resetPasswordRequestRepo(
    email: string
  ): Promise<{ message: string; success: boolean }> {
    try {
      const user = await userModel.findOne({ email });
      if (!user) {
        return { message: MESSAGES.RESOURCE_NOT_FOUND, success: false };
      }
      EmailService.sendPasswordResetEmail(user.email, user._id as string);
      return { message: "Successs...", success: true };
    } catch (error) {
      throw error;
    }
  }
  public async resetPasswordUpdateRepo(
    userId: string,
    password: string
  ): Promise<{ message: string; status: boolean }> {
    try {
      const { hashedPassword } = await hashedPasswordFunction(password);
      const user = await userModel.findByIdAndUpdate(userId, {
        password: hashedPassword,
      });
      if (!user) {
        return { message: MESSAGES.RESOURCE_NOT_FOUND, status: false };
      }
      return { message: SUCCESS_MESSAGES.UPDATED_SUCCESSFULLY, status: true };
    } catch (error) {
      throw error;
    }
  }
  public async getBookingDataRepo(
    userId: string
  ): Promise<{ bookingData: BookingDataType[] | null; status: boolean }> {
    try {
      const bookings = await bookingModel
        .find({ userId })
        .populate("table", "tableNumber")
        .populate("restaurantId", "_id restaurantName featuredImage tableRate")
        .populate("userId", "username email")
        .sort({ createdAt: 1 });
      const bookingData: BookingDataType[] = bookings.map((data) => {
        return data.toObject();
      });
      return { bookingData: bookingData, status: true };
    } catch (error) {
      throw error;
    }
  }
  public async getBookingDetailedRepo(
    bookingId: string
  ): Promise<{ bookingData: BookingDataType | null; status: boolean }> {
    try {
      const bookingData = await bookingModel
        .findOne({ bookingId })
        .populate("table", "tableNumber")
        .populate("restaurantId", "_id restaurantName featuredImage tableRate")
        .populate("userId", "username email");
      console.log(bookingData);
      if (!bookingData) {
        return { bookingData: null, status: false };
      }
      return { bookingData: bookingData.toObject(), status: true };
    } catch (error) {
      throw error;
    }
  }
  public async cancelBookingRepo(
    bookingId: string
  ): Promise<{ bookingData: BookingDataType | null; status: boolean }> {
    try {
      const cancelBookingData = await bookingModel.findOneAndUpdate(
        { bookingId },
        {
          bookingStatus: "CANCELLED",
          paymentStatus: "REFUNDED",
        }
      );
      if (!cancelBookingData) {
        return { bookingData: null, status: false };
      }
      const wallet = await Wallet.findOne({ userId: cancelBookingData.userId });
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
      return { bookingData: cancelBookingData.toObject(), status: true };
    } catch (error) {
      throw error;
    }
  }
  public async getUserWalletRepo(
    userId: string
  ): Promise<{ wallet: WalletType | null; status: boolean }> {
    try {
      const wallet = await Wallet.findOne({ userId });
      if (!wallet) {
        return { wallet: null, status: false };
      }
      return { wallet: wallet.toObject(), status: false };
    } catch (error) {
      throw error;
    }
  }
  public async getCouponsRepo(
    date: Date
  ): Promise<{ coupons: CouponType[] | null; status: boolean }> {
    try {
      const coupons = await couponModel.find({
        expiryDate: { $gte: date },
      });
      const couponsList: CouponType[] = coupons.map((data) => {
        return data.toObject();
      });
      return { coupons: couponsList, status: true };
    } catch (error) {
      throw error;
    }
  }
  public async saveRestaurantRepo(
    restaurantId: string,
    userId: string
  ): Promise<{
    message: string;
    status: boolean;
  }> {
    try {
      const existingBookmark = await bookMarkModel.findOne({
        userId,
        restaurantId,
      });
      console.log(existingBookmark, restaurantId, userId);
      if (existingBookmark) {
        await bookMarkModel.deleteOne({
          userId,
          restaurantId,
        });
        return { message: "Restaurant removed....", status: true };
      }
      const savedRestaurant = new bookMarkModel({
        userId,
        restaurantId,
      });
      console.log(savedRestaurant);

      await savedRestaurant.save();
      return { message: "Restaurant added...", status: true };
    } catch (error) {
      throw error;
    }
  }
  public async getSavedRestaurantRepo(userId: string): Promise<{
    savedRestaurants: savedRestaurantType[] | null;
    status: boolean;
  }> {
    try {
      const savedRestaurantList = await bookMarkModel
        .find({ userId })
        .populate("restaurantId");
      const savedRestaurants: savedRestaurantType[] = savedRestaurantList.map(
        (data) => {
          return data.toObject();
        }
      );
      return { savedRestaurants: savedRestaurants, status: true };
    } catch (error) {
      throw error;
    }
  }
  public async getCheckSavedRestaurantRepo(
    restaurantId: string,
    userId: string
  ): Promise<{ isBookmark: boolean; status: boolean }> {
    try {
      const savedRestaurant = await bookMarkModel.findOne({
        restaurantId,
        userId,
      });
      if (!savedRestaurant) {
        return { isBookmark: false, status: true };
      }
      return { isBookmark: true, status: true };
    } catch (error) {
      throw error;
    }
  }
  public async createBookingRepo(
    userId: string,
    bookingComfirmationDatas: BookingConfirmationType,
    totalCost: string
  ): Promise<{ status: boolean; bookingId: string | null }> {
    const { bookingTime, Date, paymentMethod, restaurantDatas, timeSlotId } =
      bookingComfirmationDatas;
    const { Capacity, price, restaurantId, subTotal, table } = restaurantDatas;
    try {
      const newBooking = new bookingModel({
        bookingId: generateBookingId(),
        userId,
        table,
        restaurantId,
        timeSlot: timeSlotId,
        guestCount: Capacity,
        bookingDate: Date,
        bookingTime,
        paymentMethod,
        totalAmount: price,
        subTotal,
      });
      await newBooking.save();
      if (!newBooking) {
        return { status: false, bookingId: null };
      }

      return { bookingId: newBooking.bookingId as string, status: true };
    } catch (error) {
      throw error;
    }
  }
  public async addReviewRepo(
    reviewDatas: ReviewType,
    userId: string
  ): Promise<{ message: string; status: boolean }> {
    const { rating, restaurantId, reviewText } = reviewDatas;
    try {
      const newReview = await reviewModel.findOneAndUpdate(
        { userId, restaurantId },
        { reviewText, rating },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
      if (!newReview) {
        return { message: "Review not added", status: false };
      }
      return {
        status: true,
        message: SUCCESS_MESSAGES.RESOURCE_CREATED,
      };
    } catch (error) {
      throw error;
    }
  }
  public async getReviewsRepo(restaurantId: string): Promise<{
    message: string;
    status: boolean;
    reviews: ReviewType[] | null;
  }> {
    try {
      const reviewsList = await reviewModel.find({
        restaurantId,
      });
      const reviews: ReviewType[] = reviewsList.map((data) => {
        return data.toObject();
      });
      return {
        reviews: reviews,
        status: true,
        message: SUCCESS_MESSAGES.FETCHED_SUCCESSFULLY,
      };
    } catch (error) {
      throw error;
    }
  }
  public async getReviewRepo(
    restaurantId: string,
    userId: string
  ): Promise<{
    message: string;
    status: boolean;
    review: ReviewType | null;
  }> {
    try {
      const review = await reviewModel.findOne({
        restaurantId,
        userId,
      });
      if (!review) {
        return {
          status: false,
          message: MESSAGES.DATA_NOT_FOUND,
          review: null,
        };
      }
      return {
        review: review?.toObject(),
        status: true,
        message: SUCCESS_MESSAGES.FETCHED_SUCCESSFULLY,
      };
    } catch (error) {
      throw error;
    }
  }
  public async getRestaurantTableRepo(
    restaurantId: string,
    tableSize: number,
    slot: string,
    selectedDate: string,
    page: number
  ): Promise<{
    availableTables: TableDataType[] | null;
    status: boolean;
    message: string;
    totalTables: number;
    tablesPerPage: number;
  }> {
    try {
      const tablesPerPage = 4;
      const bookedTables = await bookingModel
        .find({
          restaurantId,
          timeSlot: slot,
          bookingDate: new Date(selectedDate),
        })
        .select("table");

      const bookedTableIds = bookedTables.map((booking) => booking.table);
      const totalTables = await restaurantTableModel.countDocuments({
        restaurantId,
        tableCapacity: { $gte: tableSize },
        _id: { $nin: bookedTableIds },
      });
      const availableTables = await restaurantTableModel
        .find({
          restaurantId,
          tableCapacity: { $gte: tableSize },
          _id: { $nin: bookedTableIds },
        })
        .skip(page * 1 - 1)
        .limit(tablesPerPage)
        .sort({ tableCapacity: 1 });
      if (!availableTables.length) {
        return {
          status: true,
          message: MESSAGES.NO_TABLES_AVAILABLE,
          availableTables: [],
          totalTables: 0,
          tablesPerPage: 0,
        };
      }
      const tables: TableDataType[] = availableTables.map((table) => {
        return table.toObject();
      });
      return {
        status: true,
        message: SUCCESS_MESSAGES.FETCHED_SUCCESSFULLY,
        availableTables: tables,
        totalTables,
        tablesPerPage,
      };
    } catch (error) {
      throw error;
    }
  }
  public async bookingStatusUpdationRepo(
    bookingId: string,
    paymentStatus: string
  ): Promise<{
    status: boolean;
  }> {
    try {
      console.log(paymentStatus, bookingId);
      const bookingData = await bookingModel.findOne({ bookingId });
      if (!bookingData) {
        return {
          status: false,
        };
      }
      if (paymentStatus == "PAID") {
        bookingData.paymentStatus = paymentStatus;
        bookingData.bookingStatus = "CONFIRMED";
      } else if (paymentStatus == "FAILED") {
        bookingData.paymentStatus = paymentStatus;
        bookingData.bookingStatus = "CANCELLED";
      }
      await bookingData.save();
      return {
        status: true,
      };
    } catch (error) {
      throw error;
    }
  }
}
