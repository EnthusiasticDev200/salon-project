import React from 'react'
import { motion } from "framer-motion";
import Img from "./../../assets/bg1.jpg";
import Logo from "./../../assets/logo.png";
import MotionDiv from '../Layout/MotionDiv';

const Contact = () => {
  return (
    <MotionDiv
      className='pt-12 px-6 md:px-24' 
      id='contact'
    >
      <div className="flex gap-16 flex-col md:flex-row">
        <div className="basis-full md:basis-1/3">
          <h3 className="text-2xl text-[#e0b836] uppercase font-semibold">Contact</h3>
          <div className="flex justify-between flex-col md:flex-row">
            <div className='mb-3'>
              <div className='my-4'>
                <p>18, Herbert Macaulay Way</p>
                <p>Victoria Island</p>
                <p>Lagos</p>
              </div>
              <p className="my-3">
                info@khleancutz.com
              </p>
              <div className="my-3 flex gap-4">
                <a href="" className='w-[50px] h-[50px] bg-accent rounded-full flex items-center justify-center'>
                  <i className="ri-facebook-fill text-xl"></i>
                </a>
                <a href="" className='w-[50px] h-[50px] bg-accent rounded-full flex items-center justify-center'>
                  <i className="ri-instagram-line text-xl"></i>
                </a>
              </div>
            </div>
            <ul className='font-bold uppercase'>
              <li className='my-2'>Mon: Closed</li>
              <li className='my-2'>Tues: 10 am – 8 pm</li>
              <li className='my-2'>Wed: 10 am – 8 pm</li>
              <li className='my-2'>Thurs: 10 am – 8 pm</li>
              <li className='my-2'>Fri: 10 am – 8 pm</li>
              <li className='my-2'>Sat: 10 am – 5 pm</li>
              <li className='my-2'>Sun: 10 am – 5 pm</li>
            </ul>
          </div>
        </div>
        <div className="basis-full md:basis-2/3">
          <img src={Img} className='w-full h-full object-cover' alt="" />
        </div>
      </div>
      <div className='border-t mt-6 flex flex-col md:flex-row justify-between items-center py-6'>
        <div className="flex md:flex-row flex-col items-center gap-4">
          <img src={Logo} className='w-[50px]' alt="" />
          <p className='text-center'>KhleanCutz Barbershop. {new Date().getFullYear()} All Rights Reserved</p>
        </div>
        <p className=' mt-4 md:mt-0'>Designed by <a href="https://onuohajephthah.netlify.app" className='text-accent font-semibold'>Onuoha Jephthah</a></p>
      </div>
    </MotionDiv>
  )
}

export default Contact