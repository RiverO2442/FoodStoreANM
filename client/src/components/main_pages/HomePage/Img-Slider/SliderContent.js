import React from "react";

import { SliderData } from "./SliderData";

const SliderContent = ({ activeIndex }) => {
  return (
    <>
      <section className="slides">
        {SliderData.map((slide, index) => (
          <div
            key={index}
            className={index === activeIndex ? "slide active" : "slide"}
          >
            <img
              className="slide-image"
              src={slide.img_url}
              alt="food image"
            ></img>
            <h3 className="slide-title">{slide.title}</h3>
            <p className="slide-text">{slide.description}</p>
          </div>
        ))}
      </section>
    </>
  );
};

export default SliderContent;
