import {
  BookingConfirmationType,
  BookingDataType,
  CouponType,
  MemberShipType,
  ReviewType,
  savedRestaurantType,
  UserType,
  WalletType,
} from "../../entities/UserType";
import {
  MenuType,
  RestaurantType,
  TableDataType,
  TimeSlotType,
} from "../../entities/RestaurantType";
import { Session } from "inspector";

export interface IUserRepository {
  registerUserRepo(
    user: UserType
  ): Promise<{ user: UserType | null; message: string }>;
  loginUserRepo(
    email: string,
    password: string
  ): Promise<{
    user: UserType | null;
    message: string;
    token: string | null;
    refreshToken: string | null;
  }>;
  googleLoginRepo(credentials: UserType): Promise<{
    message: string;
    user: UserType | null;
    token: string | null;
    refreshToken: string | null;
  }>;
  generateOtpRepo(email: string): Promise<{ message: string; otp: number }>;
  resetPasswordRequestRepo(
    email: string
  ): Promise<{ message: string; success: boolean }>;
  getProfileRepo(
    _id: string
  ): Promise<{ userDetails: UserType | null; status: boolean }>;
  getListedRestuarantRepo(): Promise<{ listedRestaurants: RestaurantType[] }>;
  getRestaurantDetailedViewRepo(restaurantId: string): Promise<{
    restaurant: RestaurantType | null;
    restaurantImages: string[] | null;
    status: boolean;
  }>;
  resetPasswordUpdateRepo(
    userId: string,
    password: string
  ): Promise<{ message: string; status: boolean }>;
  updateUserProfileRepo(
    userId: string,
    datas: UserType
  ): Promise<{ updatedUser: UserType | null; status: boolean }>;
  getBookingDataRepo(
    userId: string
  ): Promise<{ bookingData: BookingDataType[] | null; status: boolean }>;
  getBookingDetailedRepo(
    bookingId: string
  ): Promise<{ bookingData: BookingDataType | null; status: boolean }>;
  cancelBookingRepo(
    bookingId: string
  ): Promise<{ bookingData: BookingDataType | null; status: boolean }>;
  getUserWalletRepo(
    userId: string
  ): Promise<{ wallet: WalletType | null; status: boolean }>;
  getCouponsRepo(
    date: Date
  ): Promise<{ coupons: CouponType[] | null; status: boolean }>;
  getSavedRestaurantRepo(userId: string): Promise<{
    savedRestaurants: savedRestaurantType[] | null;
    status: boolean;
  }>;
  getCheckSavedRestaurantRepo(
    restaurantId: string,
    userId: string
  ): Promise<{ isBookmark: boolean; status: boolean }>;
  getTimeSlotRepo(
    restaurantId: string,
    date: string
  ): Promise<{ TimeSlots: TimeSlotType[] | null; status: boolean }>;
  saveRestaurantRepo(
    restaurantId: string,
    userId: string
  ): Promise<{ message: string; status: boolean }>;
  addReviewRepo(
    reviewDatas: ReviewType,
    userId: string
  ): Promise<{
    message: string;
    status: boolean;
  }>;
  getReviewsRepo(restaurantId: string): Promise<{
    message: string;
    status: boolean;
    reviews: ReviewType[] | null;
  }>;
  getMenuRepo(restaurantId: string): Promise<{
    message: string;
    status: boolean;
    menu: MenuType | null;
  }>;
  getReviewRepo(
    restaurantId: string,
    userId: string
  ): Promise<{
    message: string;
    status: boolean;
    review: ReviewType | null;
  }>;
  getRestaurantTableRepo(
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
  }>;
  createBookingRepo(
    userId: string,
    bookingComfirmationDatas: BookingConfirmationType,
    totalCost: string
  ): Promise<{ status: boolean; bookingId: string | null }>;
  createBookingUsingWalletRepo(
    userId: string,
    bookingComfirmationDatas: BookingConfirmationType,
    totalCost: string
  ): Promise<{ status: boolean; bookingId: string | null }>;
  bookingStatusUpdationRepo(
    bookingId: string,
    paymentStatus: string
  ): Promise<{ status: boolean }>;
  createMembershipPaymentRepo(
    userId: string,
    membershipId: string
  ): Promise<{ status: boolean; sessionId: string | null }>;
  getMembershipRepo(userId: string): Promise<{
    status: boolean;
    memberships: MemberShipType[] | null;
    existingMembership: MemberShipType | null;
  }>;
  cancelMembershipRepo(
    userId: string,
    membershipId: string
  ): Promise<{
    status: boolean;
    message: string;
  }>;
  applyCouponRepo(
    couponCode: string,
    minPurchase: string,
    todayDate: Date
  ): Promise<{
    status: boolean;
    message: string;
    coupon: CouponType | null;
  }>;
}
