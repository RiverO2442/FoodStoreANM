import React, { useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import {
  showErrorMessage,
  showSuccessMessage,
} from "../Utils/Notification/Notification";
import { isLength, isMatch } from "../Utils/Validation/Validation";

const initialState = {
  password: "",
  confirm_password: "",
  error: "",
  success: "",
};

const ResetPassword = () => {
  const [data, setData] = useState(initialState);

  const { token } = useParams();

  const { password, confirm_password, error, success } = data;

  const handleChangeInput = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value, error: "", success: "" });
  };

  const resetPassword = async () => {
    if (isLength(password)) {
      return setData({
        ...data,
        error: "Password must be at least 6 characters.",
        success: "",
      });
    }
    if (!isMatch(password, confirm_password)) {
      return setData({
        ...data,
        error: "Passwords do not match !",
        success: "",
      });
    }

    try {
      const res = await axios.post(
        "/user/reset",
        { password },
        {
          headers: { Authorization: token },
        }
      );
      return setData({
        ...data,
        error: "",
        success: res.data.msg,
      });
    } catch (error) {
      error.response.data.msg &&
        setData({
          ...data,
          error: error.response.data.msg,
          success: "",
        });
    }
  };

  return (
    <div className="fg_pass">
      <h2>Reset Your Password</h2>
      <div className="row">
        {error && showErrorMessage(error)}
        {success && showSuccessMessage(success)}

        <label htmlFor="password">Enter your password</label>
        <input
          type="password"
          name="password"
          id="password"
          value={password}
          onChange={handleChangeInput}
        ></input>

        <label htmlFor="confirm_password">Confirm your password</label>
        <input
          type="password"
          name="confirm_password"
          id="confirm_password"
          value={confirm_password}
          onChange={handleChangeInput}
        ></input>

        <button onClick={resetPassword}>Reset Password</button>
      </div>
    </div>
  );
};

export default ResetPassword;
