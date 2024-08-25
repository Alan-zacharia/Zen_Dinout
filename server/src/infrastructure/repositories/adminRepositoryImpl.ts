import {
  CouponType,
  MemberShipType,
  UserType,
} from "../../domain/entities/UserType";
import { IAdminRepositories } from "../../domain/interface/repositories/IAdminRepositories";
import UserModel from "../database/model.ts/userModel";
import restaurantModel from "../database/model.ts/restaurantModel";
import { generateTokens } from "../utils/jwtUtils";
import { hashedPasswordCompare } from "../../domain/entities/auth";
import { MESSAGES, ROLES, SUCCESS_MESSAGES } from "../../configs/constants";
import { ObjectId } from "mongoose";
import { RestaurantType } from "../../domain/entities/RestaurantType";
import couponModel from "../database/model.ts/couponModel";
import membershipModel from "../database/model.ts/membershipModel";
import EmailService from "../lib/EmailService";

export class adminRepositoryImpl implements IAdminRepositories {
  public async adminLoginRepo(credentials: {
    email: string;
    password: string;
  }): Promise<{
    admin: UserType | null;
    message: string;
    token: string | null;
    refreshToken: string | null;
  }> {
    const { email, password } = credentials;
    try {
      const admin = await UserModel.findOne({ email });
      if (!admin || !admin.isAdmin) {
        return {
          admin: null,
          message: MESSAGES.ADMIN_DOESNOT_EXIST,
          token: null,
          refreshToken: null,
        };
      }
      const hashedPassword = await hashedPasswordCompare(
        password,
        admin.password
      );
      if (hashedPassword) {
        const { generatedAccessToken, generatedRefreshToken } = generateTokens(
          admin._id as string,
          ROLES.ADMIN
        );
        const { password, ...adminData } = admin.toObject();
        return {
          admin: adminData as UserType,
          message: SUCCESS_MESSAGES.LOGIN_SUCCESS,
          refreshToken: generatedRefreshToken,
          token: generatedAccessToken,
        };
      } else {
        return {
          admin: null,
          message: MESSAGES.INVALID_PASSWORD,
          token: null,
          refreshToken: null,
        };
      }
    } catch (error) {
      throw error;
    }
  }

  public async getUsersListRepo(pageNumber: number): Promise<{
    users: UserType[] | null;
    message: string;
    totalPages: number;
  }> {
    const itemsPerPage = 6;
    try {
      const users = await UserModel.find()
        .select("-password")
        .skip((pageNumber - 1) * itemsPerPage)
        .limit(itemsPerPage);
      const totalUsers = await UserModel.countDocuments();
      const totalPages = Math.ceil(totalUsers / itemsPerPage);
      const sanitizedUsers: UserType[] = users.map((user) => {
        return user.toObject();
      });
      return {
        users: sanitizedUsers,
        message: SUCCESS_MESSAGES.FETCHED_SUCCESSFULLY,
        totalPages,
      };
    } catch (error) {
      throw error;
    }
  }

  public async getApproveRestaurantListRepo(): Promise<{
    restaurants: RestaurantType[] | null;
    message: string;
  }> {
    try {
      const restaurants = await restaurantModel
        .find({ isApproved: false })
        .select("-password");
      const restauarntList: RestaurantType[] = restaurants.map((restaurant) => {
        return restaurant.toObject();
      });
      return {
        restaurants: restauarntList,
        message: SUCCESS_MESSAGES.FETCHED_SUCCESSFULLY,
      };
    } catch (error) {
      throw error;
    }
  }

  public async getRestaurantListRepo(pageNumber: number): Promise<{
    restaurants: RestaurantType[] | null;
    message: string;
    totalPages: number;
  }> {
    try {
      const totalPages = 1;
      const pageSize = 6;
      const skip = (pageNumber - 1) * pageSize;
      const restaurants = await restaurantModel
        .find({ isApproved: true })
        .skip(skip)
        .limit(pageSize)
        .select("-password");
      const restauarntList: RestaurantType[] = restaurants.map((restaurant) => {
        return restaurant.toObject();
      });
      return {
        restaurants: restauarntList,
        message: SUCCESS_MESSAGES.FETCHED_SUCCESSFULLY,
        totalPages,
      };
    } catch (error) {
      throw error;
    }
  }

