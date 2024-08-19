import { useState } from "react";

/** Declaring types for the hook useOtp */
interface returType {
    otpFunction : (otp : string , otpData : string | null)=> Promise<boolean>;
    otpButtonLoading : boolean;
    otpErrors : string | null;
};

/** useOtp custom hook for handling otp functionalities including loading the button, handling datas, setting errors */
const useOtp = () : returType => {
   const [otpErrors , setOtpError] = useState<string | null>(null);
   const [otpButtonLoading , setOtpButtonLoading] = useState<boolean>(false);
   const otpFunction = async(otp : string, otpData : string | null) : Promise<boolean>=>
    {
   setOtpButtonLoading(true);
    try{
        console.log(otpData , otp)
        if(otpData == otp){
            setOtpButtonLoading(false); 
            return true 
        }else{
            setOtpButtonLoading(false);
            setOtpError("Incorrect Otp") ;
            return false 
        } 
    }catch(error){
        if (error instanceof Error) {
            console.log(error.message);
            setOtpError(error.message);
          } else {
            console.error('An unexpected error occurred:', error);
            setOtpError('An unexpected error occurred');
          }
          throw error
    }
    }
   return {otpFunction , otpButtonLoading , otpErrors}
}

export default useOtp;