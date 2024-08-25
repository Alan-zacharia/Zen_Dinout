import { MESSAGES } from "../../configs/constants";
import {
  BookingConfirmationType,
  BookingDataType,
  CouponType,
  ReviewType,
  savedRestaurantType,
  UserType,
  WalletType,
} from "../../domain/entities/UserType";
import {
  RestaurantType,
  TableDataType,
} from "../../domain/entities/RestaurantType";
import { IMailer } from "../../domain/interface/external-lib/IMailer";
import { IUserRepository } from "../../domain/interface/repositories/IUserRepository";
import { IUserInteractor } from "../../domain/interface/use-cases/IUserInteractor";
import logger from "../../infrastructure/lib/Wintson";

export class userInteractorImpl implements IUserInteractor {
  constructor(private readonly repository: IUserRepository) {}
  public async registerUserInteractor(
    credentials: UserType
  ): Promise<{ user: UserType | null; message: string }> {
    const { email, username, password } = credentials;
    if (!email || !username || !password) {
      return { user: null, message: MESSAGES.INVALID_REGISTER };
    }
    try {
      const result = await this.repository.registerUserRepo(credentials);
      const { message, user } = result;
      return { user, message };
    } catch (error) {
      throw error;
    }
  }

  public async loginUserInteractor(credentials: {
    email: string;
    password: string;
  }): Promise<{
    user: UserType | null;
    message: string;
    token: string | null;
    refreshToken: string | null;
  }> {
    const { email, password } = credentials;
    if (!email || !password) {
      return {
        user: null,
        message: MESSAGES.INVALID_FORMAT,
        token: null,
        refreshToken: null,
      };
    }
    try {
      const result = await this.repository.loginUserRepo(email, password);
      const { message, user, refreshToken, token } = result;
      return { user, message, token, refreshToken };
    } catch (error) {
      throw error;
    }
  }

  public async googleLoginInteractor(credentials: UserType): Promise<{
    message: string;
    user: UserType | null;
    token: string | null;
    refreshToken: string | null;
  }> {
    const { email, password, username } = credentials;
    if (!password || !email) {
      return {
        user: null,
        message: MESSAGES.INVALID_FORMAT,
        token: null,
        refreshToken: null,
      };
    }
    try {
      const loginResult = await this.repository.loginUserRepo(email, password);
      if (loginResult.user) {
        return {
          message: loginResult.message,
          user: loginResult.user,
          token: loginResult.token,
          refreshToken: loginResult.refreshToken,
        };
      }
      const { message, user, token, refreshToken } =
        await this.repository.googleLoginRepo(credentials);
      return { message, user, token, refreshToken };
    } catch (error) {
      logger.error(error);
      throw error;
    }
  }
  public async generateOtpInteractor(
    email: string
  ): Promise<{ message: string; otp: number | null }> {
    if (!email) {
      return { message: MESSAGES.INVALID_EMAIL_FORMAT, otp: null };
    }
    try {
      const { message, otp } = await this.repository.generateOtpRepo(email);
      return { message, otp };
    } catch (error) {
      throw error;
    }
  }
  public async resetPasswordRequestInteractor(
    email: string
  ): Promise<{ message: string; success: boolean }> {
    if (!email) {
      return { message: MESSAGES.INVALID_EMAIL_FORMAT, success: false };
    }
    try {
      const { message, success } =
        await this.repository.resetPasswordRequestRepo(email);
      return { message, success };
    } catch (error) {
      throw error;
    }
  }

  public async getProfileInteractor(
    userId: string
  ): Promise<{ userDetails: UserType | null; status: boolean }> {
    if (!userId) {
      return { userDetails: null, status: false };
    }
    try {
      const result = await this.repository.getProfileRepo(userId);
      const { status, userDetails } = result;
      return { userDetails, status };
    } catch (error) {
      throw error;
    }
  }

