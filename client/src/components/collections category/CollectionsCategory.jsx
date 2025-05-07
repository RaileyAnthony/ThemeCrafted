import React from 'react'
import './CollectionsCategory.scss'

// swiper import
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/autoplay';

import { categories } from '../../data'
import { Link } from 'react-router-dom';

const CollectionsCategory = () => {
  return (
    <div className='collections-category'>
      <div className="container">
        <div className="title-desc">
          <h2>Explore By Category</h2>
          <p>Browse handcrafted templates by category and bring your ideas to life.</p>
        </div>
        <div className="category-slider">
        <Swiper
            modules={[Navigation, Autoplay]}
            navigation={true}
            speed={1200}
            loop={true}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            breakpoints={{
              640: {
                slidesPerView: 2,
                spaceBetween: 12,
              },
              768: {
                slidesPerView: 3,
                spaceBetween: 15,
              },
              1024: {
                slidesPerView: 4,
                spaceBetween: 20,
              },
            }}
            className="mySwiper"
          >
            <div className="fade-right"></div>
            <div className="fade-left"></div>
            {categories.map((category) => (
              <SwiperSlide key={category.id}>
                <Link className="category-slider-card" to="#">
                  <div className="icon">  
                    <img src={category.svg}/>
                  </div>
                  <div className="details">
                    <h3>{category.title}</h3>
                    <p>{category.desc}</p>
                  </div>
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </div>
  )
}

export default CollectionsCategory