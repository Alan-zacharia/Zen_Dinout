import { RestaurantType, tableSlotTypes } from "../../entities/restaurants";

export interface IRestaurantRepository {
  create(
    restaurant: RestaurantType
  ): Promise<{ restaurant: RestaurantType | null; message: string }>;
  findCredentials(
    data: object
  ): Promise<{
    restaurant: Partial<RestaurantType> | null;
    message: string;
    token: string | null;
    refreshToken: string | null;
  }>;
  createRestaurantDetails(
    restaurant: RestaurantType,
    _id: string
  ): Promise<{ restaurant: Partial<RestaurantType>; message: string }>;
  getProfile(email: string): Promise<{ restaurant: any; message: string }>;
  createNewTableSlot(
    tabelSlotDatas: tableSlotTypes,
    restaurantId: string
  ): Promise<{ message: string; status: boolean }>;
  tableListDatas(
    restaurantId: string
  ): Promise<{ message: string; tableSlotDatas: object }>;
  tableSloteDatas(
    tableId: string
  ): Promise<{ message: string; tableSlotDatas: object }>;
  addTableTimeSloteDatas(
    tableSlotTimeData: object,
    tableId: string
  ): Promise<{ message: string; status: boolean }>;
  deleteTimeSlot(
    tableId: string
  ): Promise<{ message: string; status: boolean }>;
}
