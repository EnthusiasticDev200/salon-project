import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Grid } from 'swiper/modules';
import { motion } from "framer-motion";
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/grid';

const items = [
  { title: 'Signature Fade', color: 'bg-yellow-500', price: 500 },
  { title: 'Beard Sculpt', color: 'bg-red-500', price: 500 },
  { title: 'Hot Towel Shave', color: 'bg-blue-500', price: 500 },
  { title: 'Full Groom', color: 'bg-green-500', price: 500 },
  { title: 'Hair Braiding', color: 'bg-pink-500', price: 500 },
  { title: 'Custom Cuts', color: 'bg-purple-500', price: 500 },
  { title: 'Walk-ins', color: 'bg-orange-500', price: 500 },
  { title: 'Shampoo & Dry', color: 'bg-gray-500', price: 500 },
];

const Prices = () => {
  return (
    <div className='py-12 px-6 md:px-24' id='prices'>
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        viewport={{ once: true }}
      >
        <div className="text-center my-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-2">Our Prices</h2>
          <p className="text-xl font-light">Check out the prices for our services</p>
        </div>
        <Swiper
          modules={[Navigation, Pagination, Grid]}
          spaceBetween={20}
          slidesPerView={2}
          grid={{
            rows: 1,
            fill: 'row',
          }}
          pagination={{ clickable: true }}
          navigation
          breakpoints={{
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
          className="!pb-12"
        >
          {items.map((item, index) => (
            <SwiperSlide key={index}>
              <div
                className={`rounded-xl h-40 flex flex-col items-center justify-center text-white text-center text-lg shadow-md ${item.color}`}
              >
                <p className='text-xl'>{item.title}</p>
                <p className='text-2xl font-bold'>&#8358;{item.price}</p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </motion.div>
      
    </div>
  );
};

export default Prices;
