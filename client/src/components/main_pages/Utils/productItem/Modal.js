import React, { useContext, useRef, useEffect } from "react";

import "./Modal.css";

import { GlobalState } from "../../../../GlobalState";

import { MdClose } from "react-icons/md";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import CardMedia from "@material-ui/core/CardMedia";

const Modal = ({ product, toggleModal, setToggleModal }) => {
  const state = useContext(GlobalState);
  const addToCart = state.userAPI.addToCart; // hàm thêm hàng vào giỏ

  const modalRef = useRef();

  const backgroundCloseModal = (e) => {
    if (modalRef.current === e.target) {
      setToggleModal(false);
    }
  };

  return (
    <div
      className="background-modal"
      ref={modalRef}
      onClick={backgroundCloseModal}
    >
      <div className="modal-wrapper">
        <img className="modal-image" src={product.image.url}></img>

        <div className="modal-content">
          <h1>{product.title}</h1>
          <Typography
            style={{ padding: "10px", minWidth: "100px", minHeight: "200px" }}
          >
            {product.description}
          </Typography>
          <button
            onClick={() => {
              addToCart(product);
              setToggleModal(false);
            }}
          >
            Add to cart
          </button>
        </div>
        <MdClose
          className="modal-close-icon"
          onClick={() => setToggleModal(false)}
          aria-label="Close modal"
        ></MdClose>
      </div>
    </div>
  );
};

export default Modal;
