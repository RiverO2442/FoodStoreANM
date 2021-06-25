import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./Login.css";

import { GoogleLogin } from "react-google-login";

import FacebookLogin from "react-facebook-login";

import swal from "sweetalert";

import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";

import Notification from "../discounts/Controls/Notification";

const Login = () => {
  const useStyles = makeStyles((theme) => ({
    root: {
      height: "90vh",
    },
    image: {
      backgroundImage:
        "url(https://source.unsplash.com/collection/8593395/1600x900)",
      backgroundRepeat: "no-repeat",
      backgroundColor:
        theme.palette.type === "light"
          ? theme.palette.grey[50]
          : theme.palette.grey[900],
      backgroundSize: "cover",
      backgroundPosition: "center",
    },
    paper: {
      margin: theme.spacing(8, 4),
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    },
    avatar: {
      margin: theme.spacing(1),
      backgroundColor: theme.palette.secondary.main,
    },
    form: {
      width: "70%", // Fix IE 11 issue.
      marginTop: theme.spacing(1),
    },
    submit: {
      margin: theme.spacing(3, 0, 2),
    },
  }));

  const classes = useStyles();

  const [user, setUser] = useState({
    email: "",
    password: "",
    error: "",
    success: "",
  });

  const onChangeInput = (event) => {
    const { name, value } = event.target;
    setUser({ ...user, [name]: value, error: "", success: "" });
  };

  const loginSubmit = async (event) => {
    event.preventDefault();
    try {
      const { email, password } = user;
      const res = await axios.post("/user/login", { email, password });
      setUser({ ...user, error: "", success: res.data.msg });

      window.location.href = "/";
      setNotify({
        isOpen: true,
        message: "Login successfully",
        type: "success",
      });
    } catch (error) {
      setNotify({
        isOpen: true,
        message: "Username or password is incorrect!",
        type: "error",
      });
      setUser({ ...user, error: error.response.data.msg, success: "" });
    }
  };

  const responseGoogle = async (response) => {
    try {
      // console.log(response);
      const res = await axios.post("/user/google_login", {
        tokenId: response.tokenId,
      });

      setUser({ ...user, error: "", success: res.data.msg });
      window.location.href = "/";
    } catch (error) {
      error.response.data.msg &&
        setUser({ ...user, error: error.response.data.msg, success: "" });
    }
  };

  const responseFacebook = async (response) => {
    //console.log(response);
    try {
      const { accessToken, userID } = response;
      const res = await axios.post("/user/facebook_login", {
        accessToken,
        userID,
      });
      setUser({ ...user, error: "", success: res.data.msg });
      window.location.href = "/";
    } catch (error) {
      error.response.data.msg &&
        setUser({ ...user, error: error.response.data.msg, success: "" });
    }
  };

  const [notify, setNotify] = useState({
    isOpen: false,
    message: "",
    type: "",
  });

  return (
    <div className="login-page">
      <Grid container component="main" className={classes.root}>
        <Grid item xs={false} sm={4} md={7} className={classes.image} />
        <Grid
          item
          xs={12}
          sm={8}
          md={5}
          component={Paper}
          elevation={6}
          square
          onSubmit={loginSubmit}
        >
          <div className={classes.paper}>
            <Typography component="h1" variant="h5">
              SIGN IN
            </Typography>
            <Notification notify={notify} setNotify={setNotify}></Notification>
            <form className={classes.form} noValidate>
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                value={user.email}
                onChange={onChangeInput}
              />
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                value={user.password}
                onChange={onChangeInput}
              />
              {/* <FormControlLabel
                control={<Checkbox value="remember" color="primary" />}
                label="Remember me"
              /> */}
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
              >
                Sign In
              </Button>
              <Grid container>
                <Grid item xs>
                  <Link to="/forgot_password" variant="body2">
                    Forgot password?
                  </Link>
                </Grid>
                <Grid item>
                  <Link to="/register" variant="body2">
                    Don't have an account? Sign Up
                  </Link>
                </Grid>
                <Grid container>
                  <Grid item>
                    <p></p>
                  </Grid>
                </Grid>
                <div style={{ paddingTop: "5%" }} className="social">
                  <GoogleLogin
                    clientId="465399330410-mf31k69b3j7pg371ivpm9es19d83agnb.apps.googleusercontent.com"
                    buttonText="Login with Google"
                    onSuccess={responseGoogle}
                    cookiePolicy={"single_host_origin"}
                  />
                  <FacebookLogin
                    appId="577453733250676"
                    autoLoad={false}
                    fields="name,email,picture"
                    callback={responseFacebook}
                  />
                </div>
              </Grid>
            </form>
          </div>
        </Grid>
      </Grid>
    </div>
  );
};

export default Login;
