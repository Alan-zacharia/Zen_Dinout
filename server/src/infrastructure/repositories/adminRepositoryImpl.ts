import { UserType } from "../../domain/entities/User";
import { IAdminRepositories } from "../../domain/interface/repositories/IAdminRepositories";
import UserModel from "../database/model.ts/userModel";
import bcrypt from "bcryptjs";
import restaurantModel from "../database/model.ts/restaurantModel";
import nodeMailerRejectionEmail from "../../functions/mailer/nodeMailerRejectionEmail";
import nodeMailerConfirmationEmail from "../../functions/mailer/nodeMailerConfirmationEmail";
import {
  jwtGenerateRefreshToken,
  jwtGenerateToken,
} from "../../functions/auth/jwtTokenFunctions";

export class adminRepositoryImpl implements IAdminRepositories {
  async loginAdminRepo(credentials: {
    email: string;
    password: string;
  }): Promise<{
    admin: UserType | null;
    message: string;
    token: string | null;
    refreshToken: string | null;
  }> {
    try {
      const admin = await UserModel.findOne({ email: credentials.email });
      console.log(admin)
      let token = null;
      let refreshToken = null;
      if (!admin || !admin.isAdmin) {
        return {
          admin: null,
          message: "Admin doesn't exist",
          token,
          refreshToken,
        };
      } else {
        const passwordMatch = await bcrypt.compare(
          credentials.password,
          admin.password
        );
        console.log(passwordMatch)
        if (passwordMatch) {
          if (admin) {
            token = jwtGenerateToken(admin._id as string, "admin");
            refreshToken = jwtGenerateRefreshToken(admin._id as string);
          }
          return { admin, message: "Login Successful", token, refreshToken };
        } else {
          return {
            admin : null,
            message: "Password is incorrect",
            token,
            refreshToken,
          };
        }
      }
    } catch (error: any) {
      console.log("Error in admin login repo : ", error);
      throw error;
    }
  }
  async getUsersList(): Promise<{ users: object | null; message: string }> {
    try {
      console.log("Get USer Repo");
      const users = await UserModel.find({ isVerified: true });
      return { users, message: "Users list Successfull" };
    } catch (error) {
      console.log("Error in get user repo : ", error);
      throw error;
    }
  }
  async getRestaurantsList(): Promise<{
    restaurants: object | null;
    message: string;
  }> {
    try {
      const restaurants = await restaurantModel.find({ isApproved: true });
      return { restaurants, message: "restaurant list Successfull" };
    } catch (error) {
      console.log("Error in get restaurant repo : ", error);
      throw error;
    }
  }
  async approve(): Promise<{
    restaurants: object | null;
    message: string;
  }> {
    console.log("hhhhhhh");
    try {
      const restaurants = await restaurantModel.find({ isApproved: false });
      console.log(restaurants);
      return { restaurants, message: "restaurant list Successfull" };
    } catch (error) {
      console.log("Error in get restaurant approve repo : ", error);
      throw error;
    }
  }

  async userBlockUnblock(
    id: string,
    block: string
  ): Promise<{ users: UserType | null; message: string }> {
    try {
      let user;
      if (block == "false") {
        user = await UserModel.findByIdAndUpdate(
          id,
          { isBlocked: true },
          { new: true }
        );
      } else {
        user = await UserModel.findByIdAndUpdate(
          id,
          { isBlocked: false },
          { new: true }
        );
      }
      return { users: user, message: "user actions successfull" };
    } catch (error) {
      console.log("Error in get restaurant actions repo : ", error);
      throw error;
    }
  }

  async getapprovalRestaurant(
    restaurantId: string
  ): Promise<{ restaurants: object | null; message: string }> {
    try {
      const restaurantDetails = await restaurantModel.findById(restaurantId);
      console.log(restaurantDetails);
      return {
        restaurants: restaurantDetails,
        message: "Restaurant details......",
      };
    } catch (error) {
      console.log(
        "Oops an error occurred in getapprovalRestaurant repository",
        error
      );
      throw error;
    }
  }
  async confirmRestaurant(
    restaurantId: string,
    logic: string,
    rejectReason: string
  ): Promise<{ success: boolean; message: string }> {
    try {
      console.log(logic);
      if (logic == "reject") {
        const restaurant = await restaurantModel.findByIdAndDelete(
          restaurantId
        );
        console.log(restaurant);
        nodeMailerRejectionEmail(restaurant?.email as string, rejectReason);
        console.log("hjhjhjhjhj");
        return { success: true, message: "Success" };
      }
      const restaurant = await restaurantModel.findByIdAndUpdate(restaurantId, {
        isApproved: true,
      });
      console.log(restaurant);
      nodeMailerConfirmationEmail(restaurant?.email as string);
      return { success: true, message: "Success" };
    } catch (error) {
      console.log("OOps an error occured in comfirmation ", error);
      throw error;
    }
  }
}
