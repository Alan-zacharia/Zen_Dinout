import {
  MenuType,
  RestaurantType,
  TableDataType,
  TimeSlotType,
} from "../../domain/entities/RestaurantType";
import { IRestaurantRepository } from "../../domain/interface/repositories/IRestaurantRepositories";
import restaurantModel from "../database/model/restaurantModel";
import logger from "../lib/Wintson";
import restaurantTableModel from "../database/model/restaurantTable";
import { MESSAGES, ROLES, SUCCESS_MESSAGES } from "../../configs/constants";
import { hashedPasswordCompare } from "../../domain/entities/auth";
import { generateTokens } from "../utils/jwtUtils";
import EmailService from "../lib/EmailService";
import { BookingDataType } from "../../domain/entities/UserType";
import bookingModel from "../database/model/bookingModel";
import TimeSlot from "../database/model/restaurantTimeSlot";
import { removeuploadedImage } from "../../presentation/services/shared/imageService";
import { convertToUTCWithOffset } from "../../application/helpers/timeConvertionHelper";
import menuModel from "../database/model/menuModel";
import mongoose from "mongoose";

export class sellerRepository implements IRestaurantRepository {
  public async findExistingUser(email: string): Promise<boolean> {
    try {
      const restauarnt = await restaurantModel.findOne({ email });
      return !!restauarnt;
    } catch (error) {
      throw new Error("Failed to find user. Please try again later.");
    }
  }
  public async loginRestaurantRepo(data: Partial<RestaurantType>): Promise<{
    restaurant: Partial<RestaurantType> | null;
    message: string;
    token: string | null;
    refreshToken: string | null;
  }> {
    const { email, password } = data;
    try {
      const restaurant = await restaurantModel.findOne({ email: email });
      if (!restaurant || !restaurant.isApproved) {
        return {
          restaurant: null,
          message: MESSAGES.RESOURCE_NOT_FOUND,
          token: null,
          refreshToken: null,
        };
      }
      const hashedPassword = await hashedPasswordCompare(
        password as string,
        restaurant.password
      );
      if (hashedPassword) {
        const { generatedAccessToken, generatedRefreshToken } = generateTokens(
          restaurant._id.toString(),
          ROLES.SELLER
        );
        const { password, ...restaurantWithoutPassword } =
          restaurant.toObject();
        return {
          restaurant: restaurantWithoutPassword as any,
          message: SUCCESS_MESSAGES.LOGIN_SUCCESS,
          token: generatedAccessToken,
          refreshToken: generatedRefreshToken,
        };
      } else {
        return {
          restaurant: null,
          message: MESSAGES.INVALID_PASSWORD,
          token: null,
          refreshToken: null,
        };
      }
    } catch (error) {
      throw error;
    }
  }

  public async registerRestaurantRepo(
    restaurant: RestaurantType
  ): Promise<{ restaurant: RestaurantType | null; message: string }> {
    try {
      const { restaurantName, email, password, contact } = restaurant;
      const existingRestaurant = await this.findExistingUser(email);
      if (existingRestaurant) {
        return {
          restaurant: null,
          message: MESSAGES.USER_ALREADY_EXISTS,
        };
      }
      const newRestuarnt = new restaurantModel({
        restaurantName,
        email,
        contact,
        password,
      });
      await newRestuarnt.save();
      EmailService.sendRegistrationConfirmationEmail(email);
      return {
        restaurant: newRestuarnt.toObject(),
        message: SUCCESS_MESSAGES.REGISTRATION_SUCCESS,
      };
    } catch (error) {
      throw error;
    }
  }

