import React, { useContext, useState } from "react";
import { GlobalState } from "../../../GlobalState";
import "./FilterProducts.css";

import SearchBar from "./SearchBar";

const FilterProducts = () => {
  const state = useContext(GlobalState);
  const [categories] = state.categoriesAPI.categories;
  const [category, setCategory] = state.productsAPI.category;
  const [sort, setSort] = state.productsAPI.sort;
  const [search, setSearch] = state.productsAPI.search;

  // const handleCategory = (event) => {
  //   setCategory(event.target.value);
  //   setSearch("");
  // };

  return (
    <>
      <div className="filter_menu">
        {/* <div className="row">
        <span>Filters: </span>
        <select name="category" value={category} onChange={handleCategory}>
          <option value="">All products</option>
          {categories.map((category) => (
            <option value={"category=" + category._id} key={category._id}>
              {category.name}
            </option>
          ))}
        </select>
      </div> */}

        {/* <input
          type="text"
          value={search}
          placeholder="Enter your search standards"
          onChange={(e) => setSearch(e.target.value.toLowerCase())}
        ></input> */}

        <div className="row sort">
          <span>Sort By: </span>
          <select value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="">Newest</option>
            <option value="sort=createdAt">Oldest</option>
            <option value="sort=-sold">Best sales</option>
            <option value="sort=price">Price: Ascending </option>
            <option value="sort=-price">Price: Descending</option>
          </select>
        </div>

        <SearchBar></SearchBar>
      </div>
    </>
  );
};

export default FilterProducts;
