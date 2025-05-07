import React, { useEffect, useRef, useState } from "react";
import "./CollectionsHero.scss";
import { ArrowRight } from "lucide-react";
import { ArrowLeft } from "lucide-react";

// image imports
import { pop, underline2 } from "../../assets";

// swiper import
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

import { heroSlides } from "../../data";
import slide1 from "../../assets/Slide 1.png";

// Generate random colored blocks and persist with localStorage
const generateAndPersistBlocks = () => {
  // Check if blocks already exist in localStorage
  const storedBlocks = localStorage.getItem("heroRandomBlocks");

  if (storedBlocks) {
    // If blocks exist in storage, use them
    return JSON.parse(storedBlocks);
  } else {
    // Otherwise, generate new blocks
    const blocks = [];
    const colors = [
      "rgba(var(--primary-color), 0.1)",
      "rgba(var(--secondary-color), 0.1)",
      "rgba(var(--accent-color), 0.1)",
    ];

    for (let i = 0; i < 20; i++) {
      blocks.push({
        x: Math.floor(Math.random() * 20),
        y: Math.floor(Math.random() * 10),
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    // Store the new blocks in localStorage for future use
    localStorage.setItem("heroRandomBlocks", JSON.stringify(blocks));
    return blocks;
  }
};

// Get blocks (either from localStorage or generate new ones)
const randomBlocksData =
  typeof window !== "undefined" ? generateAndPersistBlocks() : [];

const CollectionsHero = () => {
  // Use the pre-generated blocks instead of generating them in state
  const [randomBlocks] = useState(randomBlocksData);

  const prevRef = useRef(null);
  const nextRef = useRef(null);
  const [exitingIndex, setExitingIndex] = useState(null);
  const [hiddenSlides, setHiddenSlides] = useState(new Set());
  const [isAnimating, setIsAnimating] = useState(false);
  const [direction, setDirection] = useState(null); // 'next' or 'prev'
  const swiperRef = useRef(null);

  // Effect to update button states based on slider position
  useEffect(() => {
    // Function to update button states
    const updateButtonStates = () => {
      if (!swiperRef.current) return;

      // Get references to the buttons
      const prevButton = prevRef.current;
      const nextButton = nextRef.current;

      if (prevButton && nextButton) {
        // Check if at first slide
        if (swiperRef.current.activeIndex === 0) {
          prevButton.classList.add("button-disabled");
        } else {
          prevButton.classList.remove("button-disabled");
        }

        // Check if at last slide
        if (
          swiperRef.current.activeIndex ===
          swiperRef.current.slides.length - 1
        ) {
          nextButton.classList.add("button-disabled");
        } else {
          nextButton.classList.remove("button-disabled");
        }
      }
    };

    // Set up an event listener for slide changes
    if (swiperRef.current) {
      swiperRef.current.on("slideChange", updateButtonStates);
      // Initial state
      updateButtonStates();
    }

    // Clean up the event listener
    return () => {
      if (swiperRef.current) {
        swiperRef.current.off("slideChange", updateButtonStates);
      }
    };
  }, [swiperRef.current]); // Only run this effect when the Swiper instance changes

  // This is now only handling the ACTUAL transition, not initiating it
  const handleSlideChange = (swiper) => {
    const prev = swiper.previousIndex;
    const curr = swiper.activeIndex;

    // This function will now only be triggered after our manual delay
    if (curr > prev) {
      // moving forward → hide the old slide after its animation
      setTimeout(() => {
        setHiddenSlides((s) => new Set(s).add(prev));
        setExitingIndex(null);
        setIsAnimating(false);
      }, 200); // short delay after slide change
    } else {
      // moving backward → un-hide the current slide immediately
      setHiddenSlides((s) => {
        const copy = new Set(s);
        copy.delete(curr);
        return copy;
      });

      // Note: We don't need to reset exitingIndex here anymore
      // as we're handling it in the handlePrev function
      // This is to avoid conflicts with our custom animation
      if (!isAnimating) {
        setTimeout(() => {
          setExitingIndex(null);
          setIsAnimating(false);
        }, 200); // short delay after slide change
      }
    }
  };

  // Custom navigation handlers with direction-aware animations
  const handlePrev = () => {
    if (!isAnimating && swiperRef.current) {
      // Check if we're on the first slide - if so, don't animate
      if (swiperRef.current.activeIndex === 0) {
        return; // Do nothing if we're on the first slide
      }

      // 1. Start animation sequence
      setIsAnimating(true);

      // 2. Set direction to previous for the CSS animation to pick up
      setDirection("prev");

      // 3. Check if we're going to the last slide - if so, don't use animation
      const goingToLastSlide =
        swiperRef.current.activeIndex - 1 ===
        swiperRef.current.slides.length - 1;

      if (goingToLastSlide) {
        // Skip animation for last slide, just change immediately
        swiperRef.current.slidePrev();
        // Reset animation state
        setTimeout(() => {
          setIsAnimating(false);
        }, 200);
      } else {
        // 4. First move to the previous slide immediately
        swiperRef.current.slidePrev();

        // 5. Then set the exiting index to the current slide (which is now the one we moved to)
        setTimeout(() => {
          setExitingIndex(swiperRef.current.activeIndex);

          // 6. Reset animation state after animation completes
          setTimeout(() => {
            setExitingIndex(null);
            setIsAnimating(false);
          }, 600); // Full animation duration
        }, 50); // Short delay to ensure slide transition has completed
      }
    }
  };

  const handleNext = () => {
    if (!isAnimating && swiperRef.current) {
      // Check if we're on the last slide - if so, don't animate
      if (
        swiperRef.current.activeIndex ===
        swiperRef.current.slides.length - 1
      ) {
        return; // Do nothing if we're on the last slide
      }

      // 1. Start animation sequence
      setIsAnimating(true);

      // 2. Set direction to next for the CSS animation to pick up
      setDirection("next");

      // 3. Trigger fade animation on current slide
      setExitingIndex(swiperRef.current.activeIndex);

      // 4. Wait for fade animation to be mostly complete before changing slide
      setTimeout(() => {
        // Move to next slide when animation is about 75% complete
        swiperRef.current.slideNext();
      }, 600); // 75% of the animation duration (800ms)
    }
  };

  return (
    <div className="collections-hero">
      <div className="grid-bg">
        {/* Rendering the colored blocks */}
        {randomBlocks.map((block, index) => (
          <div
            key={index}
            className="colored-block"
            style={{
              left: `${block.x * 70}px`,
              top: `${block.y * 70}px`,
              backgroundColor: block.color,
            }}
          />
        ))}

        <div className="grid-overlay" />
        <div className="container">
          <div className="left-side">
            <div className="title">
              <h1>
                <span className="underline-target">
                  <span className="text">Curated & Crafted</span>
                  <img src={underline2} className="line" />
                </span>{" "}
                for{" "}
                <span className="pop-target">
                  {" "}
                  Every Business
                  <img src={pop} className="pop" />
                </span>
              </h1>
            </div>
            <p>
              Explore expertly crafted theme collections tailored to industries,
              styles, and goals — all handpicked to help you design with purpose
              and launch with confidence.
            </p>
            <div className="slider-nav">
              <button
                ref={prevRef}
                className="primary-btn"
                onClick={handlePrev}
              >
                <ArrowLeft />
              </button>
              <button
                ref={nextRef}
                className="primary-btn"
                onClick={handleNext}
              >
                <ArrowRight />
              </button>
            </div>
          </div>

          <div className="right-side">
            <Swiper
              onSwiper={(swiper) => {
                swiperRef.current = swiper;
              }}
              onSlideChange={handleSlideChange}
              modules={[Navigation]}
              spaceBetween={20}
              speed={600}
              slidesPerView={1}
              allowTouchMove={false} // Prevent touch navigation during animation
              className="hero-swiper"
            >
              {heroSlides.map((slide, index) => {
                // compute per-slide flags:
                const isExiting = exitingIndex === index;
                const isHidden = hiddenSlides.has(index);
                // assemble the className string with direction-aware animation className:
                const classNames = [
                  isExiting
                    ? direction === "next"
                      ? "exiting-slide-down"
                      : "exiting-slide-up"
                    : "",
                  isHidden ? "hidden-slide" : "",
                ]
                  .filter(Boolean)
                  .join(" ");

                return (
                  <SwiperSlide key={slide.id} className={classNames}>
                    <div className="slide-card">
                      <img src={slide.img} className="slide-bg" />
                      <div className="slide-overlay" />
                      <div className="text">
                        <h4>{slide.title}</h4>
                      </div>
                    </div>
                  </SwiperSlide>
                );
              })}
            </Swiper>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollectionsHero;
