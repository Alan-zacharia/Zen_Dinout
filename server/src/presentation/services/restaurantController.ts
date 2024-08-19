import { NextFunction, Request, Response } from "express";
import { IRestaurantInteractor } from "../../domain/interface/use-cases/ISellerInteractor";
import { setAuthTokenCookie } from "../../functions/auth/cookieFunctions";
import logger from "../../infrastructure/lib/Wintson";
import { validationResult } from "express-validator";

export class sellerController {
  constructor(private readonly interactor: IRestaurantInteractor) {}

  async restaurantLogin(req: Request, res: Response, next: NextFunction) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorMessage = errors.array()[0].msg;
      return res.status(400).json({ message: errorMessage });
    }
    console.log("Restaurant login service......");
    const { email, password } = req.body;
    try {
      const { restaurant, token, message, refreshToken } =
        await this.interactor.Login({ email, password });
      if (!restaurant) {
        return res.status(401).json({ message, token: null });
      }
      if (refreshToken) setAuthTokenCookie(res, "refreshToken", refreshToken);
      logger.error("Restaurant logged in successfully");
      return res
        .status(200)
        .json({ message, user: restaurant, token, refreshToken });
    } catch (error) {
      logger.error(
        "Oops error during in seller Login :",
        (error as Error).message
      );
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  async restaurantRegisteration(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    console.log("Restauarant registeration service ...........");
    const { credentials } = req.body;
    try {
      const { message, restaurant } =
        await this.interactor.restaurantRegisteration(credentials);
      if (!restaurant) {
        logger.error("Failed to register restautant....");
        return res.status(401).json({ message });
      }
      return res.status(201).json({ message });
    } catch (error) {
      logger.error(
        "Oops error in restaurant registeration service !",
        (error as Error).message
      );
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  async restaurantUpdation(req: Request, res: Response, next: NextFunction) {
    console.log("Restaurant updation .......");
    const { datas, restaurantId } = req.body;
    try {
      const { message, restaurant } =
        await this.interactor.restaurantDetailsUpdateInteractor(
          datas,
          restaurantId
        );
      if (!restaurant) {
        return res
          .status(401)
          .json({ message: "Restaurant Registeration Failed" });
      }
      return res.status(201).json({ message });
    } catch (error) {
      logger.error(
        "Oops an error in restaurant updation service !",
        (error as Error).message
      );
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  async restuarntDetails(req: Request, res: Response, next: NextFunction) {
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
  async addNewTableSlot(req: Request, res: Response, next: NextFunction) {
    console.log("Adding table ....");
    const { tableAddingDatas, restaurantId } = req.body;
    try {
      const { message, status } =
        await this.interactor.createTableSlotInteractor(
          tableAddingDatas,
          restaurantId
        );
      if (!status) {
        return res.status(401).json({ message, status });
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

  async addNewTableTimeSlot(req: Request, res: Response, next: NextFunction) {
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
        return res.status(401).json({ message, status });
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

  async getRestaurantTables(req: Request, res: Response, next: NextFunction) {
    console.log("Get Restaurant tables");
    const { restaurantId } = req.params;
    console.log(restaurantId);
    try {
      const { message, tableSlotDatas } =
        await this.interactor.getRestaurantTableInteractor(restaurantId);
      return res.status(200).json({ tableSlotDatas, message });
    } catch (error) {
      logger.error(
        "Oops an error during in seller logout service:",
        (error as Error).message
      );
      return res.status(500).json({ message: "Internal server error" });
    }
  }
  async getRestaurantTablesTimeSlots(
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

  async deleteTableTimeSlot(req: Request, res: Response, next: NextFunction) {
    console.log("Restaurant Table time slot deletion .......");
    const { tableId } = req.body;
    try {
      const { message, status } =
        await this.interactor.deleteTableSlotInteractor(tableId);
      if (!status) {
        return res.status(401).json({ message: "Something went wrong." });
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

  async sellerLogout(req: Request, res: Response, next: NextFunction) {
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
}
