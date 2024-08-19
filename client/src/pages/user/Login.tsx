import React from 'react';
import LoginForm from '../../components/auth/UserLoginForm';

const Login: React.FC = () => {

  return (
    <div className="flex flex-col lg:flex-row ">
      <LoginForm />
    </div>
  );
};

export default Login;
