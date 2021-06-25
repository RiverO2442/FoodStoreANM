import React, { useState, useEffect, useContext } from "react";

import "./ChatOnline.css";

import { GlobalState } from "../../../GlobalState";

import axios from "axios";

const ChatOnline = ({ onlineUsers, currentUserId, setCurrentConversation }) => {
  const state = useContext(GlobalState);
  const [token] = state.token;
  const [isAdmin] = state.userAPI.isAdmin;

  const [onlineFriends, setOnlineFriends] = useState([]);

  const [friends, setFriends] = useState([]);

  useEffect(() => {
    const getFriends = async () => {
      if (isAdmin) {
        const res = await axios.get("/api/getUserConversation", {
          headers: { Authorization: token },
        });
        setFriends(res.data);
      } else {
        const res = await axios.get("/user/findAnswerAdmin", {
          headers: { Authorization: token },
        });
        setFriends(res.data);
      }
    };
    getFriends();
  }, [isAdmin]);

  useEffect(() => {
    setOnlineFriends(
      friends.filter((friend) => onlineUsers.includes(friend._id))
    );
  }, [friends, onlineUsers]);

  const handleClick = async (friend) => {
    try {
      const res = await axios.get(
        `/api/findConversation/${currentUserId}/${friend._id}`,
        {
          headers: { Authorization: token },
        }
      );
      setCurrentConversation(res.data);
    } catch (error) {
      alert(error.response.data.msg);
    }
  };

  return (
    <div className="chatOnline">
      {onlineFriends.map((onlineFriend) => (
        <div
          className="chatOnlineCustomer"
          onClick={() => {
            handleClick(onlineFriend);
          }}
        >
          <div className="chatOnlineImgContainer">
            <img
              className="chatOnlineImg"
              src={onlineFriend.avatar}
              alt=""
            ></img>
            <div className="chatOnlineBadge"></div>
          </div>
          <span className="chatOnlineName">{onlineFriend.name}</span>
        </div>
      ))}
    </div>
  );
};

export default ChatOnline;
