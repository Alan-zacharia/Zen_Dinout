import axiosInstance from "../api/axios";
import store from "../redux/store";
import { clearUser } from "../redux/user/userSlice";
import toast from "react-hot-toast"

const  logout = async(message: string) => {
  store.dispatch(clearUser()); 
  localStorage.removeItem("accessToken");
  await axiosInstance.post("/api/logout")
  toast.success(message)
};
export default logout;
 