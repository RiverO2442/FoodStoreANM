import Button from "../../../headers/Button";
import "./HeroSection.css";
import intro_video from "../../../../video/intro-video.mp4";
import React, { useState, useContext, useEffect } from "react";
import { GlobalState } from "../../../../GlobalState";
const HeroSection = () => {
  const state = useContext(GlobalState);
  const [isLogged, setIsLogged] = state.userAPI.isLogged;
  return (
    <>
      <div className="hero-container">
        <video src={intro_video} autoPlay loop muted />
        <h1>FOOD HEAVEN</h1>
        <p>What are you waiting for?</p>
        <div className="hero-btns">
          <Button
            isLogged={isLogged}
            className="btns"
            buttonStyle="btn--outline"
            buttonSize="btn--large"
          >
            ORDER NOW !
          </Button>
          <Button
            isLogged={isLogged}
            className="btns"
            buttonStyle="btn--primary"
            buttonSize="btn--large"
          >
            GO SHOPPING <i className="far fa-play-circle"></i>
          </Button>
        </div>
      </div>
    </>
  );
};

export default HeroSection;