  public async getRestaurantDetailInteractor(
    _id: string
  ): Promise<{ restaurant: any; message: string }> {
    try {
      const restaurant = await restaurantModel.findById({ _id });
      console.log(restaurant);
      return { restaurant, message: "" };
    } catch (error) {
      console.log("OOps an error occured in get restaurant profile : ", error);
      throw error;
    }
  }
  public async getReservationListRepo(restaurantId: string): Promise<{
    reservationDetails: BookingDataType[] | null;
    message: string;
  }> {
    try {
      const reservationDetails = await bookingModel
        .find({ restaurantId: restaurantId })
        .populate("userId", "username email")
        .populate("restaurantId", "restaurantName")
        .sort({ createdAt: -1 });
      const reservationDatas: BookingDataType[] = reservationDetails.map(
        (data) => {
          return data.toObject();
        }
      );
      return {
        reservationDetails: reservationDatas,
        message: SUCCESS_MESSAGES.FETCHED_SUCCESSFULLY,
      };
    } catch (error) {
      throw error;
    }
  }
  public async getReservationRepo(reservationId: string): Promise<{
    reservation: BookingDataType | null;
    message: string;
  }> {
    try {
      const reservationDetails = await bookingModel
        .findOne({ bookingId: reservationId })
        .populate("userId", "username email")
        .populate("restaurantId", "restaurantName")
        .populate("table", "tableNumber")
        .sort({ createdAt: -1 });
      if (!reservationDetails) {
        return {
          reservation: null,
          message: "No reservation found",
        };
      }
      console.log(reservationDetails);
      return {
        reservation: reservationDetails as any,
        message: SUCCESS_MESSAGES.FETCHED_SUCCESSFULLY,
      };
    } catch (error) {
      throw error;
    }
  }
  public async updateReservationRepo(
    reservationId: string,
    bookingStatus: string
  ): Promise<{
    reservation: BookingDataType | null;
    message: string;
  }> {
    try {
      const reservation = await bookingModel
        .findOneAndUpdate(
          { bookingId: reservationId },
          { bookingStatus: bookingStatus }
        )
        .populate("userId", "username email");
      if (!reservation) {
        return {
          reservation: null,
          message: MESSAGES.DATA_NOT_FOUND,
        };
      }
      return {
        reservation: reservation.toObject(),
        message: SUCCESS_MESSAGES.UPDATED_SUCCESSFULLY,
      };
    } catch (error) {
      throw error;
    }
  }

  public async getRestaurantTableRepo(
    restaurantId: string
  ): Promise<{ message: string; tables: TableDataType[] | null }> {
    try {
      const tables = await restaurantTableModel.find({ restaurantId });
      const tableDatas: TableDataType[] = tables.map((table) => {
        return table.toObject();
      });
      return {
        message: SUCCESS_MESSAGES.FETCHED_SUCCESSFULLY,
        tables: tableDatas,
      };
    } catch (error) {
      throw error;
    }
  }
  public async getTimeSlotRepo(
    restaurantId: string,
    date: string
  ): Promise<{ message: string; timeSlots: TimeSlotType[] | null }> {
    try {
      const timeSlots = await TimeSlot.find({
        restaurantId,
        date,
      });
      const times: TimeSlotType[] = timeSlots.map((table) => {
        return table.toObject();
      });
      return {
        message: SUCCESS_MESSAGES.FETCHED_SUCCESSFULLY,
        timeSlots: times,
      };
    } catch (error) {
      throw error;
    }
  }
  public async createRestaurantTableRepo(
    restaurantId: string,
    tableDatas: TableDataType
  ): Promise<{ message: string; newTable: TableDataType | null }> {
    const { tableImage, tableNumber, tableCapacity, tableLocation } =
      tableDatas;
    try {
      const newTable = new restaurantTableModel({
        restaurantId,
        tableCapacity,
        tableImage,
        tableNumber,
        tableLocation,
      });
      await newTable.save();
      return {
        message: SUCCESS_MESSAGES.RESOURCE_CREATED,
        newTable: newTable.toObject(),
      };
    } catch (error) {
      throw error;
    }
  }
  public async createTimeSlotRepo(
    restaurantId: string,
    newSlotData: TimeSlotType
  ): Promise<{ message: string; newSlot: TimeSlotType | null }> {
    const { date, time } = newSlotData;
    try {
      const slotTime = convertToUTCWithOffset(time, 5, 30);
      const newSlot = new TimeSlot({
        restaurantId,
        date,
        time: slotTime,
      });
      await newSlot.save();
      console.log(newSlot);
      return {
        message: SUCCESS_MESSAGES.RESOURCE_CREATED,
        newSlot: newSlot.toObject(),
      };
    } catch (error) {
      throw error;
    }
  }

