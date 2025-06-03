import React, { useEffect, useRef } from 'react'
import Logo from './../../assets/logo.png'
import { Link } from "react-router-dom";

const Navbar = () => {
  const navRef = useRef()

  useEffect(() => {
    const pageScroll = () => {
      if(window.scrollY > 100) {
        navRef.current.classList.remove('py-4')
      } else {
        navRef.current.classList.add('py-4')
      }

      navRef.current.classList.toggle('bg-[#333]', window.scrollY > 100)
    }

    window.addEventListener('scroll', pageScroll)

    return () => {
      window.removeEventListener("scroll", pageScroll);
    }
  }, [])
  
  return (
    <nav className='px-6 md:px-24 py-4 flex flex-row justify-between items-center fixed w-full z-50 bg-[#333] shadow-md md:shadow-none h-auto text-white' ref={navRef}>
      <img src={ Logo } alt="KhleanCutz" className='w-[50px]' />
      <ul className='hidden md:flex flex-col md:flex-row uppercase md:ml-20'>
        <li className="p-3 mr-5">
          <a href="#home">Home</a>
        </li>
        <li className="p-3 mr-5">
          <a href="#about">About</a>
        </li>
        <li className="p-3 mr-5">
          <a href="#services">Services</a>
        </li>
        <li className="p-3 mr-5">
          <a href="#team">Our Team</a>
        </li>
        <li className="p-3 mr-5">
          <a href="#prices">Prices</a>
        </li>
        <li className="p-3 mr-5">
          <a href="#contact">Contact</a>
        </li>
      </ul>
      <div className="w-auto flex gap-2 items-center">
        <Link to={'customer/login'} className='p-3'>
          <i className="ri-user-line"></i>
        </Link>
        <a href="" className='py-2 px-4 bg-[#e0b836] hover:bg-[#a68b30] text-black rounded transition-all hidden md:inline-block'>
          Book An Appointment
        </a>
      </div>
    </nav>
  )
}

export default Navbar