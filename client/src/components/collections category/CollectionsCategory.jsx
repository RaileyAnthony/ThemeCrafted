import React from 'react'
import './CollectionsCategory.scss'
import { useNavigate } from 'react-router-dom';

// swiper import
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/autoplay';

import { categories } from '../../data'

const CollectionsCategory = () => {
  const navigate = useNavigate();
  
  const mapCategoryToGigsId = (categoryId) => {
    // Handle case where the entire category object is passed instead of just the ID
    if (typeof categoryId === 'object' && categoryId !== null) {
      // Try to extract the ID if it exists
      if (categoryId.id) {
        categoryId = categoryId.id;
      } else {
        // Fallback to first category if we can't extract an ID
        return "ecommerce";
      }
    }
    
    // Convert to string to handle number IDs
    categoryId = String(categoryId);
    
    // Check known mappings
    const mappings = {
      "1": "ecommerce",
      "2": "booking",
      "3": "portfolio",
      "4": "restaurant",
      "5": "tech-startup"
    };
    
    return mappings[categoryId] || "ecommerce";
  };
  
  const handleCategoryClick = (category) => {
    // Extract the category ID safely
    const categoryId = typeof category === 'object' && category !== null 
      ? category.id 
      : category;
    
    // Map the category ID to one that Gigs component will recognize
    const gigsComponentId = mapCategoryToGigsId(categoryId);
    
    // Navigate to gigs page with the mapped category ID
    navigate(`/gigs?cat=${gigsComponentId}`);
  };

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
                <div 
                  className="category-slider-card" 
                  onClick={() => handleCategoryClick(category)}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="icon">  
                    <img src={category.svg}/>
                  </div>
                  <div className="details">
                    <h3>{category.title}</h3>
                    <p>{category.desc}</p>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </div>
  )
}

export default CollectionsCategory