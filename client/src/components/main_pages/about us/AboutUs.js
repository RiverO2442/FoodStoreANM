import React, { useEffect } from "react";

import InfoSection from "../../InfoSection/InfoSection";

import Services from "../../Services/Services";

import "./AboutUs.css";

import Aos from "aos";
import "aos/dist/aos.css";

import { homeObjOne, homeObjThree, homeObjTwo } from "../../InfoSection/Data";

const AboutUs = () => {
  useEffect(() => {
    Aos.init({ duration: 800, offset: 500 });
  }, []);

  return (
    <div>
      <div className="about-container">
        <h1>About Us</h1>
      </div>
      <div data-aos="fade-up">
        <InfoSection {...homeObjOne}></InfoSection>
      </div>
      <div data-aos="fade-left">
        <InfoSection {...homeObjTwo}></InfoSection>
      </div>
      <div data-aos="fade-right">
        <InfoSection {...homeObjThree}></InfoSection>
      </div>

      <Services></Services>
    </div>
  );
};

export default AboutUs;
