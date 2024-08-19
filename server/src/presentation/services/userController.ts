import { Response, Request, NextFunction } from "express";
import { IUserInteractor } from "../../domain/interface/use-cases/IUserInteractor";
import { UserType } from "../../domain/entities/User";
import { validationResult } from "express-validator";
import restaurantModel from "../../infrastructure/database/model.ts/restaurantModel";
import { setAuthTokenCookie } from "../../functions/auth/cookieFunctions";
import logger from "../../infrastructure/lib/Wintson";
import configuredKeys from "../../configs/config";
import Stripe from "stripe";
import restaurantTableModel from "../../infrastructure/database/model.ts/restaurantTable";
import tableSlots from "../../infrastructure/database/model.ts/tableSlots";
import { jwtGenerateRefreshToken } from "../../functions/auth/jwtTokenFunctions";
import UserModel from "../../infrastructure/database/model.ts/userModel";
import { createPayment } from "../../functions/booking/paymentIntegration";
import { paymentUserDataRetreival } from "../../functions/booking/paymentUserDataRetrieval";

const stripe = new Stripe(configuredKeys.STRIPE_SECRET_KEY);

export class userController {
  constructor(private readonly interactor: IUserInteractor) {}

  /**
   * User Login service
   * @param credentials - Object containing email and password for login
   * @method - POST METHOD
   * @returns Object containing user data, message, token, and refreshToken
   */
  async userLogin(req: Request, res: Response, next: NextFunction) {
    console.log("User Login Service..........");
    try {
      const { email } = req.body;
      const userPassword = req.body.password;
      console.log(email, userPassword);
      const { user, token, message, refreshToken } =
        await this.interactor.userLoginInteractor({
          email,
          password: userPassword,
        });
      if (!user) {
        logger.info("User Login failed......");
        return res
          .status(401)
          .json({ message, token: null, refreshToken: null });
      }
      if (refreshToken) setAuthTokenCookie(res, "refreshToken", refreshToken);
      logger.info("User Login successfull....");
      return res.status(200).json({ message, user, token, refreshToken });
    } catch (error) {
      logger.error(` OOps ! error during Login: `, error);
      return res.status(500).send("Internal server error");
    }
  }

