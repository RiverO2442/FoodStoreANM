import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";

import { Link } from "react-router-dom";

import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import React, { useState } from "react";
import axios from "axios";
import "./Login.css";
import Notification from "../discounts/Controls/Notification";

import {
  showErrorMessage,
  showSuccessMessage,
} from "../Utils/Notification/Notification";

import {
  isEmpty,
  isEmail,
  isLength,
  isMatch,
} from "../Utils/Validation/Validation";

const Register = () => {
  const [notify, setNotify] = useState({
    isOpen: false,
    message: "",
    type: "",
  });

  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
    confirm_password: "",
    error: "",
    success: "",
  });

  const onChangeInput = (event) => {
    const { name, value } = event.target;
    setUser({ ...user, [name]: value, error: "", success: "" });
  };

  const registerSubmit = async (event) => {
    event.preventDefault();

    //validation
    if (isEmpty(user.name) || isEmpty(user.password))
      return setNotify({
        isOpen: true,
        message: "Please fill in all fields.",
        type: "error",
      });

    if (!isEmail(user.email))
      return setNotify({
        isOpen: true,
        message: "Invalid emails.",
        type: "error",
      });

    if (isLength(user.password))
      return setNotify({
        isOpen: true,
        message: "Password must be at least 6 characters.",
        type: "error",
      });

    if (!isMatch(user.password, user.confirm_password))
      return setNotify({
        isOpen: true,
        message: "Password did not match.",
        type: "error",
      });

    try {
      const { name, email, password } = user;
      const res = await axios.post("/user/register", { name, email, password });

      setUser({ ...user, error: "", success: res.data.msg });

      window.location.to = "/";

      return setNotify({
        isOpen: true,
        message: "An Activation Email Has Been Sent To Your Address",
        type: "success",
      });
    } catch (error) {
      setUser({ ...user, error: error.response.data.msg, success: "" });
    }
  };

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

  return (
    <Container style={{ minHeight: "700px" }} component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper} onSubmit={registerSubmit}>
        <Typography component="h1" variant="h5">
          Sign up
        </Typography>
        <Notification notify={notify} setNotify={setNotify}></Notification>
        <form className={classes.form} noValidate>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={12}>
              <TextField
                autoComplete="fname"
                name="name"
                variant="outlined"
                required
                fullWidth
                id="name"
                label="User Name"
                autoFocus
                value={user.name}
                onChange={onChangeInput}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                value={user.email}
                onChange={onChangeInput}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                value={user.password}
                onChange={onChangeInput}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                type="password"
                name="confirm_password"
                label="Confirm Password "
                value={user.confirm_password}
                onChange={onChangeInput}
              />
            </Grid>
            {/* <Grid item xs={12}>
              <FormControlLabel
                control={<Checkbox value="allowExtraEmails" color="primary" />}
                label="I want to receive inspiration, marketing promotions and updates via email."
              />
            </Grid> */}
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Sign Up
          </Button>
          <Grid container justify="flex-end">
            <Grid item>
              <Link to="/login" variant="body2">
                Already have an account? Sign in
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
    </Container>
  );
};

export default Register;
