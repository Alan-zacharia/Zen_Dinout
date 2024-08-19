import axios from '../api/axios'
import axiosApi from "axios";
import { APIresponse, credentials, otpType } from '../types/userTypes';


/**
 * Function for user and seller registeration
 * @param data - Object containing name , email and password for registeration
 * @returns Promise that resolves to an object containing the registeration details
 */
const register = async (credentials: credentials | {}) => {
  try {
    const {
      data: { message, user, token },
    } = await axiosApi.post("http://localhost:3000/api/register", credentials);
    return { data: { message, user, token } };
  } catch (error) {
    console.log(error);
    throw error;
  }
};

/**
 * Function for user login
 * @param data - Object containing email and password for login
 * @returns Promise that resolves to an object containing the logged-in  user , mesage , jwt, or null if login fails
 */
const login = async (data: Partial<credentials>) => {
  try {
    const {
      data: { message, user, token , refreshToken },
    } = await axiosApi.post("http://localhost:3000/api/login", data);
    return { data: { message, user, token , refreshToken } };
  } catch (error) {
    console.log(error);
    throw error;
  }
};
/**
 * Function for restaurant login
 * @param data - Object containing email and password for login
 * @returns Promise that resolves to an object containing the logged-in  user , mesage , jwt, or null if login fails
 */
const restaurantLoginApi = async (data: Partial<credentials>) => {
  try {
    const {
      data: { message, restaurant, token  , refreshToken },
    } = await axiosApi.post("http://localhost:3000/restaurant/login", data);
    return { data: { message, restaurant, token , refreshToken } };
  } catch (error) {
    throw error;
  }
};

/**
 * Function for admin login
 * @param data - Object containing email and password for login
 * @returns Promise that resolves to an object containing the logged-in  admin , mesage , jwt, or null if login fails
 */
const adminLogin = async (data: Partial<credentials>) => {
  try {
    const {
      data: { message, user, token ,  refreshToken },
    } = await axiosApi.post("http://localhost:3000/admin/login", data);
    return { data: { message, user, token , refreshToken} };
  } catch (error) {
    console.log(error); 
    throw error;
  }
};

const otpForm = async (otp: otpType, userId: string) => {
  try {
    const {
      data: { message, success },
    } = await axios.post("/api/otp", { otp, userId });
    console.log(message, success);
    return { data: { message, success } };
  } catch (error) {
    console.log(error);
    throw error;
  }
};
const resendOtp = async (userId: string) => {
  try {
    const {
      data: { message, success },
    } = await axios.post("/api/resend-otp", { userId });
    console.log(message, success);
    return { data: { message, success } };
  } catch (error) {
    console.log(error);
    throw error;
  }
};
const OtpSend = async (email: string) => {
  try {
    const {
      data: { otp },
    } = await axios.post("/api/send-otp", { email });
    console.log(otp);
    return { otp };
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const validateToken = async () => {
    const response = await axios.get("/api/validate-token");
    console.log(response.data);
    if (response.status !== 200) {
      throw new Error("Token invalid");
    }
    return response;
};

const getRestaurantTableSlot = async (restaurantId : string | undefined , date : string )=>{
  try {
    const { data } = await axios.post("/api/time-slots",{restaurantId , date });
    return { data };
  } catch (error) {
    console.log(error);  
    throw error;
  }
};

const Logout = async () => {
  const response = await axios.post("/api/logout");
  if (response.status !== 200) {
    throw new Error("Error during sign out...");
  }
};


export {
  login,
  register,
  restaurantLoginApi,
  adminLogin,
  otpForm,
  resendOtp,
  OtpSend,
  validateToken,
  getRestaurantTableSlot,
  Logout
};
