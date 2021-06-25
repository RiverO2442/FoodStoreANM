import React, { useContext, useState, useEffect } from "react";
import { GlobalState } from "../../../../GlobalState";

import "../Cart.css";
import axios from "axios";
import PaypalButton from "../PayPalButton";
import { Link, useLocation } from "react-router-dom";
import moment from "moment";

import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import CardMedia from "@material-ui/core/CardMedia";
import HighlightOffIcon from "@material-ui/icons/HighlightOff";
import { Button } from "@material-ui/core";

import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Grid from "@material-ui/core/Grid";
import "./Checkout.css";
import Divider from "@material-ui/core/Divider";

const Checkout = () => {
  const useStyles = makeStyles((theme) => ({
    listItem: {
      padding: theme.spacing(1, 0),
    },
    layout: {
      width: "auto",
      marginLeft: theme.spacing(2),
      marginRight: theme.spacing(2),
      [theme.breakpoints.up(600 + theme.spacing(2) * 2)]: {
        width: 600,
        marginLeft: "auto",
        marginRight: "auto",
      },
    },
    total: {
      fontWeight: 700,
    },
    title: {
      marginTop: theme.spacing(2),
    },
    paper: {
      marginTop: theme.spacing(3),
      marginBottom: theme.spacing(3),
      padding: theme.spacing(2),
      [theme.breakpoints.up(600 + theme.spacing(3) * 2)]: {
        marginTop: theme.spacing(6),
        marginBottom: theme.spacing(6),
        padding: theme.spacing(3),
      },
    },
  }));

  const classes = useStyles();

  const state = useContext(GlobalState);
  const [cart, setCart] = state.userAPI.cart;

  const [token] = state.token;

  const [date, setDate] = React.useState(new Date());

  const [user, setUser] = state.userAPI.user;

  const [callback, setCallback] = state.productsAPI.callback;

  const [discounts, setDiscounts] = state.discountsAPI.discounts;

  // discount chứa mã giảm giá
  const [chosenDiscount, setChosenDiscount] = useState(null);

  //hiển thị giá trị giảm giá
  const [reduceDiscount, setReduceDiscount] = useState(0);

  //tạm tổng tiền khởi tạo bằng 0
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const getTotal = () => {
      const total = cart.reduce((prev, item) => {
        return prev + item.price * item.quantity;
      }, 0);

      setTotal(total);
      checkValidDiscount(total);
    };
    const checkValidDiscount = (total) => {
      let currentDate = moment(new Date()).format("DD.MM.YYYY");
      if (discounts) {
        discounts.forEach((discount) => {
          let discountExpireTime = moment(new Date(discount.expireTime)).format(
            "DD.MM.YYYY"
          );

          if (currentDate <= discountExpireTime) {
            if (total >= discount.minimumValue) {
              if (reduceDiscount < discount.discountValue) {
                setReduceDiscount(discount.discountValue);
                setChosenDiscount(discount);
              }
            }
          }
        });
      }
    };
    getTotal();
  }, [cart]);

  const addToCart = async (cart) => {
    await axios.patch(
      "/user/add_cart",
      { cart },
      {
        headers: { Authorization: token },
      }
    );
  };

  const tranSuccess = async (payment) => {
    const { paymentID, address } = payment;

    await axios.post(
      "/api/payment",
      { cart, paymentID, address },
      {
        headers: { Authorization: token },
      }
    );

    // gửi mail confirm đơn hàng

    const { email, name } = user;
    const { country_code } = address;
    var currentDate = new Date().toLocaleString();

    await axios.post(
      "/user/confirmMail",
      { email, name, country_code, paymentID, cart, currentDate },
      {
        headers: { Authorization: token },
      }
    );

    setCart([]);
    addToCart([]);
    setCallback(!callback);

    window.location.href = "/ThankYou";
  };

  if (cart.length === 0) {
    return (
      <div style={{ minHeight: "900px", backgroundColor: "#f9f9f9" }}>
        {" "}
        <h1 style={{ paddingTop: "5rem", fontSize: "60px" }}>Cart Emty</h1>
      </div>
    );
  }

  return (
    <main className={classes.layout}>
      <Paper className={classes.paper}>
        <React.Fragment>
          <Typography variant="h6" gutterBottom>
            Order summary
          </Typography>
          <List disablePadding>
            {cart.map((product) => (
              <ListItem className={classes.listItem} key={product.title}>
                <ListItemText
                  style={{ textTransform: "capitalize" }}
                  primary={product.title + " x " + product.quantity}
                />
                <Typography variant="body2">
                  {product.price * product.quantity}$
                </Typography>
              </ListItem>
            ))}
            <Divider />
            <ListItem className={classes.listItem}>
              <ListItemText primary="Total" />
              <Typography className="Line" text variant="subtitle1">
                {total}$
              </Typography>
            </ListItem>
            <ListItem className={classes.listItem}>
              <ListItemText />
              <Typography className={classes.total} text variant="subtitle1">
                {(total - (total * reduceDiscount) / 100).toFixed(0)}$(-
                {reduceDiscount}%)
              </Typography>
            </ListItem>
          </List>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography variant="h6" gutterBottom className={classes.title}>
                Shipping
              </Typography>
              <Typography gutterBottom>{user.name}</Typography>
              <Typography gutterBottom>{user.email}</Typography>
            </Grid>
            <Grid item container direction="column" xs={12} sm={6}>
              <Typography variant="h6" gutterBottom className={classes.title}>
                Payment details
              </Typography>
              <Grid container>
                <React.Fragment>
                  <Grid item xs={6}>
                    <Typography>Payment Type</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography>PayPal</Typography>
                  </Grid>
                  <Grid
                    style={{ marginBottom: "5%", paddingTop: "4px" }}
                    item
                    xs={6}
                  >
                    <Typography>Create Date</Typography>
                  </Grid>
                  <Grid
                    style={{ marginBottom: "5%", paddingTop: "4px" }}
                    item
                    xs={6}
                  >
                    <Typography>{date.toISOString().substr(0, 10)}</Typography>
                  </Grid>
                </React.Fragment>
              </Grid>
            </Grid>
            <Grid
              container
              direction="row"
              justify="center"
              alignItems="center"
            >
              <PaypalButton
                total={(total - (total * reduceDiscount) / 100).toFixed(0)}
                tranSuccess={tranSuccess}
              ></PaypalButton>
            </Grid>
          </Grid>
        </React.Fragment>
      </Paper>
    </main>
  );
};

export default Checkout;
