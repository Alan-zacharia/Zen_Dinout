import { useFormik } from "formik";
import React from "react";
import { valdateResetPassword } from "../../utils/validations";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { Toaster, toast } from "react-hot-toast";
import { localStorageRemoveItem } from "../../utils/localStorageImpl";

type credentials = {
  password: string;
  confirmPassword: string;
};
const ForgotPasswordComponent: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const formik = useFormik({
    initialValues: {
      password: "",
      confirmPassword: "",
    },
    validationSchema: valdateResetPassword,
    onSubmit: async (credentials: credentials) => {
      await axios
        .put(`${import.meta.env.VITE_API_BASE_URL}/api/reset-password/${id}`, {
          credentials,
        })
        .then(() => {
          toast.success("Seccesfully Updated");
          localStorageRemoveItem("&reset%pas%%");
          setTimeout(() => {
            navigate("/login");
          }, 1000);
        })
        .catch(() => {
          toast.error("Something went wrong");
        });
    },
  });
  return (
    <div className="m-auto h-[500px] shadow-lg shadow-gray-400  w-[450px] flex justify-center relative">
      <Toaster position="top-center" />
      <form
        className="flex flex-col gap-5 justify-center w-[370px] "
        onSubmit={formik.handleSubmit}
      >
        <div className="text-start pb-5 ">
          <h1 className="text-2xl font-bold text-red-500 absolute top-10 left-7">
            x Reset Password
          </h1>
        </div>

        <label htmlFor="password" className="text-base font-bold text-blue-500">
          New Password
        </label>
        {formik.touched.password && formik.errors.password && (
          <p className="text-red-500 font-semibold text-sm flex max-w-[370px]">
            {formik.errors.password}
          </p>
        )}

        <input
          type="password"
          className="p-3 outline-none border border-b-neutral-700 text-sm  w-full "
          {...formik.getFieldProps("password")}
        />
        <label htmlFor="password" className="text-base font-bold text-blue-500">
          Confirm Password
        </label>
        {formik.touched.confirmPassword && formik.errors.confirmPassword && (
          <p className="text-red-500 font-semibold text-sm flex max-w-[370px]">
            {formik.errors.confirmPassword}
          </p>
        )}
        <input
          type="password"
          className="p-3 outline-none border border-b-neutral-700 text-sm  w-full "
          {...formik.getFieldProps("confirmPassword")}
        />
        <button className="w-full bg-blue-600 p-3 rounded-full text-white font-bold hover:bg-blue-500">
          confirm
        </button>
      </form>
    </div>
  );
};

export default ForgotPasswordComponent;
