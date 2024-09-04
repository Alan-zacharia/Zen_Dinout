import { MESSAGES } from "../../configs/constants";
import { RestaurantType } from "../../domain/entities/RestaurantType";
import {
  CouponType,
  MemberShipType,
  UserType,
} from "../../domain/entities/UserType";
import { IAdminRepositories } from "../../domain/interface/repositories/IAdminRepositories";
import { IAdminInteractor } from "../../domain/interface/use-cases/IAdminInteractor";

export class adminInteractorImpl implements IAdminInteractor {
  constructor(private readonly repository: IAdminRepositories) {}

  public async adminLoginInteractor(credentials: {
    email: string;
    password: string;
  }): Promise<{
    message: string;
    token: string | null;
    admin: UserType | null;
    refreshToken: string | null;
  }> {
    const { email, password } = credentials;
    if (!password || !email) {
      return {
        message: MESSAGES.INVALID_DATA,
        admin: null,
        refreshToken: null,
        token: null,
      };
    }
    try {
      const result = await this.repository.adminLoginRepo(credentials);
      const { admin, message, refreshToken, token } = result;
      return { admin, message, token, refreshToken };
    } catch (error) {
      throw error;
    }
  }

  public async getUserListInteractor(pageNumber: number): Promise<{
    users: UserType[] | null;
    message: string;
    totalPages: number;
  }> {
    try {
      const result = await this.repository.getUsersListRepo(pageNumber);
      const { message, users, totalPages } = result;
      return { users, message, totalPages };
    } catch (error) {
      throw error;
    }
  }
  public async getDashboardDetailsInteractor(): Promise<{
    restaurantCount: number;
    userCount: number;
    totalAmount: string;
    status: boolean;
    salesData: number[];
    revenueData: number[];
    users: UserType[];
    restaurants: object[];
  }> {
    try {
      const result = await this.repository.getDashboardDetailsRepo();
      const {
        restaurantCount,
        totalAmount,
        userCount,
        status,
        revenueData,
        salesData,
        restaurants,
        users,
      } = result;
      return {
        restaurantCount,
        totalAmount,
        userCount,
        status,
        revenueData,
        salesData,
        restaurants,
        users,
      };
    } catch (error) {
      throw error;
    }
  }

  public async getApproveRestaurantListInteractor(): Promise<{
    restaurants: RestaurantType[] | null;
    message: string;
  }> {
    try {
      const result = await this.repository.getApproveRestaurantListRepo();
      const { message, restaurants } = result;
      return { restaurants, message };
    } catch (error) {
      throw error;
    }
  }

  public async getRestaurantListInteractor(pageNumber: number): Promise<{
    restaurants: RestaurantType[] | null;
    message: string;
    totalPages: number;
  }> {
    try {
      const result = await this.repository.getRestaurantListRepo(pageNumber);
      const { message, restaurants, totalPages } = result;
      return { restaurants, message, totalPages };
    } catch (error) {
      throw error;
    }
  }

  public async getApproveRestaurantInteractor(
    restaurantId: string
  ): Promise<{ restaurant: RestaurantType | null; message: string }> {
    if (!restaurantId) {
      return { restaurant: null, message: MESSAGES.INVALID_FORMAT };
    }
    try {
      const result = await this.repository.getApproveRestaurantRepo(
        restaurantId
      );
      const { message, restaurant } = result;
      return { restaurant, message };
    } catch (error) {
      throw error;
    }
  }

