import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUser } from "react-icons/fa";
import { FaLock } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { useFormik } from "formik";
import { loginValidation } from "../../utils/validations";
import { HiEye, HiEyeOff } from "react-icons/hi";
import { localStorageSetItem } from "../../utils/localStorageImpl";
import { setUser } from "../../redux/user/userSlice";
import { restaurantLoginApi } from "../../services/api";
interface SellerType {
  email: string;
  password: string;
}
const RestaurantLogin: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setError] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validate: loginValidation,
    onSubmit: async (values: SellerType) => {
      setLoading(true);
      console.log(values);
      try {
        await restaurantLoginApi(values)
          .then((res) => {
            const { token } = res.data;
            console.log(res);
            const { restaurantName, _id } = res.data.restaurant;
            dispatch(
              setUser({
                isAuthenticated: true,
                name: restaurantName,
                role: "seller",
                id: _id,
              })
            );
            setLoading(false);
            localStorageSetItem("accessToken", token as string);
            navigate("/restaurant/");
          })
          .catch(({ response }) => {
            console.log(response);
            setLoading(false);
            console.log(response?.data?.message);
            setError(response?.data?.message);
          });
      } catch (error) {
        console.log((error as Error).message);
      }
    },
  });
  return (
    <section className="h-full flex justify-center items-center ">
      <div className="w-full max-w-md p-6 bg-black h-[500px] rounded-lg shadow-md opacity-70 ">
        <h1 className="text-xl font-bold leading-tight tracking-tight md:text-3xl text-white ">
          Restaurant Login
        </h1>
        <form className="mt-28 space-y-6" onSubmit={formik.handleSubmit}>
          {errorMessage && (
            <p className="text-red-500 font-bold text-lg">{errorMessage}</p>
          )}
          <div className="flex flex-col gap-5 w-[400px] fixed ">
            <div className="relative">
              <input
                type="text"
                className="w-full px-10 py-3 bg-gray-200 outline-none font-semibold"
                placeholder="Email Address"
                {...formik.getFieldProps("email")}
              />
              <FaUser className="absolute top-3.5 left-3 " size={18} />
              {formik.touched.email &&
                formik.submitCount > 0 &&
                formik.errors.email && (
                  <p className="text-red-500 font-semibold">
                    {formik.errors.email}
                  </p>
                )}
            </div>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                className="w-full px-10 py-3 bg-gray-200  outline-none font-semibold"
                placeholder="Password"
                {...formik.getFieldProps("password")}
              />
              <FaLock className="absolute top-3.5 left-3 " size={17} />
              {formik.touched.password &&
                formik.submitCount > 0 &&
                formik.errors.password && (
                  <p className="text-red-500 font-semibold">
                    {formik.errors.password}
                  </p>
                )}
              {formik.values.password &&
                (showPassword ? (
                  <span
                    className="absolute inset-y-0 flex items-center right-3 text-black cursor-pointer"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    <HiEyeOff size={20} />
                  </span>
                ) : (
                  <span
                    className="absolute inset-y-0 flex items-center right-3 text-black cursor-pointer"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    <HiEye size={20} />
                  </span>
                ))}
            </div>

            <button
              className="w-full bg-blue-500 p-2 text-white font-semibold hover:bg-blue-600 text-lg"
              type="submit"
              disabled={loading}
            >
              {loading ? "LOADING" : " LOG IN"}
            </button>
            <div className="flex justify-between items-center">
              <Link to={"/Forgot-password"}>
                <p className="text-xs font-semibold font-sans cursor-pointer text-white">
                  FORGOT PASSWORD ?
                </p>
              </Link>
              <Link to={"/restaurant/registeration"}>
                <p className="text-xs font-semibold font-sans cursor-pointer text-white  ">
                  NEW USER ? REGISTER
                </p>
              </Link>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
};

export default RestaurantLogin;
