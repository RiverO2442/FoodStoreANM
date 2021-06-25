import React, { useState, useEffect } from "react";
import { SliderData } from "./SliderData";
import Arrows from "./Arrow";
import Dots from "./Dots";
import SliderContent from "./SliderContent";
import "./Slider.css";

const Slider = () => {
  //current Slide
  const [activeIndex, setActiveIndex] = useState(0);

  const slidesLength = SliderData.length;

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex(activeIndex === slidesLength - 1 ? 0 : activeIndex + 1);
    }, 3000);
    return () => clearInterval(interval);
  }, [activeIndex]);

  const nextSlide = () => {
    setActiveIndex(activeIndex === slidesLength - 1 ? 0 : activeIndex + 1);
  };
  const prevSlide = () => {
    setActiveIndex(activeIndex === 0 ? slidesLength - 1 : activeIndex - 1);
  };

  const handleDotsClick = (activeIndex) => {
    setActiveIndex(activeIndex);
  };
  return (
    <div className="slider-container">
      <div className="best-seller">
        <i className="fa fa-gift fa-4x" aria-hidden="true"></i>
        <h1>BEST SELLER</h1>
      </div>
      <SliderContent activeIndex={activeIndex}></SliderContent>
      <Arrows prevSlide={prevSlide} nextSlide={nextSlide}></Arrows>
      <Dots activeIndex={activeIndex} onClick={handleDotsClick}></Dots>
    </div>
  );
};

export default Slider;
