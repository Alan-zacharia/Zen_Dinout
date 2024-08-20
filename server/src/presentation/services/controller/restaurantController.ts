import { NextFunction, Request, Response } from "express";
import { IRestaurantInteractor } from "../../../domain/interface/use-cases/ISellerInteractor";
import { setAuthTokenCookie } from "../../../functions/auth/cookieFunctions";
import logger from "../../../infrastructure/lib/Wintson";
import bookingModel from "../../../infrastructure/database/model.ts/bookingModel";
import timeSlotModel from "../../../infrastructure/database/model.ts/timeSlotModel";
import restaurantModel from "../../../infrastructure/database/model.ts/restaurantModel";
import {
  IRestaurant,
  RestaurantType,
} from "../../../domain/entities/restaurants";
import { MESSAGES, STATUS_CODES } from "../../../configs/constants";
import { AppError } from "../../middlewares/appError";
import formidable from "formidable";
import { uploadImages } from "../shared/imageService";
import { handleImageUploads } from "../../../infrastructure/helper/ImageUploadHelper";
import { prepareFromidableData } from "../../../application/helpers/dataPreperationHelpers";
import { parseFormData } from "../../../application/helpers/formParsingHelper";
import TimeSlot from "../../../infrastructure/database/model.ts/restaurantTimeSlot";
import { convertToUTCWithOffset } from "../../../application/helpers/timeConvertionHelper";
import tableSlots from "../../../infrastructure/database/model.ts/tableSlots";
import restaurantTableModel from "../../../infrastructure/database/model.ts/restaurantTable";
export class sellerController {
  constructor(private readonly interactor: IRestaurantInteractor) {}

  public async restaurantLoginController(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const { email, password } = req.body;
    try {
      const result = await this.interactor.Login({
        email,
        password,
      });
      const { restaurant, message, token, refreshToken } = result;
      if (!restaurant) {
        return res
          .status(STATUS_CODES.UNAUTHORIZED)
          .json({ message, token: null });
      }
      if (refreshToken) setAuthTokenCookie(res, "refreshToken", refreshToken);
      return res
        .status(STATUS_CODES.OK)
        .json({ message, restaurant: restaurant, token, refreshToken });
    } catch (error) {
      logger.error(
        `Error during restaurant login : ${(error as Error).message}`
      );
      next(
        new AppError(
          (error as Error).message,
          STATUS_CODES.INTERNAL_SERVER_ERROR
        )
      );
    }
  }

  public async restaurantRegisterationController(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    console.log("Restauarant registeration service ...........");
    const credentials: IRestaurant = req.body;
    try {
      const result = await this.interactor.restaurantRegisteration(
        credentials
      );
      const { message, restaurant } = result;
      if (!restaurant) {
        return res.status(STATUS_CODES.BAD_REQUEST).json({ message });
      }
      return res.status(STATUS_CODES.CREATED).json({ message });
    } catch (error) {
      logger.error(
        `Error during restaurant register :${(error as Error).message}`
      );
      next(
        new AppError(
          (error as Error).message,
          STATUS_CODES.INTERNAL_SERVER_ERROR
        )
      );
    }
  }

  public async restaurantProfileUpdateController(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    console.log("Restaurant update .......");
    const restaurantId = req.userId;
    try {
      const { fields, files } = await parseFormData(req);
      const datas: any = { ...fields };
      if (files.featuredImage) {
        const featuredFile = Array.isArray(files.featuredImage)
          ? files.featuredImage[0]
          : files.featuredImage;
        datas.featuredImage = await handleImageUploads(featuredFile.filepath);
      }
      if (files.secondaryImages) {
        const filePaths = Array.isArray(files.secondaryImages)
          ? (files.secondaryImages as formidable.File[]).map(
              (file) => file.filepath
            )
          : [(files.secondaryImages as formidable.File).filepath];
        datas.secondaryImages = await handleImageUploads(filePaths);
      }
      const restaurantDetails = await prepareFromidableData(datas);
      const result = await this.interactor.restaurantProfileUpdateInteractor(
        restaurantDetails,
        restaurantId
      );
      const { message, restaurant } = result;
      if (!restaurant) {
        return res
          .status(STATUS_CODES.BAD_REQUEST)
          .json({ message: MESSAGES.SOMETHING_WENT_WRONG });
      }
      return res.status(STATUS_CODES.CREATED).json({ message, restaurant });
    } catch (error) {
      logger.error(`Error in update profile: ${(error as Error).message}`);
      next(
        new AppError(
          (error as Error).message,
          STATUS_CODES.INTERNAL_SERVER_ERROR
        )
      );
    }
  }

