import React from "react";
import swal from "sweetalert";
import "./Notification.css";

export const showErrorMessage = (message) => {
  return (
    <div className="error-message">
      {message}
      {}
    </div>
  );
};

export const showSuccessMessage = (message) => {
  return <div className="success-message">{message}</div>;
};
