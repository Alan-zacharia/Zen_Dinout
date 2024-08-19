import React, { useState } from "react";
import { useFormik } from "formik";
import { Link, useNavigate } from "react-router-dom";
import RegisterLogo from "../../assets/Zen-Dinout-RestaurantImage.jpg";
import { registerValidation } from "../../utils/validations";
import useRegister from "../../hooks/useRegisteration";
import OtpForm from "../layouts/OtpForm";
import axios from "axios";
import {
  localStorageRemoveItem,
  localStorageSetItem,
} from "../../utils/localStorageImpl";
import GoogleLoginButton from "../auth/GooglLoginButton";
import toast, { Toaster } from "react-hot-toast";
import { RegistercredentialsType } from "../../types/user/userTypes";
import { FaEye } from "react-icons/fa6";
import { FaEyeSlash } from "react-icons/fa";

const SignupForm: React.FC = () => {
  localStorageRemoveItem("&reset%pas%%");
  const navigate = useNavigate();
  const [otpFormModal, setOtpFormModal] = useState(false);
  const [otpData, setOtp] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);

  const { errors, registerFn } = useRegister();
  const formik = useFormik({
    initialValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: registerValidation,
    onSubmit: async (credentials: RegistercredentialsType) => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/api/generate-otp`,
          {
            email: credentials.email,
            username: credentials.username,
            password: credentials.password,
          }
        );
        setOtpFormModal(true);
        localStorageSetItem("remainingSeconds", "35");
        setOtp(response.data.otp);
      } catch (error: any) {
        if (error && error.response && error.response.data) {
          setError(error.response.data.message);
        }
      } finally {
        setLoading(false);
      }
    },
  });
  const resendOtp = async () => {
    setOtp(null);
    const response = await axios.post(
      `${import.meta.env.VITE_API_BASE_URL}/api/generate-otp`,
      { email: formik.values.email }
    );
    setOtp(response.data.otp);
  };

  const handleOtpVerification = async () => {
    try {
      registerFn(formik.values);
      toast.success("Registeration completed.....");
      setTimeout(() => {
        navigate("/login");
      }, 1000);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Toaster position="top-center" />

      <div className="w-full items-center lg:w-1/2 bg-white flex flex-col p-8 lg:p-20 justify-between ">
        {otpFormModal && (
          <OtpForm
            otpData={otpData}
            onOtpVerified={handleOtpVerification}
            resendOtp={resendOtp}
          />
        )}
        <h1 className="text-xl text-black font-semibold mb-8"></h1>

        <div className="w-full flex flex-col max-w-md mx-auto lg:mx-32 ">
          <div className="mb-10">
            <h3 className="text-3xl font-semibold mb-2">Register</h3>

            <p className="text-base mb-2"></p>
          </div>

          <form onSubmit={formik.handleSubmit}>
            {!error && errors ? (
              <div className="text-red-600">{errors}</div>
            ) : (
              <div className="text-red-600">{error}</div>
            )}

            <div className="mb-6">
              <input
                type="text"
                placeholder="Name"
                className="w-full py-2 px-2 my-2 bg-transparent text-black border-black border-b outline-none focus:outline-none"
                {...formik.getFieldProps("username")}
              />
              {formik.touched.username &&
                formik.submitCount > 0 &&
                formik.errors.username && (
                  <div className="text-red-500">{formik.errors.username}</div>
                )}
              <input
                type="text"
                placeholder="Email"
                className="w-full py-2 px-2 my-2 bg-transparent text-black border-black border-b outline-none focus:outline-none"
                {...formik.getFieldProps("email")}
              />
              {formik.touched.email &&
                formik.submitCount > 0 &&
                formik.errors.email && (
                  <div className="text-red-500">{formik.errors.email}</div>
                )}
              <div className="relative ">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  className="w-full py-2 px-2 my-2 bg-transparent text-black border-black border-b outline-none focus:outline-none"
                  {...formik.getFieldProps("password")}
                />
                <div className="absolute bottom-5 right-0 cursor-pointer">
                  {!showPassword ? (
                    <FaEye onClick={() => setShowPassword(true)} />
                  ) : (
                    <FaEyeSlash onClick={() => setShowPassword(false)} />
                  )}
                </div>
              </div>
              {formik.touched.password &&
                formik.submitCount > 0 &&
                formik.errors.password && (
                  <div className="text-red-500">{formik.errors.password}</div>
                )}
              <div className="relative ">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="confirm password"
                  className="w-full py-2 px-2 my-2 bg-transparent text-black border-black border-b outline-none focus:outline-none"
                  {...formik.getFieldProps("confirmPassword")}
                />
                <div className="absolute bottom-5 right-0 cursor-pointer">
                  {!showConfirmPassword ? (
                    <FaEye onClick={() => setShowConfirmPassword(true)} />
                  ) : (
                    <FaEyeSlash onClick={() => setShowConfirmPassword(false)} />
                  )}
                </div>
              </div>
              {formik.touched.confirmPassword &&
                formik.submitCount > 0 &&
                formik.errors.confirmPassword && (
                  <div className="text-red-500">
                    {formik.errors.confirmPassword}
                  </div>
                )}
            </div>
            <div className="flex flex-col mb-4">
              <button
                className="w-full bg-black text-white rounded-md py-3 text-center font-bold cursor-pointer"
                type="submit"
                disabled={loading}
              >
                {loading ? "Submitting....." : "Register"}
              </button>
            </div>
          </form>
          <GoogleLoginButton label={"Up"} />
        </div>
        <Link to={"/login"}>
          <div className="flex justify-center ">
            <p className="text-sm font-normal text-black">
              Already have an account?
              <span className="font-semibold underline cursor-pointer">
                Sign in
              </span>
            </p>
          </div>
        </Link>
      </div>

      <div className="relative w-full lg:w-1/2 h-96 lg:h-screen lg:block  hidden md:block">
        <div className="absolute top-1/4 left-10 flex flex-col">
          <div className="relative w-full">
            <h2 className="text-xl text-white font-bold flex flex-col gap-4">
              <span className="block text-4xl font-bold text-orange-500">
                Welcome to Zen Dinout,
              </span>
              <span
                className="block overflow-hidden border-r-2 border-white typewriter
        text-blue-500"
              >
            
                  Join Zen Dinout and book your table in seconds.....&nbsp;
       
              </span>
            </h2>
          </div>
        </div>
        <img src={RegisterLogo} className="w-full h-full object-cover" />
      </div>
    </>
  );
};

export default SignupForm;