  public async getListedRestuarantInteractor(): Promise<{
    listedRestaurants: RestaurantType[];
  }> {
    try {
      const { listedRestaurants } =
        await this.repository.getListedRestuarantRepo();
      return { listedRestaurants };
    } catch (error) {
      throw error;
    }
  }
  public async getRestaurantDetailedViewInteractor(
    restaurantId: string
  ): Promise<{
    restaurant: RestaurantType | null;
    restaurantImages: string[] | null;
    status: boolean;
  }> {
    if (!restaurantId) {
      return { restaurant: null, status: false, restaurantImages: null };
    }
    try {
      const { restaurant, status, restaurantImages } =
        await this.repository.getRestaurantDetailedViewRepo(restaurantId);
      return { restaurant, restaurantImages, status };
    } catch (error) {
      throw error;
    }
  }
  public async resetPasswordUpdateInteractor(
    userId: string,
    password: string
  ): Promise<{ message: string; status: boolean }> {
    if (!userId || !password) {
      return { message: MESSAGES.INVALID_FORMAT, status: false };
    }
    try {
      const { message, status } = await this.repository.resetPasswordUpdateRepo(
        userId,
        password
      );
      return { message, status };
    } catch (error) {
      throw error;
    }
  }
  public async updateUserProfileInteractor(
    userId: string,
    datas: UserType
  ): Promise<{ updatedUser: UserType | null; status: boolean }> {
    if (!userId) {
      return { updatedUser: null, status: false };
    }
    try {
      const result = await this.repository.updateUserProfileRepo(userId, datas);
      const { updatedUser, status } = result;
      return { updatedUser, status };
    } catch (error) {
      throw error;
    }
  }
  public async getBookingDataInteractor(
    userId: string
  ): Promise<{ bookingData: BookingDataType[] | null; status: boolean }> {
    if (!userId) {
      return { bookingData: null, status: false };
    }
    try {
      const result = await this.repository.getBookingDataRepo(userId);
      const { bookingData, status } = result;
      return { bookingData, status };
    } catch (error) {
      throw error;
    }
  }
  public async getBookingDetailedInteractor(
    bookingId: string
  ): Promise<{ bookingData: BookingDataType | null; status: boolean }> {
    if (!bookingId) {
      return { bookingData: null, status: false };
    }
    try {
      const result = await this.repository.getBookingDetailedRepo(bookingId);
      const { bookingData, status } = result;
      return { bookingData, status };
    } catch (error) {
      throw error;
    }
  }
  public async cancelBookingInteractor(
    bookingId: string
  ): Promise<{ bookingData: BookingDataType | null; status: boolean }> {
    if (!bookingId) {
      return { bookingData: null, status: false };
    }
    try {
      const result = await this.repository.cancelBookingRepo(bookingId);
      const { bookingData, status } = result;
      return { bookingData, status };
    } catch (error) {
      throw error;
    }
  }
  public async getUserWalletInteractor(
    userId: string
  ): Promise<{ wallet: WalletType | null; status: boolean }> {
    if (!userId) {
      return { wallet: null, status: false };
    }
    try {
      const result = await this.repository.getUserWalletRepo(userId);
      const { wallet, status } = result;
      return { wallet, status };
    } catch (error) {
      throw error;
    }
  }
  public async getCouponsInteractor(
    date: Date
  ): Promise<{ coupons: CouponType[] | null; status: boolean }> {
    if (!date) {
      return { coupons: null, status: false };
    }
    try {
      const result = await this.repository.getCouponsRepo(date);
      const { coupons, status } = result;
      return { coupons, status };
    } catch (error) {
      throw error;
    }
  }
  public async saveRestaurantInteractor(
    restaurantId: string,
    userId: string
  ): Promise<{
    message: string;
    status: boolean;
  }> {
    if (!userId || !restaurantId) {
      return { message: MESSAGES.INVALID_FORMAT, status: false };
    }
    try {
      const result = await this.repository.saveRestaurantRepo(
        restaurantId,
        userId
      );
      const { message, status } = result;
      return { message, status };
    } catch (error) {
      throw error;
    }
  }
  public async getSavedRestaurantInteractor(userId: string): Promise<{
    savedRestaurants: savedRestaurantType[] | null;
    status: boolean;
  }> {
    if (!userId) {
      return { savedRestaurants: null, status: false };
    }
    try {
      const result = await this.repository.getSavedRestaurantRepo(userId);
      const { savedRestaurants, status } = result;
      return { savedRestaurants, status };
    } catch (error) {
      throw error;
    }
  }
  public async getCheckSavedRestaurantInteractor(
    restaurantId: string,
    userId: string
  ): Promise<{ isBookmark: boolean; status: boolean }> {
    if (!userId || !restaurantId) {
      return { isBookmark: false, status: false };
    }
    try {
      const result = await this.repository.getCheckSavedRestaurantRepo(
        restaurantId,
        userId
      );
      const { isBookmark, status } = result;
      return { isBookmark, status };
    } catch (error) {
      throw error;
    }
  }
  public async addReviewInteractor(
    reviewDatas: ReviewType,
    userId: string
  ): Promise<{
    message: string;
    status: boolean;
  }> {
    const { rating, restaurantId, reviewText } = reviewDatas;
    if (!userId || !restaurantId || !rating || !reviewText) {
      return { status: false, message: MESSAGES.INVALID_FORMAT };
    }
    try {
      const result = await this.repository.addReviewRepo(reviewDatas, userId);
      const { message, status } = result;
      return { message, status };
    } catch (error) {
      throw error;
    }
  }
  public async getReviewsInteractor(restaurantId: string): Promise<{
    message: string;
    status: boolean;
    reviews: ReviewType[] | null;
  }> {
    if (!restaurantId) {
      return { reviews: null, status: false, message: MESSAGES.INVALID_FORMAT };
    }
    try {
      const result = await this.repository.getReviewsRepo(restaurantId);
      const { message, reviews, status } = result;
      return { message, reviews, status };
    } catch (error) {
      throw error;
    }
  }
  public async getReviewInteractor(
    restaurantId: string,
    userId: string
  ): Promise<{
    message: string;
    status: boolean;
    review: ReviewType | null;
  }> {
    if (!restaurantId || !userId) {
      return { review: null, status: false, message: MESSAGES.INVALID_FORMAT };
    }
    try {
      const result = await this.repository.getReviewRepo(restaurantId, userId);
      const { message, review, status } = result;
      return { message, review, status };
    } catch (error) {
      throw error;
    }
  }
  public async getRestaurantTableInteractor(
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
    if (!restaurantId || !tableSize || !slot || !selectedDate) {
      return {
        availableTables: null,
        status: false,
        message: MESSAGES.INVALID_FORMAT,
        totalTables: 0,
        tablesPerPage: 0,
      };
    }
    try {
      const result = await this.repository.getRestaurantTableRepo(
        restaurantId,
        tableSize,
        slot,
        selectedDate,
        page
      );
      const { message, availableTables, status, totalTables, tablesPerPage } =
        result;
      return { message, availableTables, status, totalTables, tablesPerPage };
    } catch (error) {
      throw error;
    }
  }
  public async createBookingInteractor(
    userId: string,
    bookingComfirmationDatas: BookingConfirmationType,
    totalCost: string
  ): Promise<{
    status: boolean;
    bookingId: string | null;
  }> {
    console.log(bookingComfirmationDatas);
    const { bookingTime, Date, paymentMethod, restaurantDatas, timeSlotId } =
      bookingComfirmationDatas;
    if (
      !userId ||
      !bookingTime ||
      !Date ||
      !paymentMethod ||
      !restaurantDatas ||
      !timeSlotId
    ) {
      return { status: false, bookingId: null };
    }
    try {
      const result = await this.repository.createBookingRepo(
        userId,
        bookingComfirmationDatas,
        totalCost
      );
      const { bookingId, status } = result;
      return { bookingId, status };
    } catch (error) {
      throw error;
    }
  }
  public async bookingStatusUpdationInteractor(
    bookingId: string,
    paymentStatus: string
  ): Promise<{
    status: boolean;
  }> {
    if (!bookingId || !paymentStatus) {
      return { status: false };
    }
    try {
      const result = await this.repository.bookingStatusUpdationRepo(
        bookingId,
        paymentStatus
      );
      const { status } = result;
      return { status };
    } catch (error) {
      throw error;
    }
  }
}