  public async userActionInteractor(
    userId: string,
    action: string
  ): Promise<{ user: UserType | null; message: string }> {
    if (!userId || !action) {
      return { user: null, message: MESSAGES.INVALID_FORMAT };
    }
    try {
      const result = await this.repository.userActionRepo(userId, action);
      const { message, user } = result;
      return { user, message };
    } catch (error) {
      throw error;
    }
  }
  public async approveRestaurantInteractor(
    restaurantId: string,
    logic: string,
    rejectReason: string
  ): Promise<{ success: boolean; message: string }> {
    if (!restaurantId) {
      return { success: false, message: MESSAGES.INVALID_DATA };
    }
    try {
      const result = await this.repository.approveRestaurantRepo(
        restaurantId,
        logic,
        rejectReason
      );
      const { message, success } = result;
      return { message, success };
    } catch (error) {
      throw error;
    }
  }
  public async getCouponsInteractor(): Promise<{
    message: string;
    Coupons: CouponType[];
  }> {
    try {
      const result = await this.repository.getCouponsRepo();
      const { message, Coupons } = result;
      return { message, Coupons };
    } catch (error) {
      throw error;
    }
  }
  public async getMembershipInteractor(): Promise<{
    message: string;
    Memberships: MemberShipType[];
  }> {
    try {
      const result = await this.repository.getMembershipRepo();
      const { message, Memberships } = result;
      return { message, Memberships };
    } catch (error) {
      throw error;
    }
  }
  public async createCouponInteractor(couponDetails: CouponType): Promise<{
    message: string;
    status: boolean;
  }> {
    const {
      couponCode,
      description,
      discount,
      discountPrice,
      minPurchase,
      startDate,
      expiryDate,
    } = couponDetails;
    if (
      !couponCode ||
      !description ||
      !discount ||
      !discountPrice ||
      !minPurchase ||
      !startDate ||
      !expiryDate
    ) {
      return { message: MESSAGES.INVALID_DATA, status: false };
    }
    try {
      const result = await this.repository.createCouponRepo(couponDetails);
      const { message, status } = result;
      return { message, status };
    } catch (error) {
      throw error;
    }
  }
  public async createMembershipInteractor(
    memebershipData: MemberShipType
  ): Promise<{
    message: string;
    status: boolean;
  }> {
    const {
      planName,
      benefits,
      cost,
      type,
      description,
      discount,
      expiryDate,
    } = memebershipData;
    if (
      !planName ||
      !benefits ||
      !cost ||
      !type ||
      !description ||
      !discount ||
      !expiryDate
    ) {
      return { message: MESSAGES.INVALID_DATA, status: false };
    }
    try {
      const result = await this.repository.createMembershipRepo(
        memebershipData
      );
      const { message, status } = result;
      return { message, status };
    } catch (error) {
      throw error;
    }
  }
  public async updateMembershipInteractor(
    updatedMembership: MemberShipType
  ): Promise<{
    message: string;
    Membership: MemberShipType | null;
  }> {
    if (
      !updatedMembership ||
      !updatedMembership.cost ||
      !updatedMembership.planName
    ) {
      return { message: MESSAGES.INVALID_DATA, Membership: null };
    }
    try {
      const result = await this.repository.updateMembershipRepo(
        updatedMembership
      );
      const { message, Membership } = result;
      return { message, Membership };
    } catch (error) {
      throw error;
    }
  }

  public async removeMembershipInteractor(membershipId: string): Promise<{
    message: string;
    status: boolean;
  }> {
    if (!membershipId) {
      return { message: MESSAGES.INVALID_FORMAT, status: false };
    }
    try {
      const result = await this.repository.removeMembershipRepo(membershipId);
      const { message, status } = result;
      return { message, status };
    } catch (error) {
      throw error;
    }
  }
  public async updateCouponInteractor(couponId: string , couponDatas : CouponType): Promise<{
    message: string;
    status: boolean;
  }> {
    
    if (!couponId || !couponDatas || !couponDatas.couponCode) {
      return { message: MESSAGES.INVALID_FORMAT, status: false };
    }
    try {
      const result = await this.repository.updateCouponRepo(couponId , couponDatas);
      const { message, status } = result;
      return { message, status };
    } catch (error) {
      throw error;
    }
  }
  public async removeCouponInteractor(couponId: string): Promise<{
    message: string;
    status: boolean;
  }> {
    if (!couponId) {
      return { message: MESSAGES.INVALID_FORMAT, status: false };
    }
    try {
      const result = await this.repository.removeCouponRepo(couponId);
      const { message, status } = result;
      return { message, status };
    } catch (error) {
      throw error;
    }
  }
}
