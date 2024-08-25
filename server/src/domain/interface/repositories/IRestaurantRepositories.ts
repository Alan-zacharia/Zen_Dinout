import {
  RestaurantType,
  TableDataType,
  TimeSlotType,
} from "../../entities/RestaurantType";
import { BookingDataType } from "../../entities/UserType";

export interface IRestaurantRepository {
  loginRestaurantRepo(data: Partial<RestaurantType>): Promise<{
    restaurant: Partial<RestaurantType> | null;
    message: string;
    token: string | null;
    refreshToken: string | null;
  }>;
  registerRestaurantRepo(
    restaurant: RestaurantType
  ): Promise<{ restaurant: RestaurantType | null; message: string }>;
  getRestaurantDetailInteractor(
    restauarntId: string
  ): Promise<{ restaurant: RestaurantType | null; message: string }>;
  getReservationListRepo(
    restaurantId: string
  ): Promise<{ reservationDetails: BookingDataType[] | null; message: string }>;
  getReservationRepo(
    bookingId: string
  ): Promise<{ reservation: BookingDataType | null; message: string }>;
  getRestaurantTableRepo(
    restaurantId: string
  ): Promise<{ message: string; tables: TableDataType[] | null }>;
  getTimeSlotRepo(
    restauarntId: string,
    date: string
  ): Promise<{ timeSlots: TimeSlotType[] | null; message: string }>;
  updateReservationRepo(
    reservationId: string,
    bookingStatus: string
  ): Promise<{ reservation: BookingDataType | null; message: string }>;
  createRestaurantTableRepo(
    reservationId: string,
    tableDatas: TableDataType
  ): Promise<{ newTable: TableDataType | null; message: string }>;
  createTimeSlotRepo(
    reservationId: string,
    newSlotData: TimeSlotType
  ): Promise<{ newSlot: TimeSlotType | null; message: string }>;
  deleteRestaurantTableRepo(
    tableId: string
  ): Promise<{ message: string; status: boolean }>;
  restaurantProfileUpdateRepo(
    restaurantId: string,
    restaurantDatas: RestaurantType
  ): Promise<{ message: string; restaurant: RestaurantType | null }>;
  deleteRestaurantFeaturedImageRepo(
    restaurantId: string,
    imageId: string
  ): Promise<{ message: string; status: boolean }>;
  deleteRestaurantSecondaryImagesRepo(
    restauarntId: string,
    imageIds: string[]
  ): Promise<{ message: string; status: boolean }>;
  updateRestaurantTableIsAvailableRepo(
    tableId: string,
    isAvailable: boolean
  ): Promise<{ message: string; status: boolean }>;
  updateRestaurantTimeSlotAvailableRepo(
    tableId: string,
    isAvailable: boolean
  ): Promise<{ message: string; status: boolean }>;
}
