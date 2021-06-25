import React, { useState, useContext, useEffect } from "react";
import "../headers/Header.css";
import { Grid } from "@material-ui/core";
import "./SearchBox.css";
import { GlobalState } from "../../GlobalState";

const SearchBox = () => {
  //search bar effect
  const [click, setClick] = useState(false);

  const [Serchbutton, setSerchbutton] = useState(true);

  const handleClick = () => setClick(!click);

  const state = useContext(GlobalState);

  const [search, setSearch] = state.productsAPI.search;
  //--------------

  return (
    <div>
      <Grid
        style={{ height: "90px" }}
        xs
        container
        direction="column"
        justify="flex-end"
        alignItems="flex-end"
      >
        <Grid style={{ height: "75px" }} xs={12}>
          <div
            className={click ? "search-icon active" : "search-icon"}
            onClick={handleClick}
          >
            <i class="fa fa-search"></i>
          </div>
        </Grid>
        <Grid
          style={{ height: "25px", marginLeft: "15px" }}
          container
          direction="row"
          justify="flex-end"
          alignItems="flex-end"
        >
          <Grid item>
            <ul className={click ? "SearchBar active" : "SearchBar"}>
              <div style={{ backgroundColor: " #ffa500", height: "40px" }}>
                <input
                  className="SearchInput"
                  placeholder="Search here..."
                  value={search}
                  placeholder="Enter your search"
                  onChange={(e) => setSearch(e.target.value.toLowerCase())}
                ></input>
                <i class="fa fa-search" style={{ color: "white" }}></i>
              </div>
            </ul>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
};

export default SearchBox;
