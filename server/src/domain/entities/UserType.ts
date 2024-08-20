export interface UserType {
  _id?: string;
  username: string;
  email: string;
  password?: string;
  role?: string;
  isBlocked: boolean;
  isAdmin: boolean;
}

export interface CouponType {
  _id: string;
  couponcode: string;
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
