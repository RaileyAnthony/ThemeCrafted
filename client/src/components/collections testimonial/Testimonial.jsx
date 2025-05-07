import React from "react";
import "./Testimonial.scss";

import { sampleProfile, quote } from "../../assets";
import { Link } from "react-router-dom";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, EffectFade, Controller } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/effect-fade";

import { testimonials } from "../../data";
import { useRef } from "react";

import { ArrowRight, ArrowLeft } from "lucide-react";

const Testimonial = () => {
  const monitorSwiperRef = useRef(null);
  const textSwiperRef = useRef(null);
  const themeSwiperRef = useRef(null);

  return (
    <div className="testimonial">
      <div className="container">
        <div className="left-side">
          <div className="device-mockup">
            <div className="monitor">
              <div className="screen">
                <Swiper
                  modules={[EffectFade, Controller]}
                  effect="fade"
                  loop={true} // 🔁 Add this
                  allowTouchMove={false}
                  onSwiper={(swiper) => {
                    monitorSwiperRef.current = swiper;
                  }}
                  controller={{ control: textSwiperRef.current }}
                >
                  {testimonials.map((item) => (
                    <SwiperSlide key={item.id}>
                      <img
                        src={item.img}
                        alt={`Screenshot of ${item.themTitle}`}
                      />
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            </div>
            <div className="monitor-base-top"></div>
            <div className="monitor-base-bottom"></div>
          </div>
          <div className="theme-details">
            <Swiper
              modules={[Controller]}
              loop={true} // 🔁 Add this
              allowTouchMove={false}
              onSwiper={(swiper) => {
                themeSwiperRef.current = swiper;
              }}
              controller={{ control: textSwiperRef.current }}
              className="fade-slide-swiper"
            >
              {testimonials.map((item) => (
                <SwiperSlide key={item.id}>
                  <p>
                    <Link className="link">{item.themTitle}</Link> •{" "}
                    <span className="price">${item.themePrice}</span>
                  </p>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>

        <div className="right-side">
          <Swiper
            modules={[Navigation, Controller]}
            loop={true} // 🔁 Add this
            navigation={{
              nextEl: ".swiper-next-btn",
              prevEl: ".swiper-prev-btn",
            }}
            onSwiper={(swiper) => {
              textSwiperRef.current = swiper;
              if (monitorSwiperRef.current && themeSwiperRef.current) {
                swiper.controller.control = [
                  monitorSwiperRef.current,
                  themeSwiperRef.current,
                ];
                monitorSwiperRef.current.controller.control = swiper;
                themeSwiperRef.current.controller.control = swiper;
              }
            }}
            className="testimonial-swiper"
          >
            {testimonials.map((item) => (
              <SwiperSlide key={item.id}>
                <div className="testimonial-container">
                  <img src={quote} className="quote" />
                  <h2>{item.quote}</h2>
                  <div className="user">
                    <img src={sampleProfile} className="profile" />
                    <p>
                      {item.user} • <span>{item.date}</span>
                    </p>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* NAV BUTTONS */}
          <div className="swiper-nav">
            <button className="swiper-prev-btn primary-btn">
              <ArrowLeft />
            </button>
            <button className="swiper-next-btn primary-btn">
              <ArrowRight />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Testimonial;
