import { RestaurantType } from "../../entities/RestaurantType";
import { CouponType, MemberShipType, UserType } from "../../entities/UserType";

export interface IAdminInteractor {
  adminLoginInteractor(credentials: {
    email: string;
    password: string;
  }): Promise<{
    message: string;
    token: string | null;
    admin: UserType | null;
    refreshToken: string | null;
  }>;
  getUserListInteractor(
    pageNumber: number
  ): Promise<{ users: UserType[] | null; message: string; totalPages: number }>;
  getApproveRestaurantListInteractor(): Promise<{
    restaurants: RestaurantType[] | null;
    message: string;
  }>;
  getRestaurantListInteractor(pageNumber: number): Promise<{
    restaurants: RestaurantType[] | null;
    message: string;
    totalPages: number;
  }>;
  getApproveRestaurantInteractor(
    restaurantId: string
  ): Promise<{ restaurant: RestaurantType | null; message: string }>;
  userActionInteractor(
    userId: string,
    action: string
  ): Promise<{ user: UserType | null; message: string }>;
  approveRestaurantInteractor(
    restaurantId: string,
    login: string,
    rejectReason: string
  ): Promise<{ success: boolean; message: string }>;
  getCouponsInteractor(): Promise<{ message: string; Coupons: CouponType[] }>;
  getDashboardDetailsInteractor(): Promise<{
    restaurantCount: number;
    userCount: number;
    totalAmount: string;
    status: boolean;
    salesData: number[];
    revenueData: number[];
    users: UserType[];
    restaurants: object[];
  }>;
  getMembershipInteractor(): Promise<{
    message: string;
    Memberships: MemberShipType[];
  }>;
  updateMembershipInteractor(updatedMembership: MemberShipType): Promise<{
    message: string;
    Membership: MemberShipType | null;
  }>;
  createCouponInteractor(couponDetails: CouponType): Promise<{
    message: string;
    status: boolean;
  }>;
  createMembershipInteractor(memebershipData: MemberShipType): Promise<{
    message: string;
    status: boolean;
  }>;
  removeMembershipInteractor(membershipId: string): Promise<{
    message: string;
    status: boolean;
  }>;
  updateCouponInteractor(
    couponId: string,
    couponDatas: CouponType
  ): Promise<{
    message: string;
    status: boolean;
  }>;
  removeCouponInteractor(couponId: string): Promise<{
    message: string;
    status: boolean;
  }>;
}
