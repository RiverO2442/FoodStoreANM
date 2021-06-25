import React, { useState, useContext } from "react";
import "./SideBar.css";

import { GlobalState } from "../../../../GlobalState";

const SideBar = () => {
  const state = useContext(GlobalState);
  const [categories] = state.categoriesAPI.categories;
  const [category, setCategory] = state.productsAPI.category;
  const [search, setSearch] = state.productsAPI.search;

  const [currentBtnName, setCurrentBtnName] = useState("All Products");

  const handleOnClick = (event) => {
    const { id, value } = event.target;
    setCurrentBtnName(value);
    if (id) {
      setCategory("category=" + id);
    } else {
      setCategory("");
    }
    setSearch("");
  };
  return (
    <>
      <ul className="sidebar">
        <button
          value="All Products"
          id=""
          className={
            currentBtnName === "All Products"
              ? "btn-sidebar active"
              : "btn-sidebar"
          }
          onClick={handleOnClick}
        >
          All Products
        </button>
        {categories.map((category) => (
          <button
            value={category.name}
            id={category._id}
            className={
              category.name === currentBtnName
                ? "btn-sidebar active"
                : "btn-sidebar"
            }
            onClick={handleOnClick}
          >
            {category.name}
          </button>
        ))}
      </ul>
    </>
  );
};

export default SideBar;
