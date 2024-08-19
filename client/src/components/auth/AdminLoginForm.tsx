import { FC, useState } from "react";
import AdminLoginPageImage from "../../assets/AdminLoginPageImage.jpg";
import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import { adminLogin } from "../../services/api";
import { useDispatch } from "react-redux";
import { setUser } from "../../redux/user/userSlice";
import { localStorageSetItem } from "../../utils/localStorageImpl";
import { HiEye, HiEyeOff } from "react-icons/hi";
import toast from "react-hot-toast";
import { loginCredentials } from "../../types/admin";
import { validateAdminLogin } from "../../utils/validations";

const AdminLogin: FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const formik = useFormik<loginCredentials>({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: validateAdminLogin,
    onSubmit: async (credentials) => {
      setLoading(true);
      adminLogin(credentials)
        .then((res) => {
          const { username, _id, role } = res.data.user;
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
          setLoading(false);
          navigate("/admin/");
        })
        .catch(({ response }) => {
          console.log(response);
          setLoading(false);
          toast.error(response?.data?.message);
        });
    },
  });
  return (
    <div className="flex h-screen">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-100"
        style={{ backgroundImage: `url(${AdminLoginPageImage})` }}
      ></div>
      <div className="absolute inset-0 bg-black opacity-30 "></div>
      <div className="absolute inset-0 flex items-center justify-center w-full p-8 ">
        <div className="opacity-100 w-[400px]  px-8 py-16  rounded-md relative shadow-lg  shadow-slate-500">
          <h1 className="text-xl xs:text-3xl font-bold  text-white pb-24">
            Welcome Admin
          </h1>

          <form
            className="pb-14 flex flex-col gap-3"
            onSubmit={formik.handleSubmit}
          >
            <section>
              <div className="relative z-0 w-full mb-3 group">
                <input
                  type="email"
                  id="admin_email"
                  className="block py-2.5 px-0 w-full text-base text-gray-900 bg-transparent border-0 border-b-2  appearance-none dark:text-white border-gray-500 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                  placeholder=" "
                  {...formik.getFieldProps("email")}
                />
                <label
                  htmlFor="admin_email"
                  className="peer-focus:font-medium absolute text-base text-white  duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                >
                  Email address
                </label>
              </div>
              {formik.touched.email &&
                formik.errors.email &&
                formik.submitCount > 0 && (
                  <div className="text-red-500 text-[15px] font-bold">
                    {formik.errors.email}
                  </div>
                )}
            </section>
            <section>
              <div className="relative z-0 w-full mb-3 group">
                <input
                  type={showPassword ? "text" : "password"}
                  id="admin_password"
                  className="block py-2.5 px-0 w-full text-base  bg-transparent border-0 border-b-2  appearance-none text-white border-gray-500 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                  placeholder=" "
                  {...formik.getFieldProps("password")}
                />
                <label
                  htmlFor="admin_password"
                  className="peer-focus:font-medium absolute text-base text-white duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-500  peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                >
                  Password
                </label>
                {formik.values.password &&
                  (showPassword ? (
                    <span
                      className="absolute inset-y-0 flex items-center right-0 text-orange-500 cursor-pointer"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      <HiEyeOff size={18} />
                    </span>
                  ) : (
                    <span
                      className="absolute inset-y-0 flex items-center right-0 text-orange-500 cursor-pointer"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      <HiEye size={18} />
                    </span>
                  ))}
              </div>
              {formik.touched.password &&
                formik.errors.password &&
                formik.submitCount > 0 && (
                  <div className="text-red-500 font-bold  text-[15px]">
                    {formik.errors.password}
                  </div>
                )}
            </section>
            <button
              className="w-full rounded-md py-2 xs:py-3 mt-3 block text-white font-bold text-xl bg-orange-500 hover:bg-orange-600"
              type="submit"
            >
              {loading ? "Loading" : "Login"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
