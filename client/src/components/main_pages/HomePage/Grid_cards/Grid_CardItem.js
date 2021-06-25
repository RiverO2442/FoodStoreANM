import React from "react";
import { Link } from "react-router-dom";

const Grid_CardItem = ({ src, text, label, path, isImage, url }) => {
  return (
    <>
      <li className="grid_cards__item">
        <Link className="grid_cards__item__link">
          <figure className="grid_cards__item__pic-wrap" data-category={label}>
            <img
              style={{ display: "block", width: "100%", height: "100%" }}
              className="grid_cards__item__img"
              alt="Travel Image"
              src={src}
            />
          </figure>
        </Link>
      </li>
    </>
  );
};

export default Grid_CardItem;
