import React, { createContext, useState, useEffect } from "react";
import ProductsAPI from "./api/ProductsAPI";
import axios from "axios";
import UserAPI from "./api/UserAPI";
import CategoriesAPI from "./api/CategoriesAPI";
import DiscountsAPI from "./api/DiscountsAPI";

export const GlobalState = createContext();

export const DataProvider = ({ children }) => {
  const [token, setToken] = useState(false);

  const refreshToken = async () => {
    const res = await axios.get("/user/refresh_token");
    setToken(res.data.accesstoken);
    setTimeout(() => {
      refreshToken();
    }, 10 * 60 * 1000);
  };

  useEffect(() => {
    refreshToken();
  }, []);

  const state = {
    token: [token, setToken],
    productsAPI: ProductsAPI(),
    userAPI: UserAPI(token),
    discountsAPI: DiscountsAPI(token),
    categoriesAPI: CategoriesAPI(),
  };

  return (
    <>
      <GlobalState.Provider value={state}>{children}</GlobalState.Provider>
    </>
  );
};
