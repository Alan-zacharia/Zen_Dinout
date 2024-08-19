import React from 'react'
import Gif from "../assets/bubble-gum-error-404.gif"
import Page404 from "../assets/404Page.jpg"
import { Link } from 'react-router-dom'
const PageNotFound = () => {
  return (
    <div className='h-screen w-full flex'>
      <div className='m-auto flex items-center flex-col '>
        <section className='flex lg:flex-row flex-col items-center'>
        <img src={Gif} alt="" className='h-[300px] lg:h-[500px]' /> 
        <img src={Page404} alt="" className='h-[150px] lg:h-[300px]' />
        </section>
        <section className='flex flex-col items-center text-center gap-4'>
          <p className='text-base w-[70%] '>The page you are looking for might have been removed had its name changed or is temporarily unavailable.</p>
        <Link to="/"><button className="btn btn-outline btn-accent border-black ">GO TO HOME</button></Link>
        </section>
      </div>
    </div>
  )
}

export default PageNotFound
