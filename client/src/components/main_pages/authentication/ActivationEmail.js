import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
  showErrorMessage,
  showSuccessMessage,
} from "../Utils/Notification/Notification";
import Notification from "../discounts/Controls/Notification";

const ActivationEmail = () => {
  const { activation_token } = useParams();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (activation_token) {
      const activationEmail = async () => {
        try {
          const res = await axios.post("/user/activation", {
            activation_token,
          });
          setSuccess(res.data.msg);
          setNotify({
            isOpen: true,
            message: "Active Successfully",
            type: "success",
          });
        } catch (error) {
          error.response.data.msg && setError(error.response.data.msg);
          setNotify({
            isOpen: true,
            message: "Activation Code is incorrect",
            type: "error",
          });
        }
      };
      activationEmail();
    }
  }, [activation_token]);

  const [notify, setNotify] = useState({
    isOpen: false,
    message: "",
    type: "",
  });

  return (
    <div className="active_page" style={{ minHeight: "600px" }}>
      <Notification notify={notify} setNotify={setNotify}></Notification>
    </div>
  );
};

export default ActivationEmail;
