import React, { useState } from "react";
import { useFormik } from "formik";
import { Link, useNavigate } from "react-router-dom";
import { restaurantRegisterValidationSchema } from "../../validations/restaurantValidationSchema";
import axios from "../../api/axios";
import { Toaster, toast } from "react-hot-toast";
import LoginImage from "../../assets/Zen-Dinout-RestaurantLoginPage.jpg";


const RestaurantRegister: React.FC = () => {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const formik = useFormik({
    initialValues: {
      restaurantName: "",
      email: "",
      contact: "",
      password: "",
    },
    validationSchema: restaurantRegisterValidationSchema,
    onSubmit: async (credentials) => {
      await axios
        .post("/restaurant/register", {
          restaurantName: credentials.restaurantName,
          email: credentials.email,
          contact: credentials.contact,
          password: credentials.password,
        })
        .then(() => {
          toast.success("Confrimation message sent to your email address");
          setTimeout(() => {
            navigate("/restaurant/login");
          }, 2000);
        })
        .catch((error: any) => {
          setError(error.response.data.message);
        });
    },
  });

  return (
    <>
      <section
        className="bg-gray-50 h-full flex justify-center items-center"
        style={{
          backgroundImage: `url(${LoginImage})`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <Toaster position="top-center" />
        <div className="  w-full max-w-md p-6 bg-gray-950 rounded-lg shadow-md opacity-70 ">
          <h1 className="text-xl font-bold leading-tight tracking-tight md:text-3xl text-orange-500 ">
            Create an account
          </h1>
          <form className="mt-6 space-y-6 pt-2" onSubmit={formik.handleSubmit}>
            {error && <div className="text-red-500 font-bold">{error}</div>}
            <div className="relative z-0 w-full mb-5 group">
              <input
                type="text"
                id="floating_name"
                className="block py-2.5 px-0 w-full text-sm  bg-transparent border-0 border-b-2 border-gray-300 appearance-none text-white  focus:outline-none focus:ring-0 focus:border-green-600 peer"
                placeholder=" "
                {...formik.getFieldProps("restaurantName")}
              />
              <label
                htmlFor="floating_email"
                className="peer-focus:font-medium absolute xl:text-lg text-white duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto  peer-focus:text-green-500  peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
              >
                Restaurant name
              </label>
              {formik.touched.restaurantName &&
                formik.submitCount > 0 &&
                formik.errors.restaurantName && (
                  <div className="text-red-500 text-sm w-full font-bold">
                    {formik.errors.restaurantName}
                  </div>
                )}
            </div>
            <div className="flex gap-4 pt-5">
              <div className="relative z-0 w-full mb-5 group">
                <input
                  type="email"
                  id="floating_email"
                  className="block py-2.5 px-0 w-full text-sm  bg-transparent border-0 border-b-2 border-gray-300  appearance-none text-white dark:border-gray-600 focus:border-green-500 focus:outline-none focus:ring-0  peer"
                  placeholder=" "
                  {...formik.getFieldProps("email")}
                />
                <label
                  htmlFor="floating_email"
                  className="peer-focus:font-medium absolute xl:text-lg text-white duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-green-500  peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                >
                  Email address
                </label>
                {formik.touched.email &&
                  formik.submitCount > 0 &&
                  formik.errors.email && (
                    <div className="text-red-500 w-full text-sm font-bold">
                      {formik.errors.email}
                    </div>
                  )}
              </div>

              <div className="relative z-0 w-full mb-5 group">
                <input
                  type="number"
                  id="floating_contact"
                  className="block py-2.5 px-0 w-full text-sm  bg-transparent border-0 border-b-2 border-gray-300  appearance-none text-white dark:border-gray-600 focus:border-green-500 focus:outline-none focus:ring-0  peer"
                  placeholder=" "
                  {...formik.getFieldProps("contact")}
                />
                <label
                  htmlFor="floating_email"
                  className="peer-focus:font-medium absolute xl:text-lg text-white duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-green-500 focus:border-green-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                >
                  Contact
                </label>
                {formik.touched.contact &&
                  formik.submitCount > 0 &&
                  formik.errors.contact && (
                    <div className="text-red-500 w-full text-sm font-bold">
                      {formik.errors.contact}
                    </div>
                  )}
              </div>
            </div>

            <div className="relative z-0 w-full mb-5 group">
              <input
                type="password"
                id="floating_password"
                className="block py-2.5 px-0 w-full text-base  bg-transparent border-0 border-b-2 border-gray-300 appearance-none text-white dark:border-gray-600 focus:border-green-500 focus:outline-none focus:ring-0  peer"
                placeholder=" "
                {...formik.getFieldProps("password")}
              />
              <label
                htmlFor="floating_Password"
                className="peer-focus:font-medium absolute xl:text-lg text-white duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-green-600  peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
              >
                Password
              </label>
              {formik.touched.contact &&
                formik.submitCount > 0 &&
                formik.errors.password && (
                  <div className="text-red-500 text-sm w-full font-bold">
                    {formik.errors.password}
                  </div>
                )}
            </div>
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="terms"
                  aria-describedby="terms"
                  type="checkbox"
                  className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="terms" className="font-light text-white">
                  I accept the{" "}
                  <a
                    className="font-medium text-primary-600 hover:underline dark:text-primary-500"
                    href="#"
                  >
                    Terms and Conditions
                  </a>
                </label>
              </div>
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
            >
              Create an account
            </button>
            <p className="text-sm font-light text-white">
              Already have an account?{" "}
              <Link to={"/restaurant/login"}>
                <a className="font-medium text-primary-600 hover:underline dark:text-primary-500">
                  Login here
                </a>
              </Link>
            </p>
          </form>
        </div>
      </section>
    </>
  );
};

export default RestaurantRegister;
