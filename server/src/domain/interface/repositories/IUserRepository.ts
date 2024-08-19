import { UserType } from "../../entities/User";
import { RestaurantType } from "../../entities/restaurants";

export interface IUserRepository {
  findByCredentials(
    email: string,
    password: string
  ): Promise<{
    user: UserType | null;
    message: string;
    token: string | null;
    refreshToken: string | null;
  }>;
  userCreate(
    user: UserType
  ): Promise<{ user: UserType | null; message: string }>;
  resetPassword(email: string): Promise<{ message: string; success: boolean }>;
  resetPasswordConfirm(
    id: string,
    password: string
  ): Promise<{ message: string; status: boolean }>;
  generateOtp(email: string): Promise<{ message: string; otp: number }>;
  getListedRestaurants(): Promise<{ listedRestaurants: RestaurantType[] }>;
  googleCredentialsCreate(credentials: {
    email: string;
    password: string;
    username: string;
  }): Promise<{
    message: string;
    user: UserType;
    token: string;
    refreshToken: string;
  }>;
  getProfileDetails(
    _id: string
  ): Promise<{ userDetails: UserType | null; status: boolean }>;
  updateUser(
    _id: string,
    datas: UserType
  ): Promise<{ updatedUser: UserType | null; status: boolean }>;
}
