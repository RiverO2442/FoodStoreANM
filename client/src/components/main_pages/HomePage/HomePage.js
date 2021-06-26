import axios from 'axios';
import { motion } from 'framer-motion';
import React, { useContext, useEffect } from 'react';
import { GlobalState } from '../../../GlobalState';
import Cards from './card_items/Cards';
import GRID_CARDS from './Grid_cards/Grid-cards';
import HeroSection from './hero_sections/HeroSection';
import Stats from './Stats';
import Testimonials from './Testimonials';

const HomePage = () => {
  // const [openPopUp, setOpenPopUp] = useState(true);

  const state = useContext(GlobalState);
  const [token] = state.token;

  const [user] = state.userAPI.user;

  const [isAdmin] = state.userAPI.isAdmin;

  useEffect(() => {
    const createNewConversation = async () => {
      if (!isAdmin) {
        const newConversation = {
          senderID: user._id,
          receiverID: '60866ea90567e02b1422693f', // admin nhận
        };

        await axios.post('/api/newConversation', newConversation, {
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
      <GRID_CARDS></GRID_CARDS>
      <Cards></Cards>
      <Testimonials></Testimonials>
      <Stats></Stats>
    </motion.div>
  );
};

export default HomePage;
