import { useGoogleLogin } from "@react-oauth/google";
import { FcGoogle } from "react-icons/fc";
import axios from "axios";
import axiosInstance from "axios";
axios.defaults.withCredentials = true;
import { useNavigate } from "react-router-dom";
import { localStorageSetItem } from "../../utils/localStorageImpl";
import { toast } from "react-hot-toast";
import { useDispatch } from "react-redux";
import { setUser } from "../../redux/user/userSlice";

const PASS_KEY = import.meta.env.VITE_API_BCRYPT_PASS_KEY;

const GoogleLoginButton = ({ label }: { label: string }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const login = useGoogleLogin({
    onSuccess: async (response) => {
      try {
        const res = await axios.get(import.meta.env.VITE_API_GOOGLE_LOGIN_API, {
          headers: {
            Authorization: `Bearer ${response.access_token}`,
          },
          withCredentials: false,
        });
        if (label === "In") {
          await axiosInstance
            .post(`${import.meta.env.VITE_API_BASE_URL}/api/login`, {
              email: res.data.email,
              password: res.data.sub + PASS_KEY,
              username: res.data.given_name,
            })
            .then((res) => {
              const { username, role, _id } = res.data.user;
              const { token } = res.data;
              dispatch(
                setUser({
                  isAuthenticated: true,
                  name: username,
                  role: role,
                  id: _id,
                })
              );
              localStorageSetItem("accessToken", token);
              navigate("/");
            })
            .catch(({ response }) => {
              toast.error(response.data.message);
            });
        } else {
          await axiosInstance
            .post(`${import.meta.env.VITE_API_BASE_URL}/api/google-login`, {
              username: res.data.given_name,
              email: res.data.email,
              password: res.data.sub + PASS_KEY,
            })
            .then((res) => {
              const { token } = res.data;
              const { username, role, _id } = res.data.user;
              dispatch(
                setUser({
                  isAuthenticated: true,
                  name: username,
                  role: role,
                  id: _id,
                })
              );
              localStorageSetItem("accessToken", token);
              navigate("/");
            })
            .catch(({ response }) => {
              toast.error(response.data.message || "Something went wrong....");
            });
        }
      } catch (error) {
        console.log(error);
      }
    },
  });

  return (
    <> 
      <button
        className="w-full mt-5 bg-white border border-black rounded-md py-3 text-center font-semibold flex justify-center"
        onClick={() => login()}
      >
        <FcGoogle className="size-6" />
        Sign {label} with Google
      </button>
    </>
  );
};

export default GoogleLoginButton;
