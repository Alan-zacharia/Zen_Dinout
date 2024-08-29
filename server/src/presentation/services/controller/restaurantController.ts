import { NextFunction, Request, Response } from "express";
import { IRestaurantInteractor } from "../../../domain/interface/use-cases/IRestaurantInteractor";
import logger from "../../../infrastructure/lib/Wintson";
import { RestaurantType } from "../../../domain/entities/RestaurantType";
import {
  MESSAGES,
  STATUS_CODES,
  SUCCESS_MESSAGES,
} from "../../../configs/constants";
import { AppError } from "../../middlewares/appError";
import formidable from "formidable";
import { handleImageUploads } from "../../../infrastructure/helper/ImageUploadHelper";
import { prepareFromidableData } from "../../../application/helpers/dataPreperationHelpers";
import { parseFormData } from "../../../application/helpers/formParsingHelper";
import { convertToUTCWithOffset } from "../../../application/helpers/timeConvertionHelper";
import { setAuthTokenCookie } from "../../../infrastructure/utils/cookieUtils";
export class sellerController {
  constructor(private readonly interactor: IRestaurantInteractor) {}

  public async loginRestaurantController(
    req: Request,
    res: Response, 
    next: NextFunction
  ) {
    const { email, password } = req.body;
    try {
      const result = await this.interactor.loginRestaurantInteractor({
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
        .json({ message, restaurant, token, refreshToken });
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

  public async registerRestaurantController(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    console.log("Restauarant register service ...........");
    const credentials: RestaurantType = req.body;
    try {
      const result = await this.interactor.registerRestaurantInteractor(
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

  public async getRestaurantDetailController(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    console.log("Restaurant profile ....");
    const restaurantId = req.userId;
    try {
      const { restaurant } =
        await this.interactor.getRestaurantDetailInteractor(restaurantId);
      if (!restaurant) {
        return res
          .status(STATUS_CODES.NOT_FOUND)
          .json({ message: "Restaurant not found" });
      }
      return res.status(STATUS_CODES.OK).json({
        restaurantDetails: restaurant,
        message: SUCCESS_MESSAGES.FETCHED_SUCCESSFULLY,
      });
    } catch (error) {
      logger.error(`Error in restaurant profile :${(error as Error).message}`);
      next(
        new AppError(
          (error as Error).message,
          STATUS_CODES.INTERNAL_SERVER_ERROR
        )
      );
    }
  }

  public async getReservationListController(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    console.log("Reservation details .......");
    const restaurantId = req.userId;
    try {
      const { message, reservationDetails } =
        await this.interactor.getReservationListInteractor(restaurantId);
      return res
        .status(STATUS_CODES.OK)
        .json({ message, Reservations: reservationDetails });
    } catch (error) {
      logger.error(
        `Error in get reservation list :${(error as Error).message}`
      );
      next(
        new AppError(
          (error as Error).message,
          STATUS_CODES.INTERNAL_SERVER_ERROR
        )
      );
    }
  }

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
      return res.status(STATUS_CODES.OK).json({ tables, message });
    } catch (error) {
      logger.error(`Error in get tables :${(error as Error).message}`);
      next(
        new AppError(
          (error as Error).message,
          STATUS_CODES.INTERNAL_SERVER_ERROR
        )
      );
    }
  }
  public async getTimeSlotController(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    console.log("Get Time Slots .....");
    const restaurantId = req.userId;
    const date = req.params.date ? req.params.date : new Date().toISOString();
    console.log(date);
    try {
      const { message, timeSlots } =
        await this.interactor.getTimeSlotInteractor(restaurantId, date);

      console.log(timeSlots);
      res.json(timeSlots);
    } catch (error) {
      logger.error(`Error in get time slot : ${(error as Error).message}`);
      next(
        new AppError(
          (error as Error).message,
          STATUS_CODES.INTERNAL_SERVER_ERROR
        )
      );
    }
  }
  public async getReservationController(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    console.log("Restaurant user reservation details .......");
    const reservationId = req.params.reservationId;
    try {
      const { reservation, message } =
        await this.interactor.getReservationInteractor(reservationId);
      if (!reservation) {
        return res
          .status(STATUS_CODES.NOT_FOUND)
          .json({ message: MESSAGES.INVALID_FORMAT, bookingDetails: null });
      }
      return res
        .status(STATUS_CODES.OK)
        .json({ message, bookingDetails: reservation });
    } catch (error) {
      logger.error(
        `Error in get reservation detail : ${(error as Error).message}`
      );
      next(
        new AppError(
          (error as Error).message,
          STATUS_CODES.INTERNAL_SERVER_ERROR
        )
      );
    }
  }
  public async updateReservationStatusController(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    console.log("Restaurant reservation status update .......");
    const { reservationId } = req.params;
    const bookingStatus = req.body.statusData;
    try {
      const { message, reservation } =
        await this.interactor.updateReservationInteractor(
          reservationId,
          bookingStatus
        );
      if (!reservation) {
        return res
          .status(STATUS_CODES.NOT_FOUND)
          .json({ message, bookingDetails: null });
      }
      return res
        .status(STATUS_CODES.CREATED)
        .json({ message, bookingDetails: reservation });
    } catch (error) {
      logger.error(
        `Error in udpate reservation detail : ${(error as Error).message}`
      );
      next(
        new AppError(
          (error as Error).message,
          STATUS_CODES.INTERNAL_SERVER_ERROR
        )
      );
    }
  }

  public async createRestaurantTableController(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    console.log("Creating table ....");
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
      const { message, newTable } =
        await this.interactor.createRestaurantTableInteractor(
          restaurantId,
          tableDatas
        );
      return res.status(STATUS_CODES.CREATED).json({ message, newTable });
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
    console.log("Deleting table ....");
    const tableId = req.params.tableId;
    try {
      const { message, status } =
        await this.interactor.deleteRestaurantTableInteractor(tableId);
      if (!status) {
        return res.status(STATUS_CODES.BAD_REQUEST).json({ message, status });
      }
      return res.status(STATUS_CODES.NO_CONTENT).json({ message, status });
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
    console.log("Create table time slot ....");
    const restaurantId = req.userId;
    const { newSlotData } = req.body;
    console.log(req.body);
    const { date, time, maxTables } = newSlotData;
    try {
      const slotTime = convertToUTCWithOffset(time, 5, 30);
      const { message, newSlot } =
        await this.interactor.createTimeSlotInteractor(
          restaurantId,
          newSlotData
        );
      return res.status(STATUS_CODES.CREATED).json({ newSlot, message });
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
        restaurantId,
        restaurantDetails
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
      if (!status) {
        return res.status(STATUS_CODES.BAD_REQUEST).json({ message, status });
      }
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
  public async deleteRestaurantSecondaryImagesController(
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
      const result =
        await this.interactor.deleteRestaurantSecondaryImagesInteractor(
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

  public async updateRestaurantTableIsAvailableController(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    console.log("Restaurant Table update isAvailable .......");
    const { tableId } = req.params;
    const isAvailable = req.body.isAvailable;
    try {
      console.log(tableId, isAvailable);

      const { message, status } =
        await this.interactor.updateRestaurantTableIsAvailableInteractor(
          tableId,
          isAvailable
        );
      if (!status) {
        return res.status(STATUS_CODES.NOT_FOUND).json({ message, status });
      }
      return res.status(STATUS_CODES.CREATED).json({ message, status });
    } catch (error) {
      logger.error(
        `Error in update table avaialbility : ${(error as Error).message}`
      );
      next(
        new AppError(
          (error as Error).message,
          STATUS_CODES.INTERNAL_SERVER_ERROR
        )
      );
    }
  }
  public async updateRestaurantTimeSlotAvailableController(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    console.log("Update time slot availability......");
    const { timeSlotId } = req.params;
    const isAvailable = req.query.available as string;
    const available = isAvailable == "true";
    console.log(isAvailable, available);
    try {
      const result =
        await this.interactor.updateRestaurantTimeSlotAvailableInteractor(
          timeSlotId,
          available
        );
      const { message, status } = result;
      return res.status(STATUS_CODES.OK).json({ message, status });
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
}
