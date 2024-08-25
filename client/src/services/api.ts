import axios from "../api/axios";
import axiosApi from "axios";
import { credentials, otpType } from "../types/userTypes";

const register = async (credentials: credentials | {}) => {
  try {
    const {
      data: { message, user, token },
    } = await axiosApi.post("http://localhost:3000/api/register", credentials);
    return { data: { message, user, token } };
  } catch (error) {
    throw error;
  }
};

const login = async (data: Partial<credentials>) => {
  try {
    const {
      data: { message, user, token, refreshToken },
    } = await axiosApi.post("http://localhost:3000/api/login", data);
    return { data: { message, user, token, refreshToken } };
  } catch (error) {
    throw error;
  }
};

const restaurantLoginApi = async (data: Partial<credentials>) => {
  try {
    const {
      data: { message, restaurant, token, refreshToken },
    } = await axiosApi.post("http://localhost:3000/restaurant/login", data);
    return { data: { message, restaurant, token, refreshToken } };
  } catch (error) {
    throw error;
  }
};

const adminLogin = async (data: Partial<credentials>) => {
  try {
    const {
      data: { message, user, token, refreshToken },
    } = await axiosApi.post("http://localhost:3000/admin/login", data);
    return { data: { message, user, token, refreshToken } };
  } catch (error) {
    throw error;
  }
};

const otpForm = async (otp: otpType, userId: string) => {
  try {
    const {
      data: { message, success },
    } = await axios.post("/api/otp", { otp, userId });
    return { data: { message, success } };
  } catch (error) {
    throw error;
  }
};
const resendOtp = async (userId: string) => {
  try {
    const {
      data: { message, success },
    } = await axios.post("/api/resend-otp", { userId });
    return { data: { message, success } };
  } catch (error) {
    throw error;
  }
};
const OtpSend = async (email: string) => {
  try {
    const {
      data: { otp },
    } = await axios.post("/api/send-otp", { email });
    return { otp };
  } catch (error) {
    throw error;
  }
};

const validateToken = async () => {
  const response = await axios.get("/api/validate-token");
  if (response.status !== 200) {
    throw new Error("Token invalid");
  }
  return response;
};

const getRestaurantTableSlot = async (
  restaurantId: string | undefined,
  date: string
) => {
  try {
    const { data } = await axios.post("/api/slots", { restaurantId, date });
    return { data };
  } catch (error) {
    throw error;
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
};