  public async deleteRestaurantImageController(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    console.log("Deleting restaurant images...");
    const imageIds: string[] = Array.isArray(req.query.ids)
      ? (req.query.ids as string[])
      : [req.query.ids as string];
    const restaurantId = req.userId;
    try {
      const result = await this.interactor.deleteRestaurantImageInteractor(
        restaurantId,
        imageIds
      );
      const { message, status } = result;
      if (!status) {
        return res
          .status(STATUS_CODES.NOT_FOUND)
          .json({ status, message: MESSAGES.SOMETHING_WENT_WRONG });
      }
      return res.status(STATUS_CODES.OK).json({ status, message });
    } catch (error) {
      logger.error(`Error in deleting images: ${(error as Error).message}`);
      next(
        new AppError(
          (error as Error).message,
          STATUS_CODES.INTERNAL_SERVER_ERROR
        )
      );
    }
  }
  public async deleteRestaurantFeaturedImageController(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    console.log("Deleting restaurant image...");
    const restaurantId = req.userId;
    const imageId = req.query.imageId as string;
    try {
      const result =
        await this.interactor.deleteRestaurantFeaturedImageInteractor(
          restaurantId,
          imageId
        );
      const { message, status } = result;
      return res.status(STATUS_CODES.OK).json({ message, status });
    } catch (error) {
      logger.error(`Error in deleting image : ${(error as Error).message}`);
      next(
        new AppError(
          (error as Error).message,
          STATUS_CODES.INTERNAL_SERVER_ERROR
        )
      );
    }
  }

  public async createTableController(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    console.log("Adding table ....");
    const restaurantId = req.userId;
    try {
      const { fields, files } = await parseFormData(req);
      const datas: any = { ...fields };
      if (files.tableImage) {
        const imageFile = Array.isArray(files.tableImage)
          ? files.tableImage[0]
          : files.tableImage;
        datas.tableImage = await handleImageUploads(imageFile.filepath);
      }
      const tableDatas = await prepareFromidableData(datas);
      console.log(tableDatas);
      const { message, status, newTableSlot } =
        await this.interactor.createTableInteractor(tableDatas, restaurantId);
      if (!status) {
        return res.status(STATUS_CODES.NOT_FOUND).json({ message, status });
      }
      return res
        .status(STATUS_CODES.CREATED)
        .json({ message, status, newTableSlot });
    } catch (error) {
      logger.error(`Error in adding table : ${(error as Error).message}`);
      next(
        new AppError(
          (error as Error).message,
          STATUS_CODES.INTERNAL_SERVER_ERROR
        )
      );
    }
  }
  public async deleteRestaurantTableController(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    console.log("Restaurant Table delete .......");
    const { tableId } = req.params;
    try {
      const { message, status } =
        await this.interactor.deleteRestaurantTableInteractor(tableId);
      if (!status) {
        return res.status(STATUS_CODES.NOT_FOUND).json({ message, status });
      }
      return res.status(STATUS_CODES.OK).json({ message, status });
    } catch (error) {
      logger.error(`Error in deleting table : ${(error as Error).message}`);
      next(
        new AppError(
          (error as Error).message,
          STATUS_CODES.INTERNAL_SERVER_ERROR
        )
      );
    }
  }

