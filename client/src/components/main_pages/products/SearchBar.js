import React, { useState, useContext } from "react";
import "./SearchBar.css";
import { GlobalState } from "../../../GlobalState";

const SearchBar = () => {
  const [toggleSearch, setToggleSearch] = useState(false);

  const iconColor = toggleSearch ? "#000" : "#00f494";

  const state = useContext(GlobalState);

  const [search, setSearch] = state.productsAPI.search;

  return (
    <div className="container">
      <div className={toggleSearch ? "searchbox active" : "searchbox"}>
        <input
          type="text"
          value={search}
          placeholder="Enter your search"
          onChange={(e) => setSearch(e.target.value.toLowerCase())}
          className={
            toggleSearch ? "searchbox__input active" : "searchbox__input"
          }
        ></input>
        <i
          className="fa fa-search fa-2x search_icon"
          style={{ color: `${iconColor}` }}
          onClick={() => setToggleSearch(!toggleSearch)}
        ></i>
      </div>
    </div>
  );
};

export default SearchBar;
