import React, { useContext } from "react";
import { Switch, Route } from "react-router-dom";
import Products from "./products/Products";
import Login from "./authentication/Login";
import Register from "./authentication/Register";
import Cart from "./cart/Cart";
import Checkout from "./cart/checkout/Checkout";
import ThankYou from "./cart/checkout/Thankyou";
import OrderHistory from "./History/OrderHistory";
import OrderDetail from "./History/OrderDetail";
import NotFound from "./Utils/Not_found/NotFound";
import ProductDetail from "./ProductDetail/ProductDetail";
import { GlobalState } from "../../GlobalState";
import Categories from "./Categories/Categories";
import CreateProduct from "./createProduct/CreateProduct";
import HomePage from "./HomePage/HomePage";
import ActivationEmail from "./authentication/ActivationEmail";
import ForgotPassword from "./authentication/ForgotPassword";

import ResetPassword from "./authentication/ResetPassword";

import UserProfile from "../UserProfile/UserProfile";

import EditUser from "../UserProfile/EditUser";

import Discounts from "./discounts/Discounts";

import aboutus from "./about us/AboutUs";

import Messenger from "../Messenger/Messenger";

import { AnimatePresence } from "framer-motion";
import AboutUs from "./about us/AboutUs";

const Pages = () => {
  const state = useContext(GlobalState);
  const [isLogged] = state.userAPI.isLogged;
  const [isAdmin] = state.userAPI.isAdmin;

  return (
    <>
      <AnimatePresence>
        <Switch>
          <Route path="/" exact component={HomePage}></Route>
          <Route path="/products" exact component={Products}></Route>
          <Route path="/detail/:id" exact component={ProductDetail}></Route>
          <Route
            path="/login"
            exact
            component={isLogged ? NotFound : Login}
          ></Route>
          <Route
            path="/register"
            exact
            component={isLogged ? NotFound : Register}
          ></Route>

          <Route
            path="/user/activate/:activation_token"
            exact
            component={ActivationEmail}
          ></Route>

          <Route path="/chat" exact component={Messenger}></Route>

          <Route
            path="/forgot_password"
            exact
            component={isLogged ? NotFound : ForgotPassword}
          ></Route>

          <Route
            path="/user/reset/:token"
            exact
            component={isLogged ? NotFound : ResetPassword}
          ></Route>

          <Route
            path="/profile"
            exact
            component={isLogged ? UserProfile : NotFound}
          ></Route>

          <Route
            path="/aboutus"
            exact
            component={isLogged ? AboutUs : NotFound}
          ></Route>

          <Route
            path="/edit_user/:id"
            exact
            component={isAdmin ? EditUser : NotFound}
          ></Route>

          <Route
            path="/cart"
            exact
            component={isLogged ? Cart : NotFound}
          ></Route>

          <Route path="/Checkout" exact component={Checkout}></Route>

          <Route path="/ThankYou" exact component={ThankYou}></Route>

          <Route
            path="/history"
            exact
            component={isLogged ? OrderHistory : NotFound}
          ></Route>

          <Route
            path="/history/:id"
            exact
            component={isLogged ? OrderDetail : NotFound}
          ></Route>

          <Route
            path="/category"
            exact
            component={isAdmin ? Categories : NotFound}
          ></Route>

          <Route
            path="/create_product"
            exact
            component={isAdmin ? CreateProduct : NotFound}
          ></Route>

          <Route
            path="/edit_product/:id"
            exact
            component={isAdmin ? CreateProduct : NotFound}
          ></Route>

          <Route
            path="/discount"
            exact
            component={isAdmin ? Discounts : NotFound}
          ></Route>

          <Route path="*" exact component={NotFound}></Route>
        </Switch>
      </AnimatePresence>
    </>
  );
};

export default Pages;
