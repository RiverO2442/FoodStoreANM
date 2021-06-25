import React, { useContext } from "react";
import { GlobalState } from "../../GlobalState";

import "./UserActive.css";

const UserActive = ({ userID }) => {
  const state = useContext(GlobalState);
  const [user] = state.userAPI.user;
  return (
    <div className="user-status">
      <div className={user._id === userID ? "circle-active" : "circle"}></div>
      <span className="status-description">
        {user._id === userID ? "Active" : "Offline"}
      </span>
    </div>
  );
};

export default UserActive;
