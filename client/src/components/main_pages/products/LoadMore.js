import React, { useContext } from "react";
import { GlobalState } from "../../../GlobalState";
import "./LoadMore.css";

const LoadMore = () => {
  const state = useContext(GlobalState);
  const [page, setPage] = state.productsAPI.page;
  const [result, setResult] = state.productsAPI.result;
  return (
    <div className="load_more">
      {result < page * 9 ? (
        ""
      ) : (
        <button onClick={(event) => setPage(page + 1)}>
          Load More <i className="fa fa-arrow-down"></i>
        </button>
      )}
    </div>
  );
};

export default LoadMore;
