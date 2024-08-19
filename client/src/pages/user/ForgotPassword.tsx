import React from 'react'
import ForgotPasswordComponent from '../../components/user/ForgotPasswordComponent'

const ForgotPassword = () => {
  return (
    <div className='flex h-screen w-full'>
        <div className=' lg:flex absolute p-10 pt-20  lg:p-20 lg:px-44'>
            <h1 className='text-3xl cursor-pointer font-bold '>Zen <span className='text-orange-500'>Dinout</span></h1>
        </div>
      <ForgotPasswordComponent/>
    </div>
  )
}

export default ForgotPassword