  /**
   * User Registeration service
   * @param credentials - Object containing username , email and
   * password  for registeration.
   * @method - POST METHOD
   * @returns Object containing message, token , and refreshToken
   */
  async userRegister(req: Request, res: Response, next: NextFunction) {
    console.log("User Register service..........");
    try {
      let credentials: UserType = req.body;
      const { user, message } = await this.interactor.userRegisterInteractor(
        credentials
      );
      if (!user) {
        logger.error("User regestration failed....");
        return res.status(500).json({ message: "Failed to register user" });
      }
      logger.info("User regestration success....");
      return res.status(201).json({ message, user });
    } catch (error) {
      console.error(
        "Oops an error during in register service .........! : ",
        error
      );
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  /**
   * Genrate otp service
   * @param data - email for otp generation
   * @method - POST METHOD
   * @return  otp to users mail
   */
  async generateOtp(req: Request, res: Response, next: NextFunction) {
    console.log("Generate otp service.....");
    try {
      const { email } = req.body;
      const { message, otp } = await this.interactor.generateOtpInteractor(
        email
      );
      return res.status(200).json({ otp, message });
    } catch (error) {
      logger.error("Oops an error during in otp service ! :", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  /**
   * Get Restaurants service
   * @method - GET METHOD
   * @return  All approved restaurants List
   */
  async getRestaurants(req: Request, res: Response, next: NextFunction) {
    console.log("Get Restaurants service.....");
    try {
      const { listedRestaurants } =
        await this.interactor.getListedRestaurantsInteractor();
      logger.info("Get restaurants....");
      return res
        .status(200)
        .json({ restaurant: listedRestaurants, message: "succesfull" });
    } catch (error) {
      logger.error("Oops an error during get restaurants list service:", error);
      return res.status(500).send("Internal server error");
    }
  }
  /**
   * Get user service
   * @method - GET METHOD
   * @return  All approved user
   */
  async getUserData(req: Request, res: Response, next: NextFunction) {
    console.log("Get user data service.....");
    const { userId } = req.params;
    try {
      const userData = await UserModel.findById({ _id: userId });
      console.log(userData);
      return res.status(200).json({ userData, message: "succesfull" });
    } catch (error) {
      logger.error("Oops an error during get restaurants list service:", error);
      return res.status(500).send("Internal server error");
    }
  }
  /**
   * Get user service
   * @method - GET METHOD
   * @return  All images of this restaurantId
   */
  async getRestaurantImages(req: Request, res: Response, next: NextFunction) {
    console.log("Get restaurant Images data service.....");
    const { restaurantId } = req.params;
    let listedRestaurantImages = [];
    try {
      const restaurantDetails = await restaurantModel.findById({
        _id: restaurantId,
      });
      listedRestaurantImages.push(restaurantDetails?.featuredImage);
      restaurantDetails?.secondaryImages.forEach((image: string) => {
        listedRestaurantImages.push(image);
      });
      console.log(restaurantDetails);
      return res
        .status(200)
        .json({
          listedRestaurantImages,
          restaurantDetails,
          message: "succesfull",
        });
    } catch (error) {
      logger.error("Oops an error during get restaurants list service:", error);
      return res.status(500).send("Internal server error");
    }
  }

  /**
   * Restaurant Detail service
   * @params - restaurantId
   * @method - Get METHOD
   * @return  restaurant details
   */
  async restaurantDetails(req: Request, res: Response, next: NextFunction) {
    console.log("Restaurants service.....");
    const { restaurantId } = req.params;

    try {
      const restaurant = await restaurantModel.findById(restaurantId);
      return res.status(200).json({ restaurant, message: "succesfull" });
    } catch (error) {
      logger.error("Oops an error during in restaurant detail service:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  /**
   * Reset password service for get email
   * @body   -  User Email address
   * @method - POST METHOD
   * @return  message and success
   */
  async resetPasswordGetUser(req: Request, res: Response, next: NextFunction) {
    console.log("Reset password service.........");
    const { email } = req.body;
    try {
      const { message, success } =
        await this.interactor.resetPasswordInteractor(email);
      if (!success) return res.status(401).json({ message, success });
      return res
        .status(200)
        .json({ message: "Reset Link sent to your email", success });
    } catch (error) {
      logger.error(
        "Oops an error during in reset password data getting service:",
        error
      );
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  /**
   * Reset password Updation service
   * @body   - credential contain password
   * @method - PUT METHOD
   * @return  message and status
   */
  async resetPasswordUpdate(req: Request, res: Response, next: NextFunction) {
    console.log("Reset Password Updation service......");
    const { credentials } = req.body;
    try {
      const { id } = req.params;
      const userId = id.split(":");
      console.log(userId[1]);
      const { message, status } =
        await this.interactor.resetPasswordChangeInteractor(
          userId[1],
          credentials.password
        );
      if (!status) return res.status(401).json({ message, status });
      return res.status(201).json({ message, status });
    } catch (error) {
      logger.error("Oops an error during in reset password service:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }
  /**
   * Update user details service
   * @body   - credential contain user details
   * @method - PUT METHOD
   * @return  userData , message and status
   */
  async updateUserDetails(req: Request, res: Response, next: NextFunction) {
    console.log("Update user details service......");
    const { credentials } = req.body;
    console.log(req.body);
    try {
      const { id } = req.params;
      const { updatedUser, status } =
        await this.interactor.updateUserDetailsInteractor(id, credentials);
      if (!status)
        return res
          .status(401)
          .json({ message: "Failed to update", status, updatedUser });
      return res
        .status(201)
        .json({ message: "Updated successfull...", updatedUser, status });
    } catch (error) {
      logger.error("Oops an error during in reset password service:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  /**
   * Google login service
   * @body   - credential contain user data
   * @method - POST METHOD
   * @return   message and status
   */
  async googleLoginService(req: Request, res: Response, next: NextFunction) {
    console.log("Google login user");

    try {
      console.log(req.body);
      const { user, message, token, refreshToken } =
        await this.interactor.googleLoginInteractor(req.body);

      if (user) {
        setAuthTokenCookie(res, "access_token_u", token);
      }
      return res.status(201).json({ message, token, user, refreshToken });
    } catch (error) {
      logger.error(
        "Oops an error during in google Login service .......!",
        error
      );
      return res.status(500).json({ message: "Internal server error" });
    }
  }
  /**
   * Get User profile service
   * @method - GET METHOD
   * @return  User Details
   */
  async getProfile(req: Request, res: Response, next: NextFunction) {
    console.log(req.userId);
    console.log("User Profile service........");
    const { userId } = req.params;
    try {
      const { userDetails, status } =
        await this.interactor.getProfileInteractor(userId);
      console.log(userDetails);
      if (!status) {
        return res
          .status(400)
          .json({ message: "Failed to fetch the data", userData: null });
      }
      return res
        .status(200)
        .json({ message: "User Details....", userData: userDetails });
    } catch (error) {
      logger.error("Oops an error occured in getProfile service......", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  async createPayment(req: Request, res: Response) {
    logger.info("Create payment.....");
    const {
      restaurantDatas,
      userEmail,
      userUsername,
      restaurantId,
      tableSlotId,
    } = req.body;
    console.log(
      restaurantDatas,
      userEmail,
      userUsername,
      restaurantId,
      tableSlotId
    );
    try {
      const totalCost = restaurantDatas.price * restaurantDatas.Quantity;
      const session = await createPayment(
        { userEmail, userUsername },
        totalCost
      );
      console.log(session);
      return res.status(200).json({ sessionId: session.id });
    } catch (error: any) {
      console.log("Oops an error in payment : ", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  };

  async bookingCompletion(req : Request , res : Response , next : NextFunction){
   try{
    const paymentIntentId = req.body.paymentIntentId;
    const paymentIntent = await paymentUserDataRetreival(paymentIntentId);
    if(!paymentIntent) {
      return res.status(400).json({message : "Payment intent not found"});
    };
   }catch(error){
    logger.error(`Oops error in bookingCompletion : ${(error as Error).message} `)
    return res.status(500).json({message : "Something went wrong..."});
   }
  }
  /**
   * Restaurant table slots service
   * @body - restaurantId , date , guests
   * @method - Post METHOD
   * @return  restaurant Table details
   */
  // async restaurantTableSlots(req: Request, res: Response, next: NextFunction) {
  //   console.log("Restaurants Table slot service.....");
  //   const { restaurantId, date, selectedGuests } = req.body;
  //   try {
  //     const restId = restaurantId.split(":");
  //     console.log(restId, date, selectedGuests);
  //     const restaurantTable = await restaurantTableModel.findOne({
  //       restaurantId: restId,
  //     });
  //     console.log(restaurantTable);
  //     if (restaurantTable && restaurantTable.tableCapacity == selectedGuests) {
  //       const TimeSlot = await tableSlots.find({
  //         tableId: restaurantTable._id,
  //         IsAvailable: true,
  //         slotDate: date,
  //       });
  //       console.log(TimeSlot);
  //       return res
  //         .status(200)
  //         .json({ TimeSlots: TimeSlot, message: "succesfull" });
  //     }
  //     return res.status(400).json({ TimeSlots: "", message: "No Time slots" });
  //   } catch (error) {
  //     logger.error("Oops an error during in restaurant detail service:", error);
  //     return res.status(500).json({ message: "Internal server error" });
  //   }
  // }
  async restaurantTableSlots(req: Request, res: Response, next: NextFunction) {
    console.log("Restaurants Table slot service.....");
    const { restaurantId, date, selectedGuests } = req.body;
    try {
      const restId = restaurantId.split(":");
      console.log(restId, date, selectedGuests);
      const restaurantTables = await restaurantTableModel.find({
        restaurantId: restId,
      });

      console.log(restaurantTables);

      let allTimeSlots: any = [];

      for (let i = 0; i < restaurantTables.length; i++) {
        const table = restaurantTables[i];  

        const timeSlots = await tableSlots.find({
          tableId: table._id,
          IsAvailable: true,
          slotDate: date,
        });

        if (table.tableCapacity == selectedGuests) {
          allTimeSlots = allTimeSlots.concat(timeSlots);
        }
      }

      console.log(allTimeSlots);

      if (allTimeSlots.length > 0) {
        return res
          .status(200)
          .json({ TimeSlots: allTimeSlots, message: "Success" });
      } else {
        return res
          .status(400)
          .json({ TimeSlots: [], message: "No available time slots" });
      }
    } catch (error) {
      console.error(
        "Oops an error occurred in restaurant detail service:",
        error
      );
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  /**
   * Restaurant table slots service
   * @body - restaurantId , date , guests
   * @method - Post METHOD
   * @return  restaurant Table details
   */
  async restaurantTableDetails(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    console.log("Restaurants Table details service.....");
    const { tableId } = req.params;
    try {
      const restaurantTable = await restaurantTableModel.findById(tableId);
      console.log(restaurantTable);
      return res.status(200).json({ restaurantTable, message: "succesfull" });
    } catch (error) {
      logger.error("Oops an error during in restaurant detail service:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  /**
   * Logout service
   * @method - POST METHOD
   * @return
   */
  async userLogout(req: Request, res: Response, next: NextFunction) {
    console.log("User Logout service........");
    try {
      res.cookie("Uauth_token", "", {
        expires: new Date(0),
      });
      return res.status(200).json({ message: "Logout successfull" });
    } catch (error) {
      logger.error("Oops an error during in Logout service ........! :", error);
      return res.status(500).send("Internal server error");
    }
  }
}


