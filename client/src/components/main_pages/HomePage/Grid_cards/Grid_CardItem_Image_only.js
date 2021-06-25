import React from "react";
import { Link } from "react-router-dom";

const Grid_CardItem = ({ src, text, label, path, isImage, onClick, id }) => {
  return (
    <>
      <li className="grid_cards_image_only__item">
        <Link className="grid_cards_image_only__item__link" to={path}>
          <figure
            className="grid_cards_image_only__item__pic-wrap"
            data-category={label}
          >
            <img
              style={{ display: "block", width: "100%", height: "auto" }}
              className="grid_cards_image_only__item__img"
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
