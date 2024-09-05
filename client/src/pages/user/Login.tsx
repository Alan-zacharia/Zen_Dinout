import React from 'react';
import LoginForm from '../../components/auth/UserLoginForm';
import { localStorageRemoveItem } from '../../utils/localStorageImpl';

const Login: React.FC = () => {
  localStorageRemoveItem("&reset%pas%%");
  return (
    <div className="flex flex-col lg:flex-row ">
      <LoginForm />
    </div>
  );
};

export default Login;
