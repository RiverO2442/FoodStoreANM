import React, { useContext, useState, useEffect } from "react";
import { GlobalState } from "../../../GlobalState";

import "./Cart.css";
import axios from "axios";
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
import AddIcon from "@material-ui/icons/Add";
import RemoveIcon from "@material-ui/icons/Remove";
import PaymentIcon from "@material-ui/icons/Payment";

const Cart = () => {
  const useStyles = makeStyles({
    Button: {
      "&:hover": {
        color: "primary",
      },
    },
    table: {
      width: "80%",
      height: "60%",
      marginLeft: "10rem",
      marginBottom: "5rem",
      marginTop: "5rem",
    },
    smalltable: {
      width: "40%",
      height: "60%",
      marginLeft: "10rem",
      marginBottom: "5rem",
      marginTop: "3rem",
    },
    media: {
      //height: 0,
      paddingTop: "85%", // 16:9
      minHeight: "15px",
      minWidth: "15px",
    },
    button: {
      paddingLeft: "15px",
    },
  });

  const classes = useStyles();

  const state = useContext(GlobalState);
  const [cart, setCart] = state.userAPI.cart;

  const [token] = state.token;

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

  // tăng giá trị số lượng của sản phẩm
  const incrementEvent = (id) => {
    cart.forEach((item) => {
      if (item._id === id) {
        item.quantity += 1;
      }
    });
    setCart([...cart]);
    setReduceDiscount(0);
    setChosenDiscount(null);
    addToCart(cart);
  };

  // giảm giá trị số lượng của sản phẩm
  const decreamentEvent = (id) => {
    cart.forEach((item) => {
      if (item._id === id) {
        item.quantity === 1 ? (item.quantity = 1) : (item.quantity -= 1);
      }
    });
    setCart([...cart]);
    setReduceDiscount(0);
    setChosenDiscount(null);
    addToCart(cart);
    // việc thêm hàm addToCart này là để đồng bộ database
    // ví dụ như remove 1 sản phẩm thì nó mất khỏi (state) card  chứ k mất khỏi thuộc tính card của user trong database
    // card được dùng gián tiếp chứ k trực tiếp
  };

  // xóa sản phẩm khỏi giỏ hàng
  const removeEvent = (id) => {
    if (
      window.confirm("Are you sure to remove this product from your cart ?")
    ) {
      cart.forEach((product, index) => {
        if (product._id === id) {
          cart.splice(index, 1);
        }
      });
    }
    setCart([...cart]);
    setReduceDiscount(0);
    setChosenDiscount(null);
    addToCart(cart);
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

    alert("You have successfully placed an order.");
  };

  if (cart.length === 0) {
    return (
      <div style={{ minHeight: "900px", backgroundColor: "#f9f9f9" }}>
        <h1 style={{ paddingTop: "5rem", fontSize: "60px" }}>Cart Emty</h1>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: "#f9f9f9" }}>
      <h1 style={{ paddingTop: "5rem", fontSize: "60px" }}>Cart</h1>
      <TableContainer style={{ backgroundColor: "#f9f9f9" }} component={Paper}>
        <Table className={classes.table} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell
                style={{ borderRightColor: "#f9f9f9" }}
                colSpan={2}
              ></TableCell>
              <TableCell style={{ borderRightColor: "#f9f9f9" }} align="center">
                <Typography>Name</Typography>
              </TableCell>
              <TableCell style={{ borderRightColor: "#f9f9f9" }} align="center">
                <Typography>Price</Typography>
              </TableCell>
              <TableCell style={{ borderRightColor: "#f9f9f9" }} align="center">
                <Typography>Quantity</Typography>
              </TableCell>
              <TableCell align="center">
                <Typography>Total</Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {cart.map((product) => (
              <TableRow key={product.name}>
                <TableCell
                  style={{ borderRightColor: "#f9f9f9" }}
                  align="center"
                >
                  <HighlightOffIcon
                    fontSize="large"
                    color="disabled"
                    onClick={() => removeEvent(product._id)}
                  />
                </TableCell>
                <TableCell
                  style={{ borderRightColor: "#f9f9f9" }}
                  component="th"
                  scope="row"
                >
                  <CardMedia
                    className={classes.media}
                    image={product.image.url}
                  />
                </TableCell>
                <TableCell
                  style={{ borderRightColor: "#f9f9f9" }}
                  align="center"
                >
                  <Typography>{product.title}</Typography>
                </TableCell>
                <TableCell
                  style={{ borderRightColor: "#f9f9f9" }}
                  align="center"
                >
                  <Typography>{product.price}&nbsp;$</Typography>
                </TableCell>
                <TableCell
                  width="20%"
                  align="center"
                  style={{ borderRightColor: "#f9f9f9" }}
                >
                  <Typography>
                    <Button
                      onClick={() => decreamentEvent(product._id)}
                      startIcon={<RemoveIcon></RemoveIcon>}
                      className={classes.button}
                    ></Button>

                    <span>&nbsp;&nbsp;{product.quantity}&nbsp;&nbsp;</span>
                    <Button
                      onClick={() => incrementEvent(product._id)}
                      startIcon={<AddIcon fontSize="small"></AddIcon>}
                      className={classes.button}
                    ></Button>
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <Typography>
                    {product.price * product.quantity}&nbsp;$
                  </Typography>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TableContainer style={{ backgroundColor: "#f9f9f9" }} component={Paper}>
        <Table className={classes.smalltable} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Total</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell align="left">
                <Typography>Temporary Total: {total}$</Typography>
              </TableCell>
            </TableRow>
            {reduceDiscount !== 0 && (
              <TableRow>
                <TableCell colSpan={6} style={{ justifyContent: "flex-end" }}>
                  <Typography>
                    Reduce Amount:&nbsp;
                    {((total * reduceDiscount) / 100).toFixed(0)}$
                  </Typography>
                </TableCell>
              </TableRow>
            )}
            <TableRow>
              <TableCell align="left">
                <Typography>
                  Official Total:&nbsp;
                  {(total - (total * reduceDiscount) / 100).toFixed(0)}$
                </Typography>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell align="center">
                <Link style={{ color: "white" }} to="/Checkout">
                  <Button
                    variant="contained"
                    fullWidth
                    color="primary"
                    startIcon={<PaymentIcon></PaymentIcon>}
                  >
                    <Typography
                      style={{
                        textTransform: "capitalize",
                      }}
                    >
                      CheckOut
                    </Typography>
                  </Button>
                </Link>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default Cart;
