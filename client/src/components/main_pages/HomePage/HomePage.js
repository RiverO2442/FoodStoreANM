import React, { useContext, useState, useEffect } from "react";

import HeroSection from "./hero_sections/HeroSection";
import Cards from "./card_items/Cards";

import Grid_cards from "./Grid_cards/Grid-cards";

import PopUp from "../discounts/Controls/PopUp";

import Quotes from "./quotes/Quotes";

import Testimonials from "./Testimonials";

import Stats from "./Stats";

import { GlobalState } from "../../../GlobalState";

import axios from "axios";

import { motion } from "framer-motion";

const HomePage = () => {
  const [openPopUp, setOpenPopUp] = useState(true);

  const state = useContext(GlobalState);
  const [token] = state.token;

  const [user] = state.userAPI.user;

  const [isAdmin] = state.userAPI.isAdmin;

  useEffect(() => {
    const createNewConversation = async () => {
      if (!isAdmin) {
        const newConversation = {
          senderID: user._id,
          receiverID: "60866ea90567e02b1422693f", // admin nhận
        };

        await axios.post("/api/newConversation", newConversation, {
          headers: { Authorization: token },
        });
      }
    };
    createNewConversation();
  }, [isAdmin, user._id]);

  return (
    <motion.div
      exit={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      initial={{ opacity: 0 }}
    >
      {/* <PopUp openPopUp={openPopUp} setOpenPopUp={setOpenPopUp} title="">
        <Quotes></Quotes>
      </PopUp> */}
      <HeroSection></HeroSection>
      <Grid_cards></Grid_cards>
      <Cards></Cards>
      <Testimonials></Testimonials>
      <Stats></Stats>
    </motion.div>
  );
};

export default HomePage;
