import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, EffectFade, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';
import Bg1 from "./../../assets/bg1.jpg";
import Bg2 from "./../../assets/bg2.jpg";
import Bg3 from "./../../assets/bg3.jpg";

const Hero = () => {
  const slides = [
    { id: 1, textHeading: 'Look Sharp. Stay Fresh', textBody: 'Step into the spotlight with a cut that speaks confidence. Clean fades, sharp lines, and unmatched precision', image: Bg1 },
    { id: 2, textHeading: 'The Experience Hits Different', textBody: 'KhleanCutz isn’t just a barbershop — it’s a culture. Vibes on point, service on lock. Come for the cut, stay for the energy', image: Bg2 },
    { id: 3, textHeading: 'Your Next Level Starts Here', textBody: 'Whether it’s an interview, date, or just self-care — leave the shop ready to win. We cut, you conquer', image: Bg3 },
  ];
  return (
    <div className='h-screen w-full' id='home'>
      <Swiper
        modules={[Pagination, EffectFade, Autoplay]}
        effect="fade"
        pagination={{ clickable: true }}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        loop
        className="h-full w-full"
      >
        {
          slides.map(
            slide => (
              <SwiperSlide key={slide.id} className='relative'>
                <div className="absolute w-full h-full bg-black/70 top-0 left-0 z-40 flex justify-center items-center flex-col text-white text-center">
                  <h1 className="text-3xl md:text-5xl font-bold">{ slide.textHeading }</h1>
                  <p className='px-6 md:px-24 my-3 text-xl font-light'>{ slide.textBody }</p>
                </div>
                <img src={slide.image} alt="" className='absolute top-0 left-0 h-full w-full object-cover' />
              </SwiperSlide>
            )
          )
        }
      </Swiper>
    </div>
  )
}

export default Hero