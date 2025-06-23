import React from 'react'
import { motion } from "framer-motion";
import Logo from "./../../assets/logo.png";
import MotionDiv from '../Layout/MotionDiv';

const About = () => {
  return (
    <div className='py-12 px-6 md:px-24' id='about'>
      <MotionDiv
        className="flex flex-col md:flex-row items-center gap-8"
      >
        <div className="basis-full md:basis-1/2">
          <img src={Logo} className='w-[90%] md:w-full object-cover' alt="" />
        </div>
        <div className="basis-full md:basis-1/2">
          <h2 className="text-3xl md:text-4xl font-bold">
            About KhleanCutz
          </h2>
          <p className='mt-2'>
            KhleanCutz isn’t just a barbershop — it’s a lifestyle. <br />

            Founded with a pair of clippers and a passion for precision, KhleanCutz was born out of the belief that every man deserves to look and feel his best. We’ve taken the classic barbershop experience and given it an upgrade — blending urban culture, modern style, and top-tier grooming into one unforgettable vibe.
          </p>
          <p className='mt-2'>
            We specialize in clean fades, sharp lineups, beard sculpting, and fresh energy. Our barbers aren’t just good — they’re artists with clippers. Whether you're prepping for a big day or just stopping by for a weekly refresh, we make sure you walk out sharper, smoother, and more confident than ever.
          </p>
          <ul className='my-3 list-disc list-inside marker:text-[#e0b836]'>
            <h3 className="text-xl font-bold">Why KhleanCutz?</h3>
            <li className="my-2">
              Skilled Hands, Sharp Tools – Every cut is done with precision and care.
            </li>
            <li className="my-2">
              Real Vibes – Great music, chill atmosphere, and no forced small talk.
            </li>
            <li className='my-2'>
              No Rush, No Fuss – We respect your time and your style.
            </li>
            <li className="my-2">
              First-Timers & Regulars Welcome – Whether it’s your first fade or your fiftieth, we’ve got you.
            </li>
          </ul>
          <p className="mt-1">
            So pull up, kick back, and let us take care of the rest. At KhleanCutz, you don’t just get a haircut — you get leveled up.
          </p>
        </div>
      </MotionDiv>
    </div>
  )
}

export default About