  public async deleteRestaurantTableRepo(
    tableId: string
  ): Promise<{ message: string; status: boolean }> {
    try {
      const deleteTable = await restaurantTableModel.findByIdAndDelete(tableId);
      if (!deleteTable) {
        return {
          message: MESSAGES.RESOURCE_NOT_FOUND,
          status: false,
        };
      }
      if (deleteTable.tableImage?.public_id) {
        removeuploadedImage(deleteTable.tableImage.public_id);
      }
      return {
        message: SUCCESS_MESSAGES.REMOVED_SUCCESS,
        status: true,
      };
    } catch (error) {
      throw error;
    }
  }

  public async restaurantProfileUpdateRepo(
    restaurantId: string,
    restaurantDetails: RestaurantType
  ): Promise<{ restaurant: RestaurantType | null; message: string }> {
    const {
      restaurantName,
      contact,
      description,
      closingTime,
      location,
      openingTime,
      place_name,
      tableRate,
      featuredImage,
      secondaryImages,
      address,
      cuisines,
      vegOrNonVegType,
    } = restaurantDetails;
    try {
      const locationObject = JSON.parse(String(location));
      const coordinates: [number, number] = locationObject.coordinates;
      const startTime = convertToUTCWithOffset(openingTime, 5, 30);
      const endTime = convertToUTCWithOffset(closingTime, 5, 30);
      const restaurant = await restaurantModel.findById(restaurantId);
      if (!restaurant) {
        return { restaurant: null, message: MESSAGES.DATA_NOT_FOUND };
      }
      const updatedSecondaryImages = [
        ...restaurant.secondaryImages,
        ...(secondaryImages || []),
      ];
      const updatedRestauarnt = await restaurantModel.findByIdAndUpdate(
        restaurantId,
        {
          restaurantName,
          contact,
          address,
          description,
          location: { type: locationObject.type, coordinates },
          openingTime: startTime,
          closingTime: endTime,
          tableRate,
          featuredImage,
          secondaryImages: updatedSecondaryImages,
          place_name,
          cuisines: cuisines,
          vegOrNonVegType,
        },
        { upsert: true, new: true }
      );
      return {
        restaurant: updatedRestauarnt.toObject(),
        message: SUCCESS_MESSAGES.UPDATED_SUCCESSFULLY,
      };
    } catch (error) {
      throw error;
    }
  }

  public async deleteRestaurantFeaturedImageRepo(
    restaurantId: string,
    imageId: string
  ): Promise<{ message: string; status: boolean }> {
    try {
      const restaurant = await restaurantModel.findById(restaurantId);
      if (!restaurant) {
        return {
          message: MESSAGES.DATA_NOT_FOUND,
          status: false,
        };
      }
      restaurant.featuredImage = undefined;
      await restaurant.save();
      return { status: true, message: SUCCESS_MESSAGES.REMOVED_SUCCESS };
    } catch (error) {
      throw error;
    }
  }
  public async deleteRestaurantSecondaryImagesRepo(
    restaurantId: string,
    imageIds: string[]
  ): Promise<{ message: string; status: boolean }> {
    try {
      const restaurant = await restaurantModel.findById(restaurantId);
      if (!restaurant) {
        return {
          message: MESSAGES.DATA_NOT_FOUND,
          status: false,
        };
      }
      imageIds.forEach((imageId) => {
        restaurant.secondaryImages.pull({ public_id: imageId });
      });
      await restaurant.save();
      return { status: true, message: SUCCESS_MESSAGES.REMOVED_SUCCESS };
    } catch (error) {
      throw error;
    }
  }
  public async deleteMenuRepo(
    restaurantId: string,
    imageIds: string[]
  ): Promise<{ message: string; status: boolean }> {
    try {
      const result = await menuModel.updateOne(
        { restaurantId },
        { $pull: { items: { public_id: { $in: imageIds } } } }
      );

      if (result.modifiedCount === 0) {
        return {
          message: MESSAGES.DATA_NOT_FOUND,
          status: false,
        };
      }

      return {
        status: true,
        message: SUCCESS_MESSAGES.REMOVED_SUCCESS,
      };
    } catch (error) {
      console.error("Error deleting images:", error);
      throw new Error("Error deleting images");
    }
  }

