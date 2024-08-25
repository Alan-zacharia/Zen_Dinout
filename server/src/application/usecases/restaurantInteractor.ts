import { isGeneratorFunction } from "util/types";
import { MESSAGES, SUCCESS_MESSAGES } from "../../configs/constants";
import {
  RestaurantType,
  TableDataType,
  TimeSlotType,
} from "../../domain/entities/RestaurantType";
import { BookingDataType } from "../../domain/entities/UserType";
import { IRestaurantRepository } from "../../domain/interface/repositories/IRestaurantRepositories";
import { IRestaurantInteractor } from "../../domain/interface/use-cases/IRestaurantInteractor";
import restaurantModel from "../../infrastructure/database/model.ts/restaurantModel";
import logger from "../../infrastructure/lib/Wintson";
import { removeuploadedImage } from "../../presentation/services/shared/imageService";

export class sellerInteractor implements IRestaurantInteractor {
  constructor(private readonly repository: IRestaurantRepository) {}
  public async loginRestaurantInteractor(
    data: Partial<RestaurantType>
  ): Promise<{
    restaurant: Partial<RestaurantType> | null;
    message: string;
    token: string | null;
    refreshToken: string | null;
  }> {
    const { email, password } = data;
    if (!email || !password) {
      return {
        restaurant: null,
        message: MESSAGES.INVALID_DATA,
        token: null,
        refreshToken: null,
      };
    }
    try {
      const { message, restaurant, token, refreshToken } =
        await this.repository.loginRestaurantRepo(data);
      return { message, restaurant, token, refreshToken };
    } catch (error) {
      throw error;
    }
  }

  public async registerRestaurantInteractor(
    credentials: RestaurantType
  ): Promise<{ restaurant: RestaurantType | null; message: string }> {
    const { email, restaurantName, contact, password } = credentials;
    if (!email || !restaurantName || !contact || !password) {
      return { restaurant: null, message: MESSAGES.INVALID_DATA };
    }
    try {
      const result = await this.repository.registerRestaurantRepo(credentials);
      const { message, restaurant } = result;
      return { message, restaurant };
    } catch (error) {
      throw error;
    }
  }
  public async getRestaurantDetailInteractor(
    restaurantId: string
  ): Promise<{ restaurant: RestaurantType | null; message: string }> {
    if (!restaurantId) {
      return { restaurant: null, message: MESSAGES.INVALID_DATA };
    }
    try {
      const result = await this.repository.getRestaurantDetailInteractor(
        restaurantId
      );
      const { restaurant, message } = result;
      return { restaurant, message };
    } catch (error) {
      throw error;
    }
  }
  public async getReservationListInteractor(restaurantId: string): Promise<{
    reservationDetails: BookingDataType[] | null;
    message: string;
  }> {
    if (!restaurantId) {
      return { reservationDetails: null, message: MESSAGES.INVALID_DATA };
    }
    try {
      const { message, reservationDetails } =
        await this.repository.getReservationListRepo(restaurantId);
      return { reservationDetails, message };
    } catch (error) {
      throw error;
    }
  }
  public async getReservationInteractor(reservationId: string): Promise<{
    reservation: BookingDataType | null;
    message: string;
  }> {
    if (!reservationId) {
      return { reservation: null, message: MESSAGES.INVALID_DATA };
    }
    try {
      const { message, reservation } = await this.repository.getReservationRepo(
        reservationId
      );
      return { reservation, message };
    } catch (error) {
      throw error;
    }
  }
  public async updateReservationInteractor(
    reservationId: string,
    bookingStatus: string
  ): Promise<{ reservation: BookingDataType | null; message: string }> {
    if (!reservationId) {
      return { reservation: null, message: MESSAGES.INVALID_DATA };
    }
    try {
      const { message, reservation } =
        await this.repository.updateReservationRepo(
          reservationId,
          bookingStatus
        );
      return { reservation, message };
    } catch (error) {
      throw error;
    }
  }
  public async getRestaurantTableInteractor(
    restaurantId: string
  ): Promise<{ message: string; tables: TableDataType[] | null }> {
    if (!restaurantId) {
      return { tables: null, message: MESSAGES.INVALID_DATA };
    }
    try {
      const { message, tables } = await this.repository.getRestaurantTableRepo(
        restaurantId
      );
      return { tables, message };
    } catch (error) {
      throw error;
    }
  }

