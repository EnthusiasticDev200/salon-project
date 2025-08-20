import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Grid } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/grid';
import { useState, useContext, useEffect } from 'react';
import { AdminAuthContext } from '../Context/AdminAuthContext';
import MotionDiv from '../Layout/MotionDiv';

const colors = ['bg-yellow-500', 'bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-pink-500' ,'bg-purple-500', 'bg-orange-500', 'bg-gray-500'];

const Prices = () => {
  const [services, setServices] = useState([])
  const { getServices } = useContext(AdminAuthContext)

  useEffect(() => {
    const loadServices = async () => {
      try {
        const response = await getServices();
        const data = response.data;
  
        // Fix: Handle both array and object response
        if (Array.isArray(data)) {
          setServices(data);
        } else if (Array.isArray(data.services)) {
          setServices(data.services);
        } else {
          console.error("Unexpected response format:", data);
          setServices([]); // fallback to empty array
        }
      } catch (error) {
        console.log(error);
      }
    };
  
    loadServices();
  }, []);
  

  const filteredServices = services.map((service, index) => ({
    title: service.hair_style, 
    price: service.price,
    color: colors[index]
  }))
  return (
    <div className='py-12 px-6 md:px-24' id='prices'>
      <MotionDiv>
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
          {filteredServices.map((serv, index) => (
            <SwiperSlide key={index}>
              <div
                className={`rounded-xl h-40 flex flex-col items-center justify-center text-white text-center text-lg shadow-md ${serv.color}`}
              >
                <p className='text-xl'>{serv.title}</p>
                <p className='text-2xl font-bold'>&#8358;{serv.price}</p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </MotionDiv>
      
    </div>
  );
};

export default Prices;
