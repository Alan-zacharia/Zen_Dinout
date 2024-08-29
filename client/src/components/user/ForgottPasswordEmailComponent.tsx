import axios from "axios";
import { useFormik } from "formik";
import React, { useState } from "react"
import className from "classnames"
import { localStorageSetItem } from "../../utils/localStorageImpl";


const ForgottPasswordEmailComponent : React.FC = () => {
  const [errors , setError] = useState('');
  const [message , setEmailMessage] = useState('');
  const [loading , setLoading] = useState<boolean>(false)

  const formik = useFormik({
    initialValues:{
       email:""
    },
    onSubmit : async(values)=>{
        setLoading(true)
        await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/reset-password`, {email : values.email}).then((res)=>{
        localStorageSetItem("&reset%pas%%","true");
         console.log(res.data.message);  
         setEmailMessage(res.data.message)
         setError('');
         setLoading(false)
        }).catch((error)=>{
          setLoading(false)
          setEmailMessage('')
          console.log(error.response.data.message)
          setError(error.response.data.message);
      });   
    }
  });
 
  return (
    <div className="m-auto flex ">
      <div className="bg-white  shadow-2xl shadow-slate-400 w-[400px] h-[400px] flex flex-col gap-4 justify-center items-center relative">
        <label
          htmlFor="Forgot_email"
          className="absolute left-7 top-6 text-black-500 font-bold text-2xl "
        >
         X Reset your password
        </label>
        <label
          htmlFor="Forgot_email"
          className="absolute left-7 top-24 text-neutral-600 font-semibold text-sm "
        >
        Don't worry. Resetting your password is easy, just tell <br /> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; us the email address you registered.
        </label>
        <form onSubmit={formik.handleSubmit}>
        <div className="relative z-0 w-[340px] mb-5 group mt-14">
          
          <input
            type="email"
            id="floating_email"
            className={className(!errors ? "block py-2 h-14 px-3  rounded-xl  w-full text-sm text-gray-900 bg-transparent border  appearance-none  border-gray-600  focus:outline-none focus:ring-0 focus:border-green-600 peer" : "block py-2 h-14 px-3  rounded-xl  w-full text-sm text-red-500 bg-transparent border  appearance-none  border-red-400  focus:outline-none focus:ring-0 focus:border-red-500 peer")}
            placeholder=" "
            {...formik.getFieldProps("email")}
            
          />
          {errors && !message ? (
            <p className="text-red-500 font-semibold text-sm flex p-1 justify-end">{errors}</p>
          ):(
            <p className="text-green-500 font-semibold text-sm flex p-1 justify-end">{message}</p>
          )}
          <label
            htmlFor="floating_email"
            className="peer-focus:font-medium absolute text-sm text-gray-500  duration-300 transform -translate-y-6 px-4  scale-75 top-5 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-black peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-5"
          >
            Email address
          </label>
        </div>
        <button className=" w-[350px] bg-green-500 p-3 text-white font-bold text-base rounded-3xl hover:bg-green-600" type="submit" disabled={loading}>
          {loading ? 'Loading' : 'Confirm'}
        </button>
        </form>
      </div>
    </div>
  );
};

export default ForgottPasswordEmailComponent;
