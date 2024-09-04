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

export interface IUserInteractor {
  registerUserInteractor(
    data: UserType
  ): Promise<{ user: UserType | null; message: string }>;
  loginUserInteractor(credentials: {
    email: string;
    password: string;
  }): Promise<{
    user: UserType | null;
    message: string;
    token: string | null;
    refreshToken: string | null;
  }>;
  googleLoginInteractor(credentials: UserType): Promise<{
    message: string;
    user: UserType | null;
    token: string | null;
    refreshToken: string | null;
  }>;
  generateOtpInteractor(
    email: string
  ): Promise<{ message: string; otp: number | null }>;
  resetPasswordRequestInteractor(
    email: string
  ): Promise<{ message: string; success: boolean }>;
  getProfileInteractor(
    userId: string
  ): Promise<{ userDetails: UserType | null; status: boolean }>;
  getListedRestuarantInteractor(): Promise<{
    listedRestaurants: RestaurantType[];
  }>;
  getRestaurantDetailedViewInteractor(restaurantId: string): Promise<{
    restaurant: RestaurantType | null;
    restaurantImages: string[] | null;
    status: boolean;
  }>;
  resetPasswordUpdateInteractor(
    userId: string,
    password: string
  ): Promise<{ message: string; status: boolean }>;
  updateUserProfileInteractor(
    userId: string,
    datas: UserType
  ): Promise<{ updatedUser: UserType | null; status: boolean }>;
  getBookingDataInteractor(
    userId: string
  ): Promise<{ bookingData: BookingDataType[] | null; status: boolean }>;
  getBookingDetailedInteractor(
    bookingId: string
  ): Promise<{ bookingData: BookingDataType | null; status: boolean }>;
  cancelBookingInteractor(
    bookingId: string
  ): Promise<{ bookingData: BookingDataType | null; status: boolean }>;
  getUserWalletInteractor(
    userId: string
  ): Promise<{ wallet: WalletType | null; status: boolean }>;
  getCouponsInteractor(
    date: Date
  ): Promise<{ coupons: CouponType[] | null; status: boolean }>;
  saveRestaurantInteractor(
    restaurantId: string,
    userId: string
  ): Promise<{ message: string; status: boolean }>;
  getSavedRestaurantInteractor(userId: string): Promise<{
    savedRestaurants: savedRestaurantType[] | null;
    status: boolean;
  }>;
  getCheckSavedRestaurantInteractor(
    restaurantId: string,
    userId: string
  ): Promise<{ isBookmark: boolean; status: boolean }>;
  addReviewInteractor(
    reviewDatas: ReviewType,
    userId: string
  ): Promise<{ message: string; status: boolean }>;
  getReviewsInteractor(restaurantId: string): Promise<{
    message: string;
    status: boolean;
    reviews: ReviewType[] | null;
  }>;
  getMenuInteractor(restaurantId: string): Promise<{
    message: string;
    status: boolean;
    menu: MenuType | null;
  }>;
  getReviewInteractor(
    restaurantId: string,
    userId: string
  ): Promise<{ message: string; status: boolean; review: ReviewType | null }>;
  getRestaurantTableInteractor(
    restaurantId: string,
    tableSize: number,
    slot: string,
    selectedDate: string,
    page: number | null
  ): Promise<{
    availableTables: TableDataType[] | null;
    status: boolean;
    message: string;
    totalTables: number;
    tablesPerPage: number;
  }>;
  getRestaurantTableInteractor(
    restaurantId: string,
    tableSize: number,
    slot: string,
    selectedDate: string,
    page: number | null
  ): Promise<{
    availableTables: TableDataType[] | null;
    status: boolean;
    message: string;
    totalTables: number;
    tablesPerPage: number;
  }>;
  getTimeSlotInteractor(
    restaurantId: string,
    date: string
  ): Promise<{ TimeSlots: TimeSlotType[] | null; status: boolean }>;
  createBookingInteractor(
    userId: string,
    bookingComfirmationDatas: BookingConfirmationType,
    totalCost: string
  ): Promise<{ status: boolean; bookingId: string | null ; bookingUsingWallet : boolean;}>;
  bookingStatusUpdationInteractor(
    bookingId: string,
    paymentStatus: string
  ): Promise<{ status: boolean }>;
  createMembershipPaymentInteractor(
    userId: string,
    membershipId: string
  ): Promise<{ status: boolean; sessionId: string | null }>;
  getMembershipInteractor(
    userId: string
  ): Promise<{
    status: boolean;
    memberships: MemberShipType[] | null;
    existingMembership: MemberShipType | null;
  }>;
  cancelMembershipIntearctor(
    userId: string,
    membershipId: string
  ): Promise<{
    status: boolean;
    message : string
  }>;
  applyCouponInteractor(
    couponCode: string,
    minPurchase: string,
    todayDate: Date
  ): Promise<{
    status: boolean;
    message: string;
    coupon: CouponType | null;
  }>;
}
 