import {
  RestaurantType,
  tableSlotTypes,
} from "../../domain/entities/restaurants";
import { IRestaurantRepository } from "../../domain/interface/repositories/ISellerRepositories";
import { IRestaurantInteractor } from "../../domain/interface/use-cases/ISellerInteractor";
import restaurantModel from "../../infrastructure/database/model.ts/restaurantModel";
import logger from "../../infrastructure/lib/Wintson";

export class sellerInteractor implements IRestaurantInteractor {
  constructor(private readonly repository: IRestaurantRepository) {}

  async restaurantRegisteration(
    credentials: RestaurantType
  ): Promise<{ restaurant: object | null; message: string }> {
    try {
      console.log(credentials);
      const { message, restaurant } = await this.repository.create(credentials);
      return { message, restaurant };
    } catch (error) {
      console.log(
        "Error from the Restaurant registeration Intercator ........." + error
      );
      throw error;
    }
  }
  async Login(
    data: Partial<RestaurantType>
  ): Promise<{
    restaurant: Partial<RestaurantType> | null;
    message: string;
    token: string | null;
    refreshToken: string | null;
  }> {
    console.log("Seller Login interactor .......................");
    try {
      console.log(data);
      const { message, restaurant, token, refreshToken } =
        await this.repository.findCredentials(data);
      return { message, restaurant, token, refreshToken };
    } catch (error) {
      console.log(
        "Error from the Restaurant registeration Intercator ........." + error
      );
      throw error;
    }
  }

  async sellerProfileInteractor(
    email: string
  ): Promise<{ restaurant: object }> {
    try {
      const { restaurant, message } = await this.repository.getProfile(email);
      return { restaurant };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
  reservations(): Promise<{ restaurant: object | null }> {
    throw new Error("Method not implemented.");
  }

  async restaurantDetailsUpdateInteractor(
    credentials: RestaurantType,
    restaurantId: string
  ): Promise<{ restaurant: Partial<RestaurantType>; message: string }> {
    console.log("Restaurant updation interactor.......");
    try {
      const { message, restaurant } =
        await this.repository.createRestaurantDetails(
          credentials,
          restaurantId
        );
      return { restaurant, message };
    } catch (error) {
      console.log("OOps error in restaurantDetailsUpdateInteractor : ", error);
      throw error;
    }
  }

  async createTableSlotInteractor(
    tableSlotDatas: tableSlotTypes,
    restaurantId: string
  ): Promise<{ message: string; status: boolean }> {
    try {
      const { status, message } = await this.repository.createNewTableSlot(
        tableSlotDatas,
        restaurantId
      );
      return { status, message };
    } catch (error) {
      logger.error("Oops an error in createTableSlotInteractor", error);
      throw error;
    }
  }

  async getRestaurantTableInteractor(
    restaurantId: string
  ): Promise<{ message: string; tableSlotDatas: object }> {
    try {
      const { message, tableSlotDatas } = await this.repository.tableListDatas(
        restaurantId
      );
      return { tableSlotDatas, message };
    } catch (error) {
      logger.error("Oops error in getRestaurantTableInteractor", error);
      throw error;
    }
  }

  async getRestaurantTableSlotsInteractor(
    tableId: string
  ): Promise<{ message: string; tableSlotDatas: object }> {
    try {
      const { message, tableSlotDatas } = await this.repository.tableSloteDatas(
        tableId
      );
      return { tableSlotDatas, message };
    } catch (error) {
      logger.error("Oops error in getRestaurantTableInteractor", error);
      throw error;
    }
  }

  async createTableTimeSlotInteractor(
    tableSlotTimeData: object,
    tableId: string
  ): Promise<{ message: string; status: boolean }> {
    try {
      const { message, status } = await this.repository.addTableTimeSloteDatas(
        tableSlotTimeData,
        tableId
      );
      return { message, status };
    } catch (error) {
      logger.error("Oops an error in create table time slot Int", error);
      throw error;
    }
  }

  async deleteTableSlotInteractor(
    tableId: string
  ): Promise<{ message: string; status: boolean }> {
    try {
      const { message, status } = await this.repository.deleteTimeSlot(tableId);
      return { message, status };
    } catch (error) {
      logger.error("Oops an error in delet table time slot Int", error);
      throw error;
    }
  }
}