  public async updateRestaurantTableIsAvailableRepo(
    tableId: string,
    isAvailable: boolean
  ): Promise<{ message: string; status: boolean }> {
    try {
      const table = await restaurantTableModel.findById(tableId);
      if (!table) {
        return {
          message: MESSAGES.DATA_NOT_FOUND,
          status: false,
        };
      }
      table.isAvailable = isAvailable;
      await table.save();
      return { status: true, message: SUCCESS_MESSAGES.UPDATED_SUCCESSFULLY };
    } catch (error) {
      throw error;
    }
  }
  public async updateRestaurantTimeSlotAvailableRepo(
    timeSlotId: string,
    available: boolean
  ): Promise<{ message: string; status: boolean }> {
    try {
      const timeSlot = await TimeSlot.findById(timeSlotId);
      if (!timeSlot) {
        return {
          message: MESSAGES.DATA_NOT_FOUND,
          status: false,
        };
      }
      console.log(timeSlot);
      timeSlot.isAvailable = available;
      await timeSlot.save();
      return { status: true, message: SUCCESS_MESSAGES.UPDATED_SUCCESSFULLY };
    } catch (error) {
      throw error;
    }
  }
  public async createMenuRepo(
    restaurantId: string,
    uploadedImages: { url: string; public_id: string }[]
  ): Promise<{
    message: string;
    status: boolean;
    menuImages: { url: string; public_id: string }[] | null;
  }> {
    try {
      const existingMenu = await menuModel.findOne({ restaurantId });
      if (existingMenu) {
        existingMenu.items.push(...uploadedImages);
        const updatedMenu = await existingMenu.save();
        const updatedMenuImages = updatedMenu.items.map((item: any) => ({
          url: item.url,
          public_id: item.public_id,
        }));

        return {
          status: true,
          message: SUCCESS_MESSAGES.RESOURCE_CREATED,
          menuImages: updatedMenuImages,
        };
      } else {
        const newMenu = new menuModel({
          restaurantId,
          items: uploadedImages,
        });
        const savedMenu = await newMenu.save();
        const savedMenuImages = savedMenu.items.map((item: any) => ({
          url: item.url,
          public_id: item.public_id,
        }));
        return {
          status: true,
          message: SUCCESS_MESSAGES.RESOURCE_CREATED,
          menuImages: savedMenuImages,
        };
      }
    } catch (error) {
      throw error;
    }
  }
  public async getMenuRepo(restaurantId: string): Promise<{
    message: string;
    status: boolean;
    menu: MenuType[] | null;
  }> {
    try {
      const menu = await menuModel.findOne({ restaurantId });
      if (!menu) {
        return {
          status: true,
          message: SUCCESS_MESSAGES.RESOURCE_CREATED,
          menu: [],
        };
      }
      return {
        status: true,
        message: SUCCESS_MESSAGES.RESOURCE_CREATED,
        menu: menu?.toObject(),
      };
    } catch (error) {
      throw error;
    }
  }
  public async getDashBoardRepo(restaurantId: string): Promise<{
    salesData: number[];
    revenueData: number[];
  }> {
    try {
      const restaurantIdObjectId = new  mongoose.Types.ObjectId(restaurantId);
      const bookingsData = await bookingModel.aggregate([
        {
          $match: {
            restaurantId: restaurantIdObjectId, 
            paymentStatus: "PAID",
            bookingStatus: "COMPLETED",
            createdAt: {
              $gte: new Date(new Date().setDate(new Date().getDate() - 7)), 
            },
          },
        },
        {
          $group: {
            _id: {
              $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
            },
            count: { $sum: 1 }, 
            revenue: {
              $sum: {
                $multiply: ["$totalAmount", 0.85], 
              },
            },
          },
        },
        {
          $sort: { _id: 1 }, 
        },
      ]);
      console.log(bookingsData)
      const salesData = bookingsData.map((data) => data.count);
      const revenueData = bookingsData.map((data) => data.revenue);
      console.log(salesData , revenueData)
      return {
        salesData,
        revenueData,
      };
    } catch (error) {
      throw error;
    }
  }
}