  public async createTimeSlotController(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    console.log("Create time slot ....");
    const restaurantId = req.userId;
    const { timeSlotData } = req.body;
    console.log(timeSlotData);
    try {
      const { message, status, timeSlot } =
        await this.interactor.createTimeSlotInteractor(
          timeSlotData,
          restaurantId
        );
      return res.status(STATUS_CODES.CREATED).json({
        message: MESSAGES.RESOURCE_CREATED,
        addedSlot: timeSlot,
        status,
      });
    } catch (error) {
      logger.error(`Error creating time slot : ${(error as Error).message}`);
      next(
        new AppError(
          (error as Error).message,
          STATUS_CODES.INTERNAL_SERVER_ERROR
        )
      );
    }
  }
  public async createTableTimeSlotController(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    console.log("Create table time slot ....");
    const restaurantId = req.userId;
    const { newSlot } = req.body;
    console.log(req.body);
    const { date, time, maxTables } = newSlot;
    try {
      const slotTime = convertToUTCWithOffset(time, 5, 30);
      const table = await restaurantTableModel.find({restaurantId});
      if(table.length < maxTables){
        return res.status(400).json({message : "Max tables must be less than your tables count.."});
      }
      const newSlot = new TimeSlot({
        restaurantId,
        date,
        time: slotTime,
        maxTables,
      });
      await newSlot.save();
      return res.status(201).json(newSlot);
    } catch (error) {
      logger.error(`Error creating time slot : ${(error as Error).message}`);
      next(
        new AppError(
          (error as Error).message,
          STATUS_CODES.INTERNAL_SERVER_ERROR
        )
      );
    }
  }
  public async getTableTimeSlotController(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const restaurantId = req.userId;
    try {
      const timeSlots = await TimeSlot.find({
        restaurantId,
        date: req.params.date,
      });
      console.log(timeSlots);
      res.json(timeSlots);
    } catch (error) {
      logger.error(`Error creating time slot : ${(error as Error).message}`);
      next(
        new AppError(
          (error as Error).message,
          STATUS_CODES.INTERNAL_SERVER_ERROR
        )
      );
    }
  }
  public async updateTimeSlotAvailable(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    console.log("Update time slot availability......");
    const { id, isAvailable } = req.params;
    try {
      const timeSlots = await TimeSlot.findByIdAndUpdate(id, {
        isAvailable: isAvailable,
      });
      console.log(timeSlots);
      res.json(timeSlots);
    } catch (error) {
      logger.error(`Error update time slot : ${(error as Error).message}`);
      next(
        new AppError(
          (error as Error).message,
          STATUS_CODES.INTERNAL_SERVER_ERROR
        )
      );
    }
  }

  //////////////////

