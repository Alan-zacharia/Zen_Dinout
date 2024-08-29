import React from "react";
import SignupForm from "../../components/auth/ResgisterForm";

const Signup: React.FC = () => {
  return (
    <div className="flex flex-col lg:flex-row">
      <SignupForm />
    </div>
  );
};

export default Signup;
