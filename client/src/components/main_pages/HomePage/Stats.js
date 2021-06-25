import React, { useEffect } from "react";
import styled from "styled-components";

import { GiEarthAmerica } from "react-icons/gi";
import { MdAirplanemodeActive, MdTimer } from "react-icons/md";
import { FaMoneyCheck } from "react-icons/fa";

import Aos from "aos";
import "aos/dist/aos.css";

const StatsData = [
  {
    icon: <GiEarthAmerica style={{ color: "#047bf1" }}></GiEarthAmerica>,
    title: "Over 20 Nations",
    desc: "Get access anytime over 20 countries",
  },
  {
    icon: (
      <MdAirplanemodeActive style={{ color: "#f3a82e" }}></MdAirplanemodeActive>
    ),
    title: "Thousands Payments",
    desc: "Over 3 thousands transaction completed last month",
  },
  {
    icon: <MdTimer style={{ color: "#f34f2e" }}></MdTimer>,
    title: "Fastest Support",
    desc: "Access our support team 24/7 through online chat",
  },
  {
    icon: <FaMoneyCheck style={{ color: "#3af576" }}></FaMoneyCheck>,
    title: "Best Deals",
    desc: "We offer the best prices",
  },
];

const Stats = () => {
  useEffect(() => {
    Aos.init({ duration: 800, offset: 400 });
  }, []);
  return (
    <StatsContainer>
      <div data-aos="fade-right">
        <Heading>Why Choose Us ?</Heading>
      </div>
      <div data-aos="fade-right">
        <Wrapper>
          {StatsData.map((item, index) => {
            return (
              <StatsBox key={index}>
                <Icon>{item.icon}</Icon>
                <Title>{item.title}</Title>
                <Description>{item.desc}</Description>
              </StatsBox>
            );
          })}
        </Wrapper>
      </div>
    </StatsContainer>
  );
};

export default Stats;

const StatsContainer = styled.div`
  width: 100%;
  background: #fff;
  color: #000;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 3rem calc((100vw - 1300px) / 2);
`;

const Heading = styled.h1`
  text-align: start;
  font-size: clamp(1.5rem, 5vw, 2rem);
  font-weight: bold;
  margin-bottom: 3rem;
  padding: 0 2rem;
`;

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-gap: 10px;
  margin-bottom: 3rem;

  @media screen and (max-width: 768px) {
    grid-template-columns: 1fr;
  }

  @media screen and (max-width: 500px) {
    grid-template-columns: 1fr;
  }
`;

const StatsBox = styled.div`
  height: 100%;
  width: 100%;
  padding: 2rem;
`;

const Icon = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
`;

const Title = styled.p`
  font-size: clamp(1rem, 2.5vw, 1.5rem);
  font-weight: 400;
  margin-bottom: 0.5rem;
`;

const Description = styled.p`
  font-size: 16px;
`;
