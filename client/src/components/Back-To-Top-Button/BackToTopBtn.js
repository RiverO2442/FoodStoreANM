import React, { useState, useEffect } from "react";
import "./BackToTopBtn.css";
import { useWindowScroll } from "react-use";

const BackToTopBtn = () => {
  const { y: pageYOffset } = useWindowScroll();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (pageYOffset > 400) setVisible(true);
    else setVisible(false);
  }, [pageYOffset]);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <>
      {visible && (
        <div
          className="scroll-to-top cursor-pointer text-center"
          onClick={scrollToTop}
        >
          <i className="icon fas fa-chevron-up"></i>
        </div>
      )}
    </>
  );
};

export default BackToTopBtn;
