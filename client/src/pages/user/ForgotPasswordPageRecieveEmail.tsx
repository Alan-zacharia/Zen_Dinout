import React from 'react';
import ForgotPasswordEmailComponent from "../../components/user/ForgottPasswordEmailComponent";

const ForgotPasswordPageRecieveEmail : React.FC = () => {
  return (
    <div className="h-screen flex">
       <div className=' lg:flex absolute p-10 pt-20  lg:p-20 lg:px-44'>
            <h1 className='text-3xl cursor-pointer font-bold '>Zen <span className='text-orange-500'>Dinout</span></h1>
        </div>
       <ForgotPasswordEmailComponent/>
    </div>
  )
}

export default ForgotPasswordPageRecieveEmail
