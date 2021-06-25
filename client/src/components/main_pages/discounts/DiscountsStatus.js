import React from "react";
import moment from "moment";

const DiscountsStatus = ({ expireTime }) => {
  let currentDate = moment(new Date()).format("DD.MM.YYYY");
  let discountExpireTime = moment(new Date(expireTime)).format("DD.MM.YYYY");

  const validStatus = () => {
    return (
      <div>
        <span style={{ marginRight: "8px", fontWeight: 500 }}> Active</span>

        <i className={"fas fa-check-circle"} style={{ color: "green" }}></i>
      </div>
    );
  };

  const invalidStatus = () => {
    return (
      <div>
        <span style={{ marginRight: "8px", fontWeight: 500 }}> Expire</span>
        <i className={"fas fa-times-circle"} style={{ color: "red" }}></i>
      </div>
    );
  };

  return (
    <div>
      {currentDate <= discountExpireTime ? validStatus() : invalidStatus()}
    </div>
  );
};

export default DiscountsStatus;
