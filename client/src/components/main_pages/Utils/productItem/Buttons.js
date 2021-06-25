import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { GlobalState } from "../../../../GlobalState";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import ShoppingCartIcon from "@material-ui/icons/ShoppingCart";
import VisibilityIcon from "@material-ui/icons/Visibility";
import Button from "@material-ui/core/Button";
import { Edit } from "@material-ui/icons";
const Buttons = ({ product, deleteProduct, toggleModal, setToggleModal }) => {
  const state = useContext(GlobalState);
  const [isAdmin] = state.userAPI.isAdmin;
  const addToCart = state.userAPI.addToCart;
  return (
    <>
      <div className="row-btn">
        {isAdmin ? (
          <>
            <Link
              to="#!"
              onClick={() =>
                deleteProduct(product._id, product.image.public_id)
              }
            >
              <Button
                style={{ with: "50%" }}
                variant="contained"
                color="secondary"
                startIcon={<DeleteIcon></DeleteIcon>}
              >
                Delete
              </Button>
            </Link>
            <Link to={`/edit_product/${product._id}`}>
              <Button
                style={{ with: "50%", marginLeft: "7px" }}
                variant="contained"
                color="action"
                startIcon={<EditIcon></EditIcon>}
              >
                Edit
              </Button>
            </Link>
          </>
        ) : (
          <>
            <Link
              style={{ with: "35%" }}
              to="#!"
              onClick={() => {
                addToCart(product);
              }}
            >
              <Button
                startIcon={<ShoppingCartIcon></ShoppingCartIcon>}
                variant="contained"
                color="secondary"
              >
                Buy
              </Button>
            </Link>
            <Link
              style={{ with: "35%", margin: "0 0.5rem" }}
              to={`/detail/${product._id}`}
              onClick={() => window.scrollTo({ top: 30, behavior: "smooth" })}
            >
              <Button
                startIcon={<VisibilityIcon></VisibilityIcon>}
                variant="contained"
                color="action"
              >
                View
              </Button>
            </Link>
          </>
        )}
      </div>
    </>
  );
};

export default Buttons;
