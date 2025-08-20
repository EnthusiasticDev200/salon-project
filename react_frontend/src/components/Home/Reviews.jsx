import { useState, useEffect } from 'react';
import MotionDiv from '../Layout/MotionDiv';
import Card from "./../ui/Card";
import { viewReviews } from '../Request/api';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Grid } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/grid';

const Reviews = () => {
  const [reviews, setReviews] = useState([])
  
useEffect(() => {
  const loadReviews = async () => {
    try {
      const response = await getReviews(); // from context or API file
      const data = response.data;

      if (Array.isArray(data)) {
        setReviews(data);
      } else if (Array.isArray(data.reviews)) {
        setReviews(data.reviews);
      } else {
        console.error("Unexpected response format:", data);
        setReviews([]);
      }
    } catch (error) {
      console.error("Error loading reviews:", error);
      setReviews([]);
    }
  };

  loadReviews();
}, []);  

  return (
    <div className='py-12 px-6 md:px-24' id='prices'>
      <MotionDiv>
        <div className="text-center my-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-2">Reviews</h2>
          <p className="text-xl font-light">Check out what our customers say about us</p>
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
          {reviews.map((review, index) => (
            <SwiperSlide key={index}>
              <Card key={index} className={'text-center'}>
                <p className='italic mb-2'>"{ review.feedback }"</p>
                <p className='mb-2'>{ review.hair_style }</p>
                <p className="font-bold">{ review.username }</p>
              </Card>
            </SwiperSlide>
          ))}
        </Swiper>
      </MotionDiv>
    </div>
  )
}

export default Reviews