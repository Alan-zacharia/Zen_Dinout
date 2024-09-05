import {
  MenuType,
  RestaurantType,
  TableDataType,
  TimeSlotType,
} from "../../entities/RestaurantType";
import { BookingDataType } from "../../entities/UserType";

export interface IRestaurantInteractor {
  loginRestaurantInteractor(data: Partial<RestaurantType>): Promise<{
    restaurant: Partial<RestaurantType> | null;
    message: string;
    token: string | null;
    refreshToken: string | null;
  }>;
  registerRestaurantInteractor(
    credentials: RestaurantType
  ): Promise<{ restaurant: RestaurantType | null; message: string }>;
  getRestaurantDetailInteractor(
    restauarntId: string
  ): Promise<{ restaurant: RestaurantType | null; message: string }>;
  getReservationListInteractor(
    restaurantId: string
  ): Promise<{ reservationDetails: BookingDataType[] | null; message: string }>;
  getReservationInteractor(
    reservationId: string
  ): Promise<{ reservation: BookingDataType | null; message: string }>;
  getDashBoardInteractor(restaurantId: string): Promise<{
    salesData: number[];
    revenueData: number[];
  }>;
  updateReservationInteractor(
    reservationId: string,
    bookingStatus: string
  ): Promise<{ reservation: BookingDataType | null; message: string }>;
  getRestaurantTableInteractor(
    restaurantId: string
  ): Promise<{ message: string; tables: TableDataType[] | null }>;
  getTimeSlotInteractor(
    restauarntId: string,
    date: string
  ): Promise<{ timeSlots: TimeSlotType[] | null; message: string }>;
  createRestaurantTableInteractor(
    restauarntId: string,
    tableDatas: TableDataType
  ): Promise<{ newTable: TableDataType | null; message: string }>;
  createTimeSlotInteractor(
    restauarntId: string,
    newSlotData: TimeSlotType
  ): Promise<{ newSlot: TimeSlotType | null; message: string }>;
  deleteRestaurantTableInteractor(
    tableId: string
  ): Promise<{ message: string; status: boolean }>;
  restaurantProfileUpdateInteractor(
    restauarntId: string,
    restaurantDetails: Partial<RestaurantType>
  ): Promise<{ message: string; restaurant: RestaurantType | null }>;
  deleteRestaurantFeaturedImageInteractor(
    restauarntId: string,
    imageId: string
  ): Promise<{ message: string; status: boolean }>;
  deleteRestaurantSecondaryImagesInteractor(
    restauarntId: string,
    imageIds: string[]
  ): Promise<{ message: string; status: boolean }>;
  deleteMenuInteractor(
    restauarntId: string,
    imageIds: string[]
  ): Promise<{ message: string; status: boolean }>;
  updateRestaurantTableIsAvailableInteractor(
    tableId: string,
    isAvailable: boolean
  ): Promise<{ message: string; status: boolean }>;
  updateRestaurantTimeSlotAvailableInteractor(
    timeSlotId: string,
    avaialable: boolean
  ): Promise<{ message: string; status: boolean }>;
  createMenuInteractor(
    restaurantId: string,
    menuImages: { url: string; public_id: string }[]
  ): Promise<{
    message: string;
    status: boolean;
    menuImages: { url: string; public_id: string }[] | null;
  }>;
  getMenuInteractor(restaurantId: string): Promise<{
    message: string;
    status: boolean;
    menu: MenuType[] | null;
  }>;
}
