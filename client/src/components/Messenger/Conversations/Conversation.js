import React, { useState, useEffect, useContext } from "react";
import "./Conversation.css";

import { GlobalState } from "../../../GlobalState";

import axios from "axios";

const Conversation = ({ conversation, currentUser }) => {
  const state = useContext(GlobalState);
  const [token] = state.token;
  const [isAdmin] = state.userAPI.isAdmin;

  // này là user chứa thông tin danh bạ của người liên hệ
  // là ng contact á
  const [contact, setContact] = useState([]);

  useEffect(() => {
    // danh bạ chứa thông tin người nói chuyện với mình nên loại mình ra
    const checkIsAdmin = async () => {
      if (!isAdmin) {
        const contactID = conversation.members.find(
          (m) => m !== currentUser._id
        );
        getUserById(contactID);
      } else {
        const checkRoleID = conversation.members[0];
        const res = await axios.get(`/user/findUser/${checkRoleID}`, {
          headers: { Authorization: token },
        });
        const checkUser = res.data;
        if (checkUser.role === 1) {
          const contactID = conversation.members[1];
          getUserById(contactID);
        } else {
          const contactID = checkRoleID;
          getUserById(contactID);
        }
      }
    };

    const getUserById = async (contactID) => {
      if (contactID) {
        try {
          const res = await axios.get(`/user/findUser/${contactID}`, {
            headers: { Authorization: token },
          });
          setContact(res.data);
        } catch (error) {
          alert(error.response.data.msg);
        }
      }
    };
    checkIsAdmin();
  }, [currentUser, conversation, isAdmin]);

  return (
    <div className="conversation">
      <img
        src={contact.avatar}
        className="conversationImg"
        alt="contact image"
      ></img>
      <span className="conversationName">{contact.name}</span>
    </div>
  );
};

export default Conversation;
