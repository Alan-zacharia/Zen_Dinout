import { UserType } from "../../domain/entities/User";
import { RestaurantType } from "../../domain/entities/restaurants";
import { IMailer } from "../../domain/interface/external-lib/IMailer";
import { IUserRepository } from "../../domain/interface/repositories/IUserRepository";
import { IUserInteractor } from "../../domain/interface/use-cases/IUserInteractor";
import logger from "../../infrastructure/lib/Wintson";

export class userInteractorImpl implements IUserInteractor {
  constructor(private readonly repository: IUserRepository) {}

  async userRegisterInteractor(
    credentials: UserType
  ): Promise<{ user: UserType | null; message: string }> {
    try {
      const { user, message } = await this.repository.userCreate(credentials);
      return { user, message };
    } catch (error) {
      logger.error(error);
      throw error;
    }
  }

  async userLoginInteractor(credentials: {
    email: string;
    password: string;
  }): Promise<{
    user: UserType | null;
    message: string;
    token: string | null;
    refreshToken: string | null;
  }> {
    console.log("User Interactor");
    try {
      const { user, message, token, refreshToken } =
        await this.repository.findByCredentials(
          credentials.email,
          credentials.password
        );
      return { user, message, token, refreshToken };
    } catch (error) {
      logger.error(error);
      throw error;
    }
  }

  async generateOtpInteractor(
    email: string
  ): Promise<{ message: string; otp: number }> {
    try {
      const { message, otp } = await this.repository.generateOtp(email);
      return { message, otp };
    } catch (error) {
      logger.error(error);
      throw error;
    }
  }

  async resetPasswordInteractor(
    email: string
  ): Promise<{ message: string; success: boolean }> {
    try {
      const { message, success } = await this.repository.resetPassword(email);
      return { message, success };
    } catch (error) {
      logger.error(error);
      throw error;
    }
  }

  async resetPasswordChangeInteractor(
    id: string,
    password: string
  ): Promise<{ message: string; status: boolean }> {
    try {
      const { message, status } = await this.repository.resetPasswordConfirm(
        id,
        password
      );
      return { message, status };
    } catch (error) {
      logger.error(error);
      throw error;
    }
  }

  async googleLoginInteractor(credentials: {
    email: string;
    password: string;
    username: string;
  }): Promise<{
    message: string;
    user: UserType;
    token: string;
    refreshToken: string;
  }> {
    try {
      const { message, user, token, refreshToken } =
        await this.repository.googleCredentialsCreate(credentials);
      return { message, user, token, refreshToken };
    } catch (error) {
      logger.error(error);
      throw error;
    }
  }
  async getListedRestaurantsInteractor(): Promise<{
    listedRestaurants: RestaurantType[];
  }> {
    try {
      const { listedRestaurants } =
        await this.repository.getListedRestaurants();
      return { listedRestaurants };
    } catch (error) {
      logger.error(error);
      throw error;
    }
  }
  async getProfileInteractor(
    userId: string
  ): Promise<{ userDetails: UserType | null; status: boolean }> {
    try {
      const { status, userDetails } = await this.repository.getProfileDetails(
        userId
      );
      return { userDetails, status };
    } catch (error) {
      logger.error("Oops an error in get profile interactor..", error);
      throw error;
    }
  }
  async updateUserDetailsInteractor(
    userId: string,
    datas: UserType
  ): Promise<{ updatedUser: UserType | null; status: boolean }> {
    try {
      const { updatedUser, status } = await this.repository.updateUser(
        userId,
        datas
      );
      return { updatedUser, status };
    } catch (error) {
      logger.error("Oops an error in update profile interactor..", error);
      throw error;
    }
  }
}
