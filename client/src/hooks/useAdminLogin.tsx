import { useState } from "react";
import { adminLogin } from "../services/api";
import { useNavigate } from "react-router-dom";

interface credentials {
  email: string;
  password: string;
}

interface LoginReturnType {
  login: (data: credentials) => void;
  loading: boolean;
  error: string | null;
}

const useAdminLogin = (): LoginReturnType => {

  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const login = async (datas: credentials) => {
    setLoading(true);
    setError(null);
    try{    
        const {data} = await adminLogin(datas);
       
        setLoading(false)

        navigate('/admin/')
    }catch(error : any){
        setLoading(false);
        if (error.response && error.response.data && error.response.data.message) {
            setError(error.response.data.message);
        }
    }
    
  };
  return { login, loading, error };
};

export default useAdminLogin;
