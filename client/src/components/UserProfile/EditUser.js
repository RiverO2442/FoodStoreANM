import React, { useState, useEffect, useContext } from "react";
import { useParams, useHistory } from "react-router-dom";
import axios from "axios";
import Notification from "../main_pages/discounts/Controls/Notification";

import { GlobalState } from "../../GlobalState";

import "./EditUser.css";
import {
  showErrorMessage,
  showSuccessMessage,
} from "../main_pages/Utils/Notification/Notification";

//MUI
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
//MUI

const EditUser = () => {
  const state = useContext(GlobalState);
  const [allUsers, setAllUsers] = state.userAPI.allUsers;
  const [token] = state.token;
  const { id } = useParams();
  const history = useHistory();
  const [editUser, setEditUser] = useState([]);
  const [checkAdmin, setCheckAdmin] = useState(false);
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const [number, setNumber] = useState(0);
  const [callback, setCallback] = state.userAPI.callback;

  useEffect(() => {
    if (allUsers.length !== 0) {
      allUsers.forEach((user) => {
        if (user._id === id) {
          setEditUser(user);
          setCheckAdmin(user.role === 1 ? true : false);
        }
      });
    } else {
      history.push("/profile");
    }
  }, [allUsers, id, history]);

  const handleUpdate = async () => {
    try {
      // number la so chan co nghia la k thay doi gia tri checkadmin , la so le thi co su thay doi
      if (number % 2 !== 0) {
        const res = await axios.patch(
          `/user/update_role/${editUser._id}`,
          { role: checkAdmin ? 1 : 0 },
          {
            headers: { Authorization: token },
          }
        );
        setCallback(!callback);
        setNotify({
          isOpen: true,
          message: "Update Successfully !",
          type: "success",
        });
        setSuccess(res.data.msg);
        setNumber(0);
      }
    } catch (error) {
      error.response.data.msg &&
        setNotify({
          isOpen: true,
          message: "Activation Code is incorrect",
          type: "error",
        });
      //setError(error.response.data.msg);
    }
  };

  const handleCheck = () => {
    setError("");
    setSuccess("");
    setCheckAdmin(!checkAdmin);
    setNumber(number + 1);
  };
  //MUI
  const useStyles = makeStyles((theme) => ({
    paper: {
      marginTop: theme.spacing(8),
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      minHeight: "900px",
    },
    avatar: {
      margin: theme.spacing(1),
      backgroundColor: theme.palette.secondary.main,
    },
    form: {
      width: "100%", // Fix IE 11 issue.
      marginTop: theme.spacing(1),
    },
    submit: {
      margin: theme.spacing(3, 0, 2),
    },
    input: {
      "&::placeholder": {
        textOverflow: "ellipsis !important",
        color: "black",
      },
    },
    "& > *": {
      margin: theme.spacing(1),
    },
  }));

  const classes = useStyles();
  //MUI

  const [notify, setNotify] = useState({
    isOpen: false,
    message: "",
    type: "",
  });
  return (
    <Container component="main" maxWidth="xs">
      <Notification notify={notify} setNotify={setNotify}></Notification>
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          User Info
        </Typography>
        <form className={classes.form} noValidate>
          <TextField
            InputProps={{
              classes: { input: classes.input },
            }}
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="UserName"
            label="User Name"
            type="text"
            name="name"
            disabled
            placeholder={editUser.name}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            InputProps={{
              classes: { input: classes.input },
            }}
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="Email"
            label="Email Address"
            type="text"
            name="email"
            disabled
            placeholder={editUser.email}
            disabled
            InputLabelProps={{ shrink: true }}
          />

          <FormControlLabel
            control={<Checkbox value="remember" color="primary" />}
            type="checkbox"
            id="isAdmin"
            checked={checkAdmin}
            onChange={handleCheck}
            label="Is Admin"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            onClick={handleUpdate}
          >
            Update
          </Button>
          <Button
            onClick={() => history.goBack()}
            type="submit"
            fullWidth
            variant="contained"
            color="default"
            style={{ marginTop: "10px" }}
          >
            Go Back
          </Button>
        </form>
        {success && showSuccessMessage(success)}
      </div>
    </Container>
    // <div className="profile_page edit_user">
    //   <div className="row">
    //     <button onClick={() => history.goBack()} className="go_back">
    //       <i className="fas fa-long-arrow-alt-left"></i> Go Back
    //     </button>
    //   </div>

    //   <div className="col-left">
    //     <h2>Edit User</h2>
    //     <div className="form-group">
    //       <label htmlFor="name">Name</label>
    //       <input
    //         type="text"
    //         name="name"
    //         defaultValue={editUser.name}
    //         disabled
    //       />
    //     </div>

    //     <div className="form-group">
    //       <label htmlFor="email">Email</label>
    //       <input
    //         type="email"
    //         name="email"
    //         defaultValue={editUser.email}
    //         disabled
    //       />
    //     </div>

    //     <div className="form-group">
    //       <input
    //         type="checkbox"
    //         id="isAdmin"
    //         checked={checkAdmin}
    //         onChange={handleCheck}
    //       ></input>
    //       <label htmlFor="isAdmin">isAdmin</label>
    //     </div>

    //     <button onClick={handleUpdate}>Update</button>

    //     {error && showErrorMessage(error)}
    //     {success && showSuccessMessage(success)}
    //   </div>
    // </div>
  );
};

export default EditUser;
