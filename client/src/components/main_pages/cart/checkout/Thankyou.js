import React, { useContext, useState, useEffect } from "react";
import { GlobalState } from "../../../../GlobalState";
import { Link, useLocation } from "react-router-dom";

import "../Cart.css";
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

import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Grid from "@material-ui/core/Grid";
import "./Checkout.css";
import Divider from "@material-ui/core/Divider";
import ShoppingCartIcon from "@material-ui/icons/ShoppingCart";
import Button from "@material-ui/core/Button";

const Thankyou = () => {
  const useStyles = makeStyles((theme) => ({
    listItem: {
      padding: theme.spacing(1, 0),
    },
    layout: {
      width: "auto",
      marginLeft: theme.spacing(2),
      marginRight: theme.spacing(2),
      [theme.breakpoints.up(400 + theme.spacing(2) * 2)]: {
        width: 600,
        marginLeft: "auto",
        // marginRight: "auto",
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
    pageContent: {
      minWidth: "700px",
      margin: theme.spacing(5),
      padding: theme.spacing(3),
    },
  }));

  const classes = useStyles();

  const state = useContext(GlobalState);
  const [cart, setCart] = state.userAPI.cart;

  const [date, setDate] = React.useState(new Date());

  const [user, setUser] = state.userAPI.user;

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

  return (
    <Paper className={classes.pageContent}>
      <Grid container>
        <Grid item xs={6} style={{ position: "relative" }}>
          <Typography variant="h5" gutterBottom>
            Thank You For Your Order
          </Typography>
          <Typography variant="p6" gutterBottom>
            A notification mail has been sent to your email address:&nbsp;
          </Typography>
          <Typography variant="p6" gutterBottom>
            {user.email}
          </Typography>
          <Table
            style={{
              marginTop: "2rem",
              borderTop: "none",
              borderBottom: "none",
            }}
          >
            <TableRow
              style={{
                borderTop: "inherit",
                borderBottom: "inherit",
              }}
            >
              <TableCell
                style={{
                  borderTop: "inherit",
                  borderBottom: "inherit",
                }}
              >
                <Typography variant="p6">Order Date:</Typography>
                <Typography>{new Date(date).toLocaleDateString()}</Typography>
              </TableCell>
              <TableCell
                style={{
                  borderTop: "inherit",
                  borderBottom: "inherit",
                }}
              >
                <Typography variant="p6">Payment Method:</Typography>
                <Typography>PayPal</Typography>
              </TableCell>
            </TableRow>
          </Table>
          <Link to="/products">
            <Button
              style={{
                marginTop: "2rem",
                marginLeft: "auto",
                marginRight: "auto",
                width: "400px",
              }}
              variant="contained"
              color="primary"
              size="large"
              startIcon={<ShoppingCartIcon fontSize="large"></ShoppingCartIcon>}
            >
              <Typography> Continue Shopping</Typography>
            </Button>
          </Link>
        </Grid>
        {/* <Grid item xs={6}>
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
                        // style={{ textTransform: "capitalize" }}
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
                    <Typography
                      className={classes.total}
                      text
                      variant="subtitle1"
                    >
                      {(total - (total * reduceDiscount) / 100).toFixed(0)}
                      $&nbsp;(-
                      {reduceDiscount}%)
                    </Typography>
                  </ListItem>
                </List>
              </React.Fragment>
            </Paper>
          </main>
        </Grid> */}
      </Grid>
    </Paper>
  );
};

export default Thankyou;