  public async getRestaurantTableController(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    console.log("Get Restaurant tables........");
    const restaurantId = req.userId;
    try {
      const { message, tables } =
        await this.interactor.getRestaurantTableInteractor(restaurantId);
      return res.status(200).json({ tables, message });
    } catch (error) {
      logger.error(
        `Oops an error during in Restaurant tables : ${
          (error as Error).message
        }`
      );
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  public async updateRestaurantTableIsAvailableController(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    console.log("Restaurant Table update isAvailable .......");
    const { tableId } = req.params;
    const isAvailable = req.body.isAvailable;
    try {
      console.log(tableId);
      const { message, status } =
        await this.interactor.updateRestaurantTableIsAvailableInteractor(
          tableId,
          isAvailable
        );
      if (!status) {
        return res.status(500).json({ message, status });
      }
      return res.status(200).json({ message, status });
    } catch (error) {
      logger.error(`Error in table delete : ${(error as Error).message}`);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  //////////////////////////////////////

  public async restuarntDetails(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    console.log("Restaurant profile ....");
    const { restaurantId } = req.params;
    console.log(restaurantId);

    try {
      const { restaurant } = await this.interactor.sellerProfileInteractor(
        restaurantId
      );
      return res.status(201).json({ restaurantDetails: restaurant });
    } catch (error) {
      logger.error(
        "Oops an error during in restaurant details : ",
        (error as Error).message
      );
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  public async addMenu(req: Request, res: Response, next: NextFunction) {
    console.log("Adding Menu ....");
    const { itemImage } = req.body;
    console.log(req.body);
    try {
      // const menuAdd = new menuModel({
      //   menuImage : itemImage,
      //   restaurantId : req.userId
      // })
      return res.status(201).json({ message: "hghh" });
    } catch (error) {
      logger.error(
        "Oops an error during in restaurant details : ",
        (error as Error).message
      );
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  public async getRestaurantTablesTimeSlots(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    console.log("Get Restaurant table slots");
    const { tableId } = req.params;
    try {
      const { message, tableSlotDatas } =
        await this.interactor.getRestaurantTableSlotsInteractor(tableId);
      return res.status(200).json({ tableSlotDatas, message });
    } catch (error) {
      logger.error(
        "Oops an error during in seller logout service:",
        (error as Error).message
      );
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  public async removeTimeSlotController(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    console.log("Restaurant time slot remove .......");
    const { timeSlotId } = req.params;
    try {
      await timeSlotModel.findByIdAndDelete(timeSlotId);
      return res
        .status(201)
        .json({ message: "Removed Succefully...", status: true });
    } catch (error) {
      logger.error(
        `Oops an error in  time slot remove service ! 
        ${(error as Error).message}`
      );
      return res.status(500).json({ message: "Internal server error" });
    }
  }
  public async deleteTableTimeSlot(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    console.log("Restaurant Table time slot deletion .......");
    const { tableId } = req.body;
    try {
      const { message, status } =
        await this.interactor.deleteTableSlotInteractor(tableId);
      if (!status) {
        return res.status(500).json({ message: "Something went wrong." });
      }
      return res.status(201).json({ message, status });
    } catch (error) {
      logger.error(
        "Oops an error in restaurant updation service !",
        (error as Error).message
      );
      return res.status(500).json({ message: "Internal server error" });
    }
  }
  public async getReservations(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    console.log("Reservation details .......");
    const restaurantId = req.userId;
    try {
      const Reservations = await bookingModel
        .find({ restaurantId: restaurantId })
        .populate("userId", "username email")
        .populate("restaurantId", "restaurantName")
        .sort({ createdAt: -1 });
      return res.status(201).json({ message: "Reservtions....", Reservations });
    } catch (error) {
      logger.error(
        "Oops an error in restaurant updation service !",
        (error as Error).message
      );
      return res.status(500).json({ message: "Internal server error" });
    }
  }
  public async getSingleReservationDetails(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    console.log("Restaurant user reservation detail .......");
    const bookingId = req.params.bookingId;
    try {
      const bookingDetails = await bookingModel
        .findOne({ bookingId: bookingId })
        .populate("userId", "username email");
      if (!bookingDetails) {
        return res
          .status(404)
          .json({ message: "Invalid booking Id...", bookingDetails: null });
      }
      return res
        .status(201)
        .json({ message: "Reservtions....", bookingDetails });
    } catch (error) {
      logger.error(
        "Oops an error in restaurant updation service !",
        (error as Error).message
      );
      return res.status(500).json({ message: "Internal server error" });
    }
  }
  public async getTableTimeSlotsController(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    console.log("Restaurant time slots details.......");
    const restaurantId = req.userId;
    try {
      const timeSlots = await timeSlotModel
        .find({
          restaurantId: restaurantId,
        })
        .sort({ createdAt: -1 });
      if (!timeSlots) {
        return res.status(200).json({ timeSlots: [] });
      }
      return res.status(200).json({ message: "Time slots....", timeSlots });
    } catch (error) {
      logger.error(
        "Oops an error in restaurant updation service !",
        (error as Error).message
      );
      return res.status(500).json({ message: "Internal server error" });
    }
  }
  public async updateBookingStatus(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    console.log("Restaurant booking status update .......");
    const bookingId = req.params.bookingId;
    const bookingStatus = req.body.statusData;
    console.log(req.body, req.params);
    try {
      const bookingDetails = await bookingModel
        .findOneAndUpdate(
          { bookingId: bookingId },
          { bookingStatus: bookingStatus }
        )
        .populate("userId", "username email");
      return res
        .status(201)
        .json({ message: "Status updated...", bookingDetails });
    } catch (error) {
      logger.error(
        "Oops an error in restaurant updation service !",
        (error as Error).message
      );
      return res.status(500).json({ message: "Internal server error" });
    }
  }
  public async updateRestaurantTimeSlotController(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    console.log("Restaurant timeslot available , update .......");
    const { timeSlotId } = req.params;
    const { isAvailable } = req.body;
    console.log(timeSlotId);
    try {
      const { message, status } =
        await this.interactor.updateRestaurantTimeSlotIsAvailableInteractor(
          timeSlotId,
          isAvailable
        );
      if (!status) {
        return res.status(500).json({ message, status });
      }
      return res.status(200).json({ message, status });
    } catch (error) {
      logger.error(
        "Oops an error in restaurant updation service !",
        (error as Error).message
      );
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  public async sellerLogout(req: Request, res: Response, next: NextFunction) {
    console.log("Logout Seller");
    try {
      res.cookie("seller_auth", "", {
        expires: new Date(0),
      });
      res.send();
    } catch (error) {
      logger.error(
        "Oops an error during in seller logout service:",
        (error as Error).message
      );
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  public async addNewTableTimeSlot(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    console.log("Adding table time slot ....");
    const { tableSlotTimeData, tableId } = req.body;
    console.log(tableSlotTimeData);
    try {
      const { message, status } =
        await this.interactor.createTableTimeSlotInteractor(
          tableSlotTimeData,
          tableId
        );
      if (!status) {
        return res.status(500).json({ message, status });
      }
      return res.status(201).json({ message, status });
    } catch (error) {
      logger.error(
        "Oops an error during in restaurant details : ",
        (error as Error).message
      );
      return res.status(500).json({ message: "Internal server error" });
    }
  }
}
