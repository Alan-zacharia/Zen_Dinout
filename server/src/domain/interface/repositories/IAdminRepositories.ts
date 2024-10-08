import { RestaurantType } from "../../entities/RestaurantType";
import { CouponType, MemberShipType, UserType } from "../../entities/UserType";

export interface IAdminRepositories {
  adminLoginRepo(credentials: { email: string; password: string }): Promise<{
    admin: UserType | null;
    message: string;
    refreshToken: string | null;
    token: string | null;
  }>;
  getUsersListRepo(pageNumber: number): Promise<{
    users: UserType[] | null;
    message: string;
    totalPages: number;
  }>;
  getApproveRestaurantListRepo(): Promise<{
    restaurants: RestaurantType[] | null;
    message: string;
  }>;
  getRestaurantListRepo(pageNumber: number): Promise<{
    restaurants: RestaurantType[] | null;
    message: string;
    totalPages: number;
  }>;
  getApproveRestaurantRepo(
    restaurantId: string
  ): Promise<{ restaurant: RestaurantType | null; message: string }>;
  userActionRepo(
    userId: string,
    action: string
  ): Promise<{ user: UserType | null; message: string }>;
  approveRestaurantRepo(
    restaurantId: string,
    logic: string,
    rejectReason: string
  ): Promise<{ success: boolean; message: string }>;
  getCouponsRepo(): Promise<{ message: string; Coupons: CouponType[] }>;
  getDashboardDetailsRepo(): Promise<{
    restaurantCount : number;
    userCount : number;
    totalAmount: string;
    status: boolean;
    salesData : number[],
    revenueData : number[],
    users: UserType[];
    restaurants: object[];
  }>;
  getMembershipRepo(): Promise<{
    message: string;
    Memberships: MemberShipType[];
  }>;
  createCouponRepo(couponDetails: CouponType): Promise<{
    message: string;
    status: boolean;
  }>;
  createMembershipRepo(memeberships: MemberShipType): Promise<{
    message: string;
    status: boolean;
  }>;
  updateMembershipRepo(updatedMembership: MemberShipType): Promise<{
    message: string;
    Membership: MemberShipType | null;
  }>;
  removeCouponRepo(couponId: string): Promise<{
    message: string;
    status: boolean;
  }>;
  updateCouponRepo(couponId: string , couponDatas : CouponType): Promise<{
    message: string;
    status: boolean;
  }>;
  removeMembershipRepo(membershipId: string): Promise<{
    message: string;
    status: boolean;
  }>;
}
