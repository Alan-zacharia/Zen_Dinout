import { UserType } from "../../domain/entities/User";
import { IUserRepository } from "../../domain/interface/repositories/IUserRepository";
import {
  jwtGenerateRefreshToken,
  jwtGenerateToken,
} from "../../functions/auth/jwtTokenFunctions";
import userModel from "../database/model.ts/userModel";
import { otpGenerator } from "../../functions/OtpSetup";
import nodemailerCreateOtp from "../../functions/MailerGenrator";
import reset_PasswordMailer from "../../functions/resetPasswordEmail";
import logger from "../lib/Wintson";
import {
  hashedPasswordCompare,
  hashedPasswordFunction,
} from "../../functions/bcryptFunctions";
import { RestaurantType } from "../../domain/entities/restaurants";
import restaurantModel from "../database/model.ts/restaurantModel";

export class userRepositoryImpl implements IUserRepository {
  async findByCredentials(
    email: string,
    password: string
  ): Promise<{
    user: UserType | null;
    message: string;
    token: string | null;
    refreshToken: string | null;
  }> {
    console.log("User Login repo ..........");
    try {
      const user = await userModel.findOne({ email: email });
      let token = null,
        refreshToken = null,
        message = "";
      if (!user) {
        message = "User not found";
      } else {
        if (user.isVerified) {
          const hashedPassword = await hashedPasswordCompare(
            password,
            user.password
          );
          if (!hashedPassword) {
            console.log("password is not match");
            message = "Invalid password";
          } else {
            token = jwtGenerateToken(user._id as string, user.role as string);
            refreshToken = jwtGenerateRefreshToken(user._id as string);
            console.log(token);
          }
        } else {
          message = "User Not Found";
        }
      }
      if (user && !message)
        return {
          user: user,
          message: "Login Successfull",
          token,
          refreshToken,
        };
      return { user: null, message, token, refreshToken };
    } catch (error) {
      logger.error("Oops error in User Login Repo.... ", error);
      throw error;
    }
  }

  async userCreate(
    user: UserType
  ): Promise<{ user: UserType | null; message: string }> {
    console.log("User creation repository..................");
    try {
      const { username, email, password } = user;
      const newUser = new userModel({
        username,
        email,
        password,
      });
      await newUser.save();
      return {
        user: newUser as UserType,
        message: "User created successfully",
      };
    } catch (error) {
      logger.error("Error in create repository ", error);
      throw error;
    }
  }

  async generateOtp(email: string): Promise<{ message: string; otp: number }> {
    console.log("Generate Otp ..........");
    try {
      const otp = otpGenerator.generateOtp();
      await nodemailerCreateOtp(email, otp);
      logger.info(`Otp : ${otp}`);
      return { message: "Otp Sended successfully", otp };
    } catch (error) {
      logger.error("Error in generate otp... : ", error);
      throw error;
    }
  }

  async resetPassword(
    email: string
  ): Promise<{ message: string; success: boolean }> {
    console.log("Reset password repository.......");
    try {
      const user = await userModel.findOne({ email });
      if (!user) {
        logger.error("User not found.....");
        return { message: "User not found", success: false };
      }
      reset_PasswordMailer(user.email, user._id as string);
      return { message: "User exists", success: true };
    } catch (error) {
      logger.error("Oops error in reset-password Repo.... ", error);
      throw error;
    }
  }

  async resetPasswordConfirm(
    id: string,
    password: string
  ): Promise<{ message: string; status: boolean }> {
    try {
      console.log("Confirm reset password.........", id);
      const { hashedPassword } = await hashedPasswordFunction(password);
      const user = await userModel.findByIdAndUpdate(id, {
        password: hashedPassword,
      });
      if (!user) {
        logger.error("Failed to update password");
        return { message: "Something went wrong", status: false };
      }
      return { message: "Successfully reseted", status: true };
    } catch (error) {
      logger.error("Oops an error occured in Reset password repo : ", error);
      throw error;
    }
  }

  async googleCredentialsCreate(credentials: {
    email: string;
    password: string;
    username: string;
  }): Promise<{
    message: string;
    user: UserType;
    token: string;
    refreshToken: string;
  }> {
    console.log("Repository Google Creation....");
    try {
      const user = new userModel({
        username: credentials.username,
        email: credentials.email,
        password: credentials.password,
      });
      await user.save();
      console.log(user);
      let token = jwtGenerateToken(user._id as string, user.role);
      let refreshToken = jwtGenerateRefreshToken(user._id as string);
      return {
        user,
        message: "User Created Successfully",
        token,
        refreshToken,
      };
    } catch (error) {
      logger.error("Oops an error occured in google creation repo : ", error);
      throw error;
    }
  }

  async getListedRestaurants(): Promise<{
    listedRestaurants: RestaurantType[];
  }> {
    try {
      const listedRestaurants: RestaurantType[] =
        await restaurantModel.aggregate([
          { $match: { isApproved: true } },
          {
            $match: {
              $and: [
                { featuredImage: { $exists: true } },
                { address: { $exists: true } },
              ],
            },
          },
          { $sort: { createdAt: -1 } },
        ]);
      return { listedRestaurants: listedRestaurants };
    } catch (error) {
      logger.error("Oops an error occured in get listed restaurants : ", error);
      throw error;
    }
  }
  async getProfileDetails(
    _id: string
  ): Promise<{ userDetails: UserType | null; status: boolean }> {
    try {
      console.log(_id);
      const userDetails = await userModel.findById(_id).select("-paasword");
      if (!userDetails) {
        return { status: false, userDetails: null };
      }
      return { status: true, userDetails: userDetails };
    } catch (error) {
      logger.error("OOps an error in getProfile repo....", error);
      throw error;
    }
  }
  async updateUser(
    _id: string,
    datas: UserType
  ): Promise<{ updatedUser: UserType | null; status: boolean }> {
    try {
      console.log(_id);
      const updatedUser = await userModel.findByIdAndUpdate(
        _id,
        {
          username: datas.username,
          phone: datas.phone,
        },
        { upsert: true, new: true }
      );
      if (!updatedUser) {
        return { status: false, updatedUser: null };
      }
      return { status: true, updatedUser };
    } catch (error) {
      logger.error("OOps an error in update User repo....", error);
      throw error;
    }
  }
}
