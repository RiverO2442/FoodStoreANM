import React, { useState, useEffect } from "react";

import styled from "styled-components";

import { IoMdCheckmarkCircleOutline } from "react-icons/io";

import { FaRegLightbulb } from "react-icons/fa";

import testimonialImg1 from "../../../images/testimonial-1.jpg";

import testimonialImg2 from "../../../images/testimonial-2.jpg";

import Aos from "aos";
import "aos/dist/aos.css";

const Testimonials = () => {
  const testimonialImages = useState([testimonialImg1, testimonialImg2]);
  useEffect(() => {
    Aos.init({ duration: 800, offset: 400 });
  }, []);

  return (
    <TestimonialsContainer>
      <div data-aos="fade-right">
        <TopLine>Testimonials</TopLine>
        <Description>What People Are Saying ?</Description>
      </div>
      <ContentWrapper>
        <Column1>
          <div data-aos="fade-right">
            <Testimonial>
              <IoMdCheckmarkCircleOutline
                style={{
                  color: "#3fffa8",
                  fontSize: "2rem",
                  marginBottom: "1rem",
                }}
              ></IoMdCheckmarkCircleOutline>
              <h3>Sean Michaels</h3>
              <p style={{ fontWeight: 500, fontSize: "15px" }}>
                "The greatest experience of my life! It was so pleased and they
                made it super easy to place my order."
              </p>
            </Testimonial>
          </div>
          <div data-aos="fade-right">
            <Testimonial>
              <FaRegLightbulb
                style={{
                  color: "#f9b19b",
                  fontSize: "2rem",
                  marginBottom: "1rem",
                }}
              ></FaRegLightbulb>
              <h3>Sarah Kin</h3>
              <p style={{ fontWeight: 500, fontSize: "15px" }}>
                "It was so easy to set up my menu! They answered all my
                questions right away and give me the best price out of all the
                store that I researched."
              </p>
            </Testimonial>
          </div>
        </Column1>
        <Column2>
          <div data-aos="fade-up">
            <Images src={testimonialImg1}></Images>
          </div>
          <div data-aos="fade-up">
            <Images src={testimonialImg2}></Images>
          </div>
        </Column2>
      </ContentWrapper>
    </TestimonialsContainer>
  );
};

export default Testimonials;

const TestimonialsContainer = styled.div`
  width: 100%;
  background: #fcfcfc;
  color: #000;
  padding: 5rem calc((100vw - 1300px) / 2);
  height: 100%;
`;

const TopLine = styled.p`
  color: #077bf1;
  font-size: 1rem;
  padding-left: 2rem;
  margin-bottom: 0.75rem;
`;

const Description = styled.p`
  text-align: start;
  padding-left: 2rem;
  margin-bottom: 4rem;
  font-size: clamp(1.5rem, 5vw, 2rem);
  font-weight: bold;
`;

const ContentWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  padding: 0 2rem;

  @media screen and (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const Column1 = styled.div`
  display: grid;
  grid-template-rows: 1fr 1fr;
`;

const Testimonial = styled.div`
  padding-top: 1rem;
  padding-right: 2rem;

  h3 {
    margin-bottom: 1rem;
    font-size: 1.5rem;
    font-style: italic;
  }

  p {
    color: #3b3b3b;
  }
`;

const Column2 = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  margin-top: 2rem;
  grid-gap: 10px;

  @media screen and (max-width: 500px) {
    grid-template-columns: 1fr;
  }
`;

const Images = styled.img`
  border-radius: 10px;
  height: 500px;
`;
