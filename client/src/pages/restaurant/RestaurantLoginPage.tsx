import React from 'react'
import LoginImage from "../../assets/Zen-Dinout-RestaurantLoginPage.jpg"
import RestaurantLogin from '../../components/auth/RestaurantLogin';

const SellerLoginPage : React.FC = () => {
  return (
    <div className='h-screen ' >
        <div 
        className="absolute inset-0 bg-cover bg-center " 
        style={{backgroundImage: `url(${LoginImage})`}}
      ></div>
    <RestaurantLogin/>
  </div>
  )
}

export default SellerLoginPage
