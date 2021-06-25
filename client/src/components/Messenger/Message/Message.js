import React from "react";
import "./Message.css";

import { format } from "timeago.js";

const Message = ({ message, own, currentUser, senderUser }) => {
  return (
    <div className={own ? "message own" : "message"}>
      <div className="messageTop">
        <img
          className="messageImg"
          src={own ? currentUser.avatar : senderUser.avatar}
          alt=""
        ></img>
        <p className="messageText">{message.text}</p>
      </div>

      <div className="messageBottom">{format(message.createdAt)}</div>
    </div>
  );
};

export default Message;
