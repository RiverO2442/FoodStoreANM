import React, { useState } from "react";
import axios from "axios";
import { isEmail } from "../Utils/Validation/Validation";
import {
  showErrorMessage,
  showSuccessMessage,
} from "../Utils/Notification/Notification";

import "./ForgotPassword.css";

import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";

const initialState = {
  email: "",
  error: "",
  success: "",
};

const ForgotPassword = () => {
  const useStyles = makeStyles((theme) => ({
    paper: {
      marginTop: theme.spacing(8),
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    },
    avatar: {
      margin: theme.spacing(1),
      backgroundColor: theme.palette.secondary.main,
    },
    form: {
      width: "100%", // Fix IE 11 issue.
      marginTop: theme.spacing(3),
    },
    submit: {
      margin: theme.spacing(3, 0, 2),
    },
  }));

  const classes = useStyles();

  const [data, setData] = useState(initialState);

  const { email, error, success } = data;

  const handleChangeInput = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value, error: "", success: "" });
  };

  const forgotPassword = async () => {
    if (!isEmail(email)) {
      return setData({ ...data, error: "Invalid email", success: "" });
    }

    try {
      const res = await axios.post("/user/forget", { email });
      return setData({ ...data, error: "", success: res.data.msg });
    } catch (error) {
      error.response.data.msg &&
        setData({ ...data, error: error.response.data.msg, success: "" });
    }
  };

  return (
    <div className="fg_pass">
      <Container style={{ minHeight: "700px" }} component="main" maxWidth="xs">
        <CssBaseline />
        <div className={classes.paper}>
          <Typography component="h1" variant="h5">
            Enter your email
          </Typography>
          {error && showErrorMessage(error)}
          {success && showSuccessMessage(success)}
          <form className={classes.form} noValidate>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={12}>
                <TextField
                  autoComplete="fname"
                  name="name"
                  variant="outlined"
                  required
                  fullWidth
                  type="email"
                  name="email"
                  id="email"
                  value={email}
                  onChange={handleChangeInput}
                />
              </Grid>
            </Grid>
            <Button
              onClick={forgotPassword}
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
            >
              Verify your email
            </Button>
          </form>
        </div>
      </Container>
    </div>
  );
};

export default ForgotPassword;
