import React, { useState, useContext, useEffect } from "react";
import "./ProductItem.css";
import Buttons from "./Buttons";
import Modal from "./Modal";

import { GlobalState } from "../../../../GlobalState";

import ProductItemStarRating from "./ProductItemStarRating/ProductItemStarRating";

import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import Collapse from "@material-ui/core/Collapse";
import Avatar from "@material-ui/core/Avatar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import FavoriteIcon from "@material-ui/icons/Favorite";
import ShareIcon from "@material-ui/icons/Share";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import { Paper } from "@material-ui/core";
import WhatshotIcon from "@material-ui/icons/Whatshot";
const ProductItem = ({ product, isAdmin, deleteProduct, handleCheck }) => {
  const useStyles = makeStyles((theme) => ({
    root: {
      width: "240px",
      maxHeight: "450px",
      margin: theme.spacing(1),
      position: "relative",
      transition: "all 1s ease",
    },
    root2: {
      width: "240px",
      margin: theme.spacing(1),
      position: "relative",
      transition: "all 1s ease",
    },
    media: {
      height: 0,
      height: 240,
      paddingTop: "56.25%", // 16:9
    },
    expand: {
      float: "right",
      transform: "rotate(0deg)",
      marginLeft: "auto",
      transition: theme.transitions.create("transform", {
        duration: theme.transitions.duration.shortest,
      }),
    },
    expandOpen: {
      transform: "rotate(180deg)",
    },
    pageContent: {
      margin: theme.spacing(1),
      padding: theme.spacing(1),
    },
  }));
  const classes = useStyles();

  const [expanded, setExpanded] = React.useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const [toggleModal, setToggleModal] = useState(false);

  const state = useContext(GlobalState);

  const [categories] = state.categoriesAPI.categories;

  const [favoriteProducts] = state.userAPI.favoriteProducts;

  const addToFavoriteList = state.userAPI.addToFavoriteList;

  const [toggleFavorite, setToggleFavorite] = useState(false);

  //hiển thị thể loại của sản phẩm
  const [category, setCategory] = useState([]);

  useEffect(() => {
    categories.forEach((category) => {
      if (category._id === product.category) {
        setCategory(category);
      }
    });
  }, [product, categories]);

  useEffect(() => {
    if (favoriteProducts.length !== 0) {
      favoriteProducts.forEach((favoriteProduct) => {
        if (favoriteProduct._id === product._id) {
          setToggleFavorite(true);
        }
      });
    }
  }, [favoriteProducts]);

  return (
    <>
      <Card className={!expanded ? classes.root : classes.root2}>
        {product.sold > 10 && (
          <div className="off-info">
            <h2 className="sm-title">
              Hot Sale
              <WhatshotIcon style={{ transform: "rotate(90deg)" }} />
            </h2>
          </div>
        )}
        {isAdmin && (
          <input
            type="checkbox"
            className="CheckBox"
            checked={product.checked}
            onChange={() => handleCheck(product._id)}
          ></input>
        )}
        <CardHeader
          style={{
            width: "90%",
            textTransform: "capitalize",
            whiteSpace: "nowrap",
            textOverflow: "ellipsis",
            overflow: "hidden",
          }}
          title={
            <Typography
              variant="h5"
              style={{ fontWeight: "550", fontFamily: "Sanskrit Text" }}
            >
              {product.title}
            </Typography>
          }
          subheader={
            <ProductItemStarRating
              rating={product.star}
              sold={product.sold}
            ></ProductItemStarRating>
          }
        />
        <CardMedia className={classes.media} image={product.image.url} />
        <CardContent>
          <IconButton
            className={clsx(classes.expand, {
              [classes.expandOpen]: expanded,
            })}
            onClick={handleExpandClick}
            aria-expanded={expanded}
            aria-label="show more"
          >
            <ExpandMoreIcon />
          </IconButton>
          <Typography
            style={{ fontFamily: "NSimSun" }}
            variant="h5"
            component="h4"
          >
            ${product.price}
          </Typography>
          <Typography variant="h7">{category.name}</Typography>
          <Collapse in={expanded} timeout="auto" unmountOnExit>
            <CardContent>
              <Typography paragraph>{product.description}</Typography>
            </CardContent>
          </Collapse>
        </CardContent>
        <CardActions disableSpacing>
          <Buttons
            product={product}
            deleteProduct={deleteProduct}
            toggleModal={toggleModal}
            setToggleModal={setToggleModal}
          ></Buttons>
          {!isAdmin && (
            <IconButton
              style={{
                float: "right",
                margin: "auto",
                padding: "0",
                color: toggleFavorite ? "red" : "",
              }}
              aria-label="add to favorites"
              onClick={() => {
                addToFavoriteList(product);
                setToggleFavorite(true);
              }}
            >
              <FavoriteIcon />
            </IconButton>
          )}
        </CardActions>
      </Card>
    </>
  );
};

export default ProductItem;
