import { UserType } from "../../domain/entities/User";
import { IAdminRepositories } from "../../domain/interface/repositories/IAdminRepositories";
import { IAdminInteractor } from "../../domain/interface/use-cases/IAdminInteractor";
import { jwtGenerateToken } from "../../functions/auth/jwtTokenFunctions";

export class adminInteractorImpl implements IAdminInteractor {
  constructor(private readonly repository: IAdminRepositories) {}

  async adminLogin(credentials: { email: string; password: string }): Promise<{
    message: string;
    token: string | null;
    admin: UserType | null;
    refreshToken: string | null;
  }> {
    console.log("Get admin login Interactor service........; ");
    try {
      const { admin, message, token, refreshToken } =
        await this.repository.loginAdminRepo(credentials);
      return { admin, message, token, refreshToken };
    } catch (error) {
      console.log("OOps error in admin login interactorImpl : ", error);
      throw error;
    }
  }
  async getUsers(): Promise<{ users: UserType | null; message: string }> {
    console.log("Get users Interactor service.........; ");
    try {
      const { message, users } = await this.repository.getUsersList();
      return { users, message };
    } catch (error) {
      console.log("OOps error in getUsers interactorImpl : ", error);
      throw error;
    }
  }
  async getResataurants(): Promise<{
    restaurants: object | null;
    message: string;
  }> {
    console.log("Get restaurants Interactor service.........; ");
    try {
      const { message, restaurants } =
        await this.repository.getRestaurantsList();
      return { restaurants, message };
    } catch (error) {
      console.log("OOps error in getUsers interactorImpl : ", error);
      throw error;
    }
  }
  async restaurantApprove(): Promise<{
    restaurants: object | null;
    message: string;
  }> {
    console.log("Get restaurants Interactor service.........; ");
    try {
      const { message, restaurants } = await this.repository.approve();
      return { restaurants, message };
    } catch (error) {
      console.log("OOps error in getUsers interactorImpl : ", error);
      throw error;
    }
  }

  async actionInter(
    id: string,
    block: string
  ): Promise<{ users: UserType | null; message: string }> {
    console.log("User Actions interactor");
    try {
      const { users, message } = await this.repository.userBlockUnblock(
        id,
        block
      );
      return { users, message };
    } catch (error) {
      console.log("OOps error in user actions interactorImpl : ", error);
      throw error;
    }
  }

  async getRestaurantDetailsInteractor(
    restaurantId: string
  ): Promise<{ restaurants: object | null; message: string }> {
    try {
      const { restaurants, message } =
        await this.repository.getapprovalRestaurant(restaurantId);
      return { restaurants, message };
    } catch (error) {
      console.log(
        "OOps error in get approval restaurant interactorImpl : ",
        error
      );
      throw error;
    }
  }
  async confirmRestaurantInteractor(
    restaurantId: string,
    logic: string,
    rejectReason: string
  ): Promise<{ success: boolean; message: string }> {
    try {
      const { message, success } = await this.repository.confirmRestaurant(
        restaurantId,
        logic,
        rejectReason
      );
      return { message, success };
    } catch (error) {
      console.log(
        "OOps error in confrim approval restaurant interactorImpl : ",
        error
      );
      throw error;
    }
  }
}
