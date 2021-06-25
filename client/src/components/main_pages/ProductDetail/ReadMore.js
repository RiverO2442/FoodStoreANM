import React, { useState, useEffect } from "react";

import "./ReadMore.css";

const ReadMore = ({ children, maxCharacter = 100 }) => {
  const text = children;

  // rút ngắn đoạn text (mặc định là true)
  const [isTruncated, setIsTruncated] = useState(true);

  // hiển thị nút span readmore readless
  const [toggleTruncated, setToggleTruncated] = useState(false);

  const resultText = isTruncated ? text.slice(0, maxCharacter) : text;

  useEffect(() => {
    if (text.length > 100) {
      setToggleTruncated(true);
    } else {
      setToggleTruncated(false);
    }
  }, [text]);

  return (
    <div className="description-text">
      <p>{resultText}</p>
      {toggleTruncated && (
        <span
          onClick={() => setIsTruncated(!isTruncated)}
          className={isTruncated ? "readmore-btn" : "readmore-btn text-less "}
        >
          {isTruncated ? "Read More" : "Read less"}
        </span>
      )}
    </div>
  );
};

export default ReadMore;
