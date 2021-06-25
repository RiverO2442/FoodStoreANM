import React from "react";

import { SliderData } from "./SliderData";

const Dots = ({ activeIndex, onClick }) => {
  return (
    <div className="all-dots">
      {SliderData.map((slide, index) => (
        <span
          key={index}
          className={`${activeIndex === index ? "dot active-dot" : "dot"}`}
          onClick={() => onClick(index)}
        ></span>
      ))}
    </div>
  );
};

export default Dots;
