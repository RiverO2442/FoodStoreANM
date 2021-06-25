import React, { useState, useEffect } from "react";
import axios from "axios";

const UserAPI = (token) => {
  const [isLogged, setIsLogged] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [cart, setCart] = useState([]);
  const [history, setHistory] = useState([]);
  const [user, setUser] = useState([]);

  const [allUsers, setAllUsers] = useState([]);
  const [callback, setCallback] = useState(false);

  const [favoriteProducts, setFavoriteProducts] = useState([]);

  const [toggleShakingCart, setToggleShakingCart] = useState(false);

  useEffect(() => {
    if (token) {
      const getUser = async () => {
        try {
          const res = await axios.get("/user/information", {
            headers: { Authorization: token },
          });
          setUser(res.data);
          setIsLogged(true);
          res.data.role === 1 ? setIsAdmin(true) : setIsAdmin(false);

          setCart(res.data.cart);
          setFavoriteProducts(res.data.favoriteList);
        } catch (err) {
          alert(err.response.data.msg);
        }
      };
      getUser();
    }
  }, [token, callback]);

  useEffect(() => {
    if (isAdmin) {
      const getAllUser = async () => {
        try {
          const res = await axios.get("/user/all_information", {
            headers: { Authorization: token },
          });
          setAllUsers(res.data);
        } catch (error) {
          alert(error.response.data.msg);
        }
      };
      getAllUser();
    }
  }, [token, isAdmin, callback]);

  const addToCart = async (product) => {
    if (!isLogged) return alert("Please login to buy products");

    //kiểm tra xem hàng muốn mua đã có trong giỏ hàng chưa ( đã mua mặt hàng này trc đó chưa ?)
    const check = cart.every((item) => {
      return item._id !== product._id;
    });

    if (check) {
      setCart([...cart, { ...product, quantity: 1 }]);
      setToggleShakingCart(true);
      await axios.patch(
        "/user/add_cart",
        {
          cart: [...cart, { ...product, quantity: 1 }],
        },
        {
          headers: { Authorization: token },
        }
      );
    } else {
      alert("This product has been added to cart.");
    }
  };

  const addToFavoriteList = async (product) => {
    if (!isLogged)
      return alert("Please login to add product into the favorite list");

    //kiểm tra xem sản phẩm muốn thích đã có trong list chưa ?
    const check = favoriteProducts.every((item) => {
      return item._id !== product._id;
    });

    if (check) {
      setFavoriteProducts([...favoriteProducts, { ...product }]);

      await axios.patch(
        "/user/add_favoriteList",
        {
          favoriteProducts: [...favoriteProducts, { ...product }],
        },
        {
          headers: { Authorization: token },
        }
      );
    } else {
      alert("This product has been added to favorite list!");
    }
  };

  return {
    isLogged: [isLogged, setIsLogged],
    isAdmin: [isAdmin, setIsAdmin],
    user: [user, setUser],
    allUsers: [allUsers, setAllUsers],
    addToCart: addToCart,
    cart: [cart, setCart],
    history: [history, setHistory],
    callback: [callback, setCallback],
    favoriteProducts: [favoriteProducts, setFavoriteProducts],
    addToFavoriteList: addToFavoriteList,
    toggleShakingCart: [toggleShakingCart, setToggleShakingCart],
  };
};

export default UserAPI;
