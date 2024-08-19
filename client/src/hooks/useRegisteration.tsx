import { useState } from "react";
import { register } from "../services/api";
import { RegistercredentialsType } from "../types/user/userTypes";

interface LoginReturnType {
  registerFn: (data: RegistercredentialsType | {}) => void;
  errors: string | null;
}

const useRegister = (): LoginReturnType => {
  const [errors, setError] = useState<string | null>(null);
  const registerFn = async (datas: RegistercredentialsType | {}) => {
    setError(null);
    try {
      await register(datas)
        .then((res) => {
          console.log(res);
        })
        .catch((error) => {
          console.log(error);
        });
    } catch (error: any) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setError(error.response.data.message);
      }
    } 
  };
  return { registerFn, errors };
};

export default useRegister;
