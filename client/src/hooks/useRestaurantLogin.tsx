import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { restaurantLoginApi } from "../services/api";





interface restaurantCredentials {
    email : string;
    password : string;
};

interface restaurantLoginReturnType {
    restaurantLogin : (data : restaurantCredentials) => void;
    loading : boolean;
    error : string | null
}
const useRestaurantLogin = ():restaurantLoginReturnType=>{

   const [loading , setLoading] = useState<boolean>(false);
   const [error , setError] = useState<string | null>(null);
   const navigate = useNavigate();
   const restaurantLogin = async(restaurantDatas : restaurantCredentials)=>{
    setLoading(true);
    try{
     await restaurantLoginApi(restaurantDatas).then((res)=>{
       console.log(res); 
       setLoading(false);

       navigate("/restaurant/");
     }).catch((error : any)=>{
        setLoading(false);
        setError(error.response.data.message);
     })
    }catch(error : any){
     setLoading(false);
     setError(error.response.data.message);
    }
   };

   return { loading , error , restaurantLogin}
};


export default useRestaurantLogin;