  public async getApproveRestaurantRepo(
    restaurantId: string
  ): Promise<{ restaurant: RestaurantType | null; message: string }> {
    try {
      const restaurantDetails = await restaurantModel.findById(restaurantId);
      if (!restaurantDetails) {
        return {
          restaurant: null,
          message: MESSAGES.RESOURCE_NOT_FOUND,
        };
      }
      return {
        restaurant: restaurantDetails.toObject(),
        message: SUCCESS_MESSAGES.FETCHED_SUCCESSFULLY,
      };
    } catch (error) {
      throw error;
    }
  }

  public async userActionRepo(
    userId: string,
    action: string
  ): Promise<{ user: UserType | null; message: string }> {
    try {
      const isBlocked = action === "false";
      const user = await UserModel.findByIdAndUpdate(
        userId,
        { isBlocked },
        { new: true }
      );
      if (!user) {
        return { user: null, message: MESSAGES.RESOURCE_NOT_FOUND };
      }
      return {
        user: user.toObject(),
        message: SUCCESS_MESSAGES.UPDATED_SUCCESSFULLY,
      };
    } catch (error) {
      throw error;
    }
  }
  public async approveRestaurantRepo(
    restaurantId: string,
    action: string,
    rejectReason: string
  ): Promise<{ success: boolean; message: string }> {
    try {
      if (action === "reject") {
        const restaurant = await restaurantModel.findByIdAndDelete(
          restaurantId
        );
        if (!restaurant) {
          return { success: false, message: MESSAGES.RESOURCE_NOT_FOUND };
        }
        await EmailService.sendRestaurantRejectionEmail(
          restaurant?.email as string,
          rejectReason
        );
        return { success: true, message: SUCCESS_MESSAGES.RESTAURANT_REJECT };
      }
      const restaurant = await restaurantModel.findByIdAndUpdate(restaurantId, {
        isApproved: true,
      });
      if (!restaurant) {
        return { success: false, message: MESSAGES.RESOURCE_NOT_FOUND };
      }
      await EmailService.sendRestaurantConfrimationEmail(
        restaurant?.email as string
      );
      return { success: true, message: SUCCESS_MESSAGES.APPROVED_SUCCESS };
    } catch (error) {
      throw error;
    }
  }
  public async getCouponsRepo(): Promise<{
    message: string;
    Coupons: CouponType[];
  }> {
    try {
      const coupons = await couponModel.find({});
      const allCoupons: CouponType[] = coupons.map((coupon) => {
        return coupon.toObject();
      });
      return {
        Coupons: allCoupons,
        message: SUCCESS_MESSAGES.FETCHED_SUCCESSFULLY,
      };
    } catch (error) {
      throw error;
    }
  }
  public async getMembershipRepo(): Promise<{
    message: string;
    Memberships: MemberShipType[];
  }> {
    try {
      const memberships = await membershipModel.find({});
      const Memberships: MemberShipType[] = memberships.map((membership) => {
        return membership.toObject();
      });
      return {
        Memberships,
        message: SUCCESS_MESSAGES.FETCHED_SUCCESSFULLY,
      };
    } catch (error) {
      throw error;
    }
  }
  public async createCouponRepo(couponDetails: CouponType): Promise<{
    message: string;
    status: boolean;
  }> {
    const {
      couponCode,
      description,
      discount,
      discountPrice,
      expiryDate,
      minPurchase,
      startDate,
    } = couponDetails;
    try {
      const coupon = new couponModel({
        couponCode,
        description,
        discount,
        discountPrice,
        minPurchase,
        expiryDate,
        startDate,
      });
      await coupon.save();
      return {
        message: SUCCESS_MESSAGES.RESOURCE_CREATED,
        status: true,
      };
    } catch (error) {
      throw error;
    }
  }
  public async createMembershipInteractor(
    membershipData: MemberShipType
  ): Promise<{
    message: string;
    status: boolean;
  }> {
    const {
      planName,
      benefits,
      cost,
      description,
      discount,
      expiryDate,
      type,
    } = membershipData;
    try {
      const membership = new membershipModel({
        planName,
        description,
        discount,
        benefits,
        expiryDate,
        type,
      });
      await membership.save();
      return {
        message: SUCCESS_MESSAGES.RESOURCE_CREATED,
        status: true,
      };
    } catch (error) {
      throw error;
    }
  }
  public async removeCouponRepo(couponId: string): Promise<{
    message: string;
    status: boolean;
  }> {
    try {
      const coupon = await couponModel.findByIdAndDelete(couponId);
      if (!coupon) {
        return { status: false, message: MESSAGES.RESOURCE_NOT_FOUND };
      }
      return {
        status: true,
        message: SUCCESS_MESSAGES.REMOVED_SUCCESS,
      };
    } catch (error) {
      throw error;
    }
  }
  
}
