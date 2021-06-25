import React, { useState } from "react";
import { FaStar } from "react-icons/fa";

import "./StarRating.css";

const StarRating = ({ rating, setRating }) => {
  const [hover, setHover] = useState(null);
  return (
    <div>
      {[...Array(5)].map((star, index) => {
        const ratingValue = index + 1;
        return (
          <label>
            <input
              type="radio"
              name="rating"
              value={ratingValue}
              onClick={() => setRating(ratingValue)}
            ></input>
            <FaStar
              className="star"
              color={ratingValue <= (hover || rating) ? "#ffc107" : "#e4e5e9"}
              size={25}
              onMouseEnter={() => setHover(ratingValue)}
              onMouseLeave={() => setHover(null)}
            ></FaStar>
          </label>
        );
      })}
    </div>
  );
};

export default StarRating;
