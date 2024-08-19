import axios, { AxiosInstance } from "axios";
import logout from "../utils/Logout";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    } 
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const response = await axiosInstance.post("/token/refreshToken");
        const newAccessToken = response.data.accessToken;
        localStorage.setItem("accessToken", newAccessToken);
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        handleRefreshTokenError(refreshError);
        return Promise.reject(refreshError);
      }
    } else if (error.response.status == 403) {
      localStorage.removeItem("accessToken");
      logout("Sorry, This user has been blocked");
    }
    return Promise.reject(error);
  }
);

const handleRefreshTokenError = (error: any) => {
  console.error("Failed to refresh token:", error);
  logoutUser();
};

const logoutUser = () => {
  try {  
    logout("Sorry, your session expired. Please log in again.");
    localStorage.removeItem("accessToken");
  } catch (error) {
    console.error("Error while logging out:", error);
  }
};

export default axiosInstance;
