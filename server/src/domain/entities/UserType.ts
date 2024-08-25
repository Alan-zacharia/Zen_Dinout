import { RestaurantType } from "./RestaurantType";

export interface UserType {
  _id?: string;
  username: string;
  email: string;
  password?: string;
  role?: string;
  isBlocked: boolean;
  isAdmin: boolean;
  phone: string;
}

export interface CouponType {
  _id: string;
  couponCode: string;
  description: string;
  minPurchase: number;
  discount: number;
  discountPrice: number;
  startDate: string;
  expiryDate: string;
  isActive: boolean;
}
export interface MemberShipType {
  _id: string;
  planName: string;
  description?: string;
  type: string;
  cost: number;
  benefits: { [key: string]: string[] };
  users: number;
  discount?: number;
  expiryDate?: Date;
}

export interface BookingDataType {
  bookingId: string;
  table: string;
  bookingDate: Date;
  bookingTime: string;
  paymentMethod: "Online" | "Wallet";
  paymentStatus: "PAID" | "PENDING" | "FAILED" | "REFUNDED";
  bookingStatus:
    | "PENDING"
    | "CONFIRMED"
    | "COMPLETED"
    | "CANCELLED"
    | "CHECKED";
  totalAmount: number;
  userId: string;
  restaurantId: string;
}

export interface WalletType {
  _id: string;
  userId: string;
  balance: string;
  transaction: TransactionType[];
}

export interface TransactionType {
  amount: string;
  type: "credit" | "debit";
  description: string;
  _id: string;
  date: string;
}

export interface savedRestaurantType {
  restaurantId: string;
  userId: string;
}
export interface ReviewType {
  _id: string;
  userId: string;
  restaurantId: string;
  reviewText: string;
  rating: number;
}

export interface BookingConfirmationType {
  restaurantDatas: {
    restaurantId: string;
    price: string;
    Capacity: number;
    table: string;
    subTotal: string;
  };
  paymentMethod: string;
  bookingTime: string;
  Date: string;
  timeSlotId: string;
}
