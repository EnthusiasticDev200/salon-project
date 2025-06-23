// components/GridSwiper.jsx
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Grid } from 'swiper/modules';
import { motion, useAnimation } from "framer-motion";
import Img from "./../../assets/bg1.jpg";
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/grid';
import MotionDiv from '../Layout/MotionDiv';

const items = [
  { name: 'Scott Lang', pImg: Img, title: 'Barber/Stylist' },
  { name: 'Steve Rogers', pImg: Img, title: 'Barber/Stylist' },
  { name: 'Natasha Romanov', pImg: Img, title: 'Barber/Stylist' },
  { name: 'Wanda Maximoff', pImg: Img, title: 'Barber/Stylist' },
  { name: 'Tony Stark', pImg: Img, title: 'Barber/Stylist' },
];

const Team = () => {
  return (
    <div className='py-12 px-6 md:px-24' id='team'>
      <MotionDiv>
        <div className="text-center my-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-2">Our Team</h2>
          <p className="text-xl font-light">Check out our styling professionals</p>
        </div>
        <Swiper
          modules={[Navigation, Pagination, Grid]}
          spaceBetween={20}
          slidesPerView={1}
          grid={{
            rows: 1,
            fill: 'row',
          }}
          pagination={{ clickable: true }}
          navigation
          breakpoints={{
            640: { slidesPerView: 1 },
            1024: { slidesPerView: 4 },
          }}
          className="!pb-12"
        >
          {items.map((item, index) => {
            const controls = useAnimation()

            const handleHoverStart = () => {
              controls.start({ y: 0 })
            }
          
            const handleHoverEnd = () => {
              controls.start({ y: '100%' });
            };

            return (
              <SwiperSlide key={index}>
                <div
                  className={`rounded-2xl h-[400px] md:h-[450px] text-white text-lg shadow-md bg-[#222] p-2 border-4 border-[#e0b836] relative group overflow-hidden`}
                  onMouseEnter={handleHoverStart}
                  onMouseLeave={handleHoverEnd}
                >
                  <img src={item.pImg} alt="" className='h-full w-full object-cover rounded-xl' />
                  <motion.div 
                    initial={{ y: '100%' }}
                    animate={controls}
                    whileHover={{ y: 0 }}
                    transition={{ duration: 0.4, ease: 'easeOut' }}
                    className="my-2 bg-black/70 absolute w-full p-4 bottom-0 group-hover:cursor-pointer"
                  >
                    <p className='font-semibold'>{item.name}</p>
                    <p className='font-light text-sm'>{item.title}</p>
                  </motion.div>
                </div>
              </SwiperSlide>
            )
          })}
        </Swiper>
      </MotionDiv>
    </div>
    
  );
};

export default Team;
