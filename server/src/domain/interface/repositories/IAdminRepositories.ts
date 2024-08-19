import { UserType } from "../../entities/User";

export interface IAdminRepositories {
  loginAdminRepo(credentials: {
    email: string;
    password: string;
  }): Promise<{
    admin: UserType | null;
    message: string;
    refreshToken: string | null;
    token: string | null;
  }>;
  getUsersList(): Promise<{ users: object | null; message: string }>;
  userBlockUnblock(
    id: string,
    block: string
  ): Promise<{ users: object | null; message: string }>;
  getRestaurantsList(): Promise<{
    restaurants: object | null;
    message: string;
  }>;
  approve(): Promise<{ restaurants: object | null; message: string }>;
  getapprovalRestaurant(
    restaurantId: string
  ): Promise<{ restaurants: object | null; message: string }>;
  confirmRestaurant(
    restaurantId: string,
    logic: string,
    rejectReason: string
  ): Promise<{ success: boolean; message: string }>;
}
