import {
  RestaurantType,
  tableSlotTypes,
} from "../../domain/entities/restaurants";
import { IRestaurantRepository } from "../../domain/interface/repositories/ISellerRepositories";
import nodemaileMailSeller from "../../functions/MaileGenSeller";
import {
  jwtGenerateRefreshToken,
  jwtGenerateToken,
} from "../../functions/auth/jwtTokenFunctions";
import restaurantModel from "../database/model.ts/restaurantModel";
import bcrypt from "bcryptjs";
import logger from "../lib/Wintson";
import { ObjectId } from 'mongodb';
import restaurantTableModel from "../database/model.ts/restaurantTable";
import tableSlots from "../database/model.ts/tableSlots";

export class sellerRepository implements IRestaurantRepository {
  async findCredentials(
    data: Partial<RestaurantType>
  ): Promise<{
    restaurant: Partial<RestaurantType> | null;
    message: string;
    token: string | null;
    refreshToken: string | null;
  }> {
    console.log("Seller Respository . . . . . . . . . . . . . .");
    const { email, password } = data;
    try {
      const restaurant = await restaurantModel.findOne({ email: email });
      console.log(restaurant, email);
      let token = null,
        refreshToken = null,
        message = "";
      if (!restaurant) {
        message = "User not found";
      } else {
        if (restaurant.isApproved) {
          const hashedPassword = await bcrypt.compare(
            password as string,
            restaurant.password
          );
          if (!hashedPassword) {
            console.log("password is not match");
            message = "Invalid password";
          } else {
            token = jwtGenerateToken((restaurant._id as ObjectId).toString(), "seller");
            refreshToken = jwtGenerateRefreshToken((restaurant._id as ObjectId).toString());
            console.log(token);
          }
        } else {
          message = "Restaurant Not Found";
        }
      }
      if (restaurant && !message) {
        return {
          restaurant: restaurant.toObject(),
          message: "Login Successfull",
          token,
          refreshToken,
        };
      }
      console.log(message);
      return { restaurant: null, message, token, refreshToken };
    } catch (error) {
      console.log("!OOps Error in seller Reposiitory", error);
      throw error;
    }
  }
  async create(
    restaurant: RestaurantType
  ): Promise<{ restaurant: RestaurantType | null; message: string }> {
    try {
      const { restaurantName, email, password, contact } = restaurant;
      const newRestuarnt = new restaurantModel({
        restaurantName,
        email,
        contact,
        password,
      });
      await newRestuarnt.save();
      if (newRestuarnt) {
        nodemaileMailSeller(restaurant.email);
        return {
          restaurant: newRestuarnt.toObject(),
          message: "Restaurant registeration successfull.",
        };
      }
      return {
        restaurant: null,
        message: "Restaurant registeration successfull.",
      };
    } catch (error) {
      console.log("!OOps Error in seller Reposiitory" + error);
      throw error;
    }
  }

  async createRestaurantDetails(
    restaurant: RestaurantType,
    _id: string
  ): Promise<{ restaurant: Partial<RestaurantType>; message: string }> {
    try {
      const {
        restaurantName,
        email,
        contact,
        address,
        description,
        location,
        openingTime,
        closingTime,
        TableRate,
        featuredImage,
        secondaryImages,
        place_name,
      } = restaurant;
      console.log(location);
      const coordinates: [number, number] = [
        parseFloat(location.coordinates[0]),
        parseFloat(location.coordinates[1]),
      ];

      console.log(restaurant);
      const restaurantDetails = await restaurantModel.findByIdAndUpdate(
        _id,
        {
          restaurantName,
          contact,
          address,
          description,
          location: { type: location.type, coordinates },
          openingTime,
          closingTime,
          TableRate,
          featuredImage,
          secondaryImages,
          place_name,
        },
        { upsert: true, new: true }
      );
      return {
        restaurant: restaurantDetails.toObject(),
        message: "Restaurant details updated.",
      };
    } catch (error) {
      console.log("!OOps Error in seller Reposiitory" + error);
      throw error;
    }
  }

  async getProfile(_id: string): Promise<{ restaurant: any; message: string }> {
    try {
      const restaurant = await restaurantModel.findById({ _id });
      console.log(restaurant);
      return { restaurant, message: "" };
    } catch (error) {
      console.log("OOps an error occured in get restaurant profile : ", error);
      throw error;
    }
  }

  async createNewTableSlot(
    tabelSlotDatas: tableSlotTypes,
    restaurantId: string
  ): Promise<{ message: string; status: boolean }> {
    try {
      const { tableNumber, tableLocation, tableCapacity } = tabelSlotDatas;
      const restaurantData = await restaurantModel.findById(restaurantId);
      if (!restaurantData) {
        return {
          message: "Something went worng please try agin later",
          status: false,
        };
      }
      const newTableSlot = await restaurantTableModel.create({
        restaurantId: restaurantId,
        tableNumber: tableNumber,
        tableCapacity: tableCapacity,
        tableLocation: tableLocation,
      });
      console.log(newTableSlot);
      return { message: "Table Created..", status: true };
    } catch (error) {
      logger.error("OOps an error in createNeewTableSlot", error);
      throw error;
    }
  }

  async tableListDatas(
    restaurantId: string
  ): Promise<{ message: string; tableSlotDatas: object }> {
    try {
      console.log(restaurantId);
      const tableSlotDatas = await restaurantTableModel.find({ restaurantId });
      console.log(tableSlotDatas);
      return { message: "", tableSlotDatas };
    } catch (error) {
      logger.error("Oops error in table List repo : ", error);
      throw error;
    }
  }
  async tableSloteDatas(
    tableId: string
  ): Promise<{ message: string; tableSlotDatas: object }> {
    try {
      const tableSlotDatas = await tableSlots.find({ tableId });
      return { message: "Succesfull....", tableSlotDatas };
    } catch (error) {
      logger.error("Oops error in table List repo : ", error);
      throw error;
    }
  }
  async addTableTimeSloteDatas(
    tableSlotTimeData: {
      slotEndTime: string;
      slotStartTime: string;
      tableSlotDate: Date;
    },
    tableId: string
  ): Promise<{ message: string; status: boolean }> {
    try {
      const tableSlotDatas = await tableSlots.create({
        tableId: tableId,
        slotStartTime: tableSlotTimeData.slotStartTime,
        slotEndTime: tableSlotTimeData.slotEndTime,
        slotDate: tableSlotTimeData.tableSlotDate,
      });
      console.log(tableSlotDatas);
      return { message: "Added success.", status: true };
    } catch (error) {
      logger.error("Oops error in table List repo : ", error);
      throw error;
    }
  }
  async deleteTimeSlot(
    tableId: string
  ): Promise<{ message: string; status: boolean }> {
    try {
      const tableSlot = await tableSlots.findByIdAndDelete(tableId);
      return { message: "Deleted successfully", status: true };
    } catch (error) {
      logger.error("Oops error in table slot delete repo : ", error);
      throw error;
    }
  }
}