  public async getTimeSlotInteractor(
    restaurantId: string,
    date: string
  ): Promise<{ message: string; timeSlots: TimeSlotType[] | null }> {
    if (!restaurantId || !date) {
      return { timeSlots: null, message: MESSAGES.INVALID_DATA };
    }
    try {
      const { message, timeSlots } = await this.repository.getTimeSlotRepo(
        restaurantId,
        date
      );
      return { timeSlots, message };
    } catch (error) {
      throw error;
    }
  }
  public async createRestaurantTableInteractor(
    restaurantId: string,
    tableDatas: TableDataType
  ): Promise<{ message: string; newTable: TableDataType | null }> {
    const { tableImage, tableNumber, tableLocation } = tableDatas;
    if (!restaurantId || !tableImage || !tableNumber || !tableLocation) {
      return { newTable: null, message: MESSAGES.INVALID_DATA };
    }
    try {
      const { message, newTable } =
        await this.repository.createRestaurantTableRepo(
          restaurantId,
          tableDatas
        );
      return { newTable, message };
    } catch (error) {
      throw error;
    }
  }
  public async createTimeSlotInteractor(
    restaurantId: string,
    newSlotData: TimeSlotType
  ): Promise<{ message: string; newSlot: TimeSlotType | null }> {
    const { time, date, maxTables } = newSlotData;
    if (!restaurantId || !date || !time) {
      return { newSlot: null, message: MESSAGES.INVALID_DATA };
    }
    try {
      const { message, newSlot } = await this.repository.createTimeSlotRepo(
        restaurantId,
        newSlotData
      );
      return { newSlot, message };
    } catch (error) {
      throw error;
    }
  }

  public async deleteRestaurantTableInteractor(
    tableId: string
  ): Promise<{ message: string; status: boolean }> {
    if (!tableId) {
      return { message: MESSAGES.INVALID_FORMAT, status: false };
    }
    try {
      const { message, status } =
        await this.repository.deleteRestaurantTableRepo(tableId);
      return { status, message };
    } catch (error) {
      throw error;
    }
  }
  public async restaurantProfileUpdateInteractor(
    restaurantId: string,
    restaurantDatas: RestaurantType
  ): Promise<{ message: string; restaurant: RestaurantType | null }> {
    if (!restaurantId) {
      return { message: MESSAGES.INVALID_FORMAT, restaurant: null };
    }
    try {
      const result = await this.repository.restaurantProfileUpdateRepo(
        restaurantId,
        restaurantDatas
      );
      const { message, restaurant } = result;
      return { restaurant, message };
    } catch (error) {
      throw error;
    }
  }
  public async deleteRestaurantFeaturedImageInteractor(
    restaurantId: string,
    imageId: string
  ): Promise<{ message: string; status: boolean }> {
    if (!restaurantId || !imageId) {
      return { message: MESSAGES.INVALID_FORMAT, status: false };
    }
    try {
      const response = await removeuploadedImage(imageId);
      console.log(response, imageId);
      if (!response.success) {
        return { status: false, message: "Failed to remove image.." };
      }
      const result = await this.repository.deleteRestaurantFeaturedImageRepo(
        restaurantId,
        imageId
      );
      const { message, status } = result;
      return { status, message };
    } catch (error) {
      throw error;
    }
  }
  public async deleteRestaurantSecondaryImagesInteractor(
    restaurantId: string,
    imageIds: string[]
  ): Promise<{ message: string; status: boolean }> {
    if (!restaurantId || !imageIds) {
      return { message: MESSAGES.INVALID_FORMAT, status: false };
    }
    try {
      for (let imageId of imageIds) {
        const response = await removeuploadedImage(imageId);
        if (!response.success) {
          return { status: false, message: "Failed to remove image.." };
        }
      }
      const result = await this.repository.deleteRestaurantSecondaryImagesRepo(
        restaurantId,
        imageIds
      );
      const { message, status } = result;
      return { status, message };
    } catch (error) {
      throw error;
    }
  }
  public async updateRestaurantTableIsAvailableInteractor(
    tableId: string,
    isAvailable: boolean
  ): Promise<{ message: string; status: boolean }> {
    if (!tableId) {
      return { message: MESSAGES.INVALID_FORMAT, status: false };
    }
    try {
      const result = await this.repository.updateRestaurantTableIsAvailableRepo(
        tableId,
        isAvailable
      );
      const { message, status } = result;
      return { status, message };
    } catch (error) {
      throw error;
    }
  }
  public async updateRestaurantTimeSlotAvailableInteractor(
    timeSlotId: string,
    avaialable: boolean
  ): Promise<{ message: string; status: boolean }> {
    if (!timeSlotId) {
      return { message: MESSAGES.INVALID_FORMAT, status: false };
    }
    try {
      const result =
        await this.repository.updateRestaurantTimeSlotAvailableRepo(
          timeSlotId,
          avaialable
        );
      const { message, status } = result;
      return { status, message };
    } catch (error) {
      throw error;
    }
  }
}
