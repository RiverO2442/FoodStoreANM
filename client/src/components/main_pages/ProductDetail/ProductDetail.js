import React, { useContext, useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { GlobalState } from "../../../GlobalState";
import "./ProductDetail.css";
import ProductItem from "../Utils/productItem/ProductItem";
import img from "./img.png";

import ProductItemStarRating from "../Utils/productItem/ProductItemStarRating/ProductItemStarRating";

import ReactImageMagnify from "react-image-magnify";

import { motion } from "framer-motion";

import Tags from "./Tags";

import Comments from "./Comments/Comments";

import ReadMore from "./ReadMore";

import {
  InputAdornment,
  makeStyles,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  Toolbar,
  Paper,
} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import AddIcon from "@material-ui/icons/Add";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import CardMedia from "@material-ui/core/CardMedia";
import AddShoppingCartIcon from "@material-ui/icons/AddShoppingCart";

const ProductDetail = () => {
  const useStyles = makeStyles((theme) => ({
    media: {
      height: 140,
    },
    table: {
      marginTop: theme.spacing(3),
      "& thead th": {
        fontWeight: "600",
        color: theme.palette.primary.main,
        backgroundColor: theme.palette.primary.light,
      },
      "& tbody td": {
        fontWeight: "300",
      },
      "& tbody tr:hover": {
        backgroundColor: "#fffbf2",
        cursor: "pointer",
      },
    },
    Para: {
      color: "#4e4e4e",
      "&:hover": {
        cursor: "pointer",
      },
    },
    Para1: {
      color: "black",
      "&:hover": {
        cursor: "pointer",
      },
      textDecoration: "overline",
      textDecorationThickness: "4px",
      textDecorationColor: "#4e4e4e",
    },
    button: {
      margin: theme.spacing(1),
    },
    searchInput: {
      width: "75%",
    },
    pageContent: {
      // margin: theme.spacing(5),
      // padding: theme.spacing(3),
    },
    pageContentSecondHalf: {
      margin: theme.spacing(1),
      padding: theme.spacing(3),
    },
    pageContentSecondHalf1: {
      padding: theme.spacing(3),
    },
    newButton: {
      position: "absolute",
      right: "10px",
      padding: "20px 20px",
    },
  }));
  const classes = useStyles();
  const params = useParams();
  const state = useContext(GlobalState);
  const [isComment, setIsComment] = useState(false);
  const [categories] = state.categoriesAPI.categories;

  const [products] = state.productsAPI.products;
  const addToCart = state.userAPI.addToCart;

  const [productDetail, setProductDetail] = useState([]);

  const [callback, setCallback] = state.productsAPI.callback;

  const [imageTest, setImageTest] = useState("");

  //hiển thị thể loại của sản phẩm
  const [category, setCategory] = useState([]);

  //comments khách hàng
  const [comments, setComments] = useState([]);

  useEffect(() => {
    if (params.id) {
      products.forEach((product) => {
        if (product._id === params.id) {
          setProductDetail(product);
          setImageTest(product.image.url);
        }
      });
    }
  }, [params.id, products, callback]);

  useEffect(() => {
    if (productDetail) {
      categories.forEach((category) => {
        if (category._id === productDetail.category) {
          setCategory(category);
        }
      });
    }
  }, [productDetail, categories]);

  //zoom image

  const imageProps = {
    smallImage: {
      isFluidWidth: true,
      src: imageTest,
      alt: "product detail image",
    },
    largeImage: {
      src: imageTest,
      width: 1920,
      height: 1080,
    },
    enlargedImageContainerStyle: { background: "#fff", zIndex: 9 },
  };

  if (productDetail.length === 0) return null;

  return (
    <>
      <motion.div
        exit={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        initial={{ opacity: 0 }}
      >
        <Paper className={classes.pageContentSecondHalf}>
          <div className="detail">
            {/* <ReactImageMagnify {...imageProps}></ReactImageMagnify> */}
            <Paper className={classes.pageContentSecondHalf1}>
              <Grid spacing={2} container style={{ minHeight: "30%" }}>
                <Grid
                  container
                  xs={6}
                  style={{
                    //backgroundColor: "black",
                    position: "relative",
                  }}
                >
                  {/* <img
                style={{
                  position: "absolute",
                  width: "100%",
                  height: "100%",
                  padding: "0.5rem",
                }}
                src={img}
              ></img> */}
                  <ReactImageMagnify
                    style={{
                      margin: "auto",
                      width: "100%",
                      height: "100%",
                    }}
                    {...imageProps}
                  ></ReactImageMagnify>
                </Grid>
                <Grid item xs>
                  <Typography
                    style={{ textTransform: "capitalize", marginBottom: "2%" }}
                    variant="h3"
                  >
                    {productDetail.title}
                  </Typography>
                  <Typography style={{ marginBottom: "2%" }}>
                    <ProductItemStarRating
                      rating={productDetail.star}
                    ></ProductItemStarRating>
                    ({comments.length} Customer's Evaluation)
                  </Typography>
                  <Typography
                    variant="h4"
                    style={{ marginBottom: "2%", color: "grey" }}
                  >
                    ${productDetail.price}
                  </Typography>
                  <Typography style={{ marginBottom: "2%" }}>
                    {productDetail.content}
                  </Typography>
                  <Typography style={{ marginBottom: "2%" }}>
                    Sold: {productDetail.sold}
                  </Typography>
                  <Link
                    to="/cart"
                    onClick={() => {
                      addToCart(productDetail);
                    }}
                  >
                    <Button
                      startIcon={<AddShoppingCartIcon />}
                      variant="contained"
                      color="secondary"
                    >
                      Buy Now
                    </Button>
                  </Link>
                  <Divider style={{ marginTop: "3%", marginBottom: "2%" }} />
                  <Typography style={{ marginBottom: "2%" }}>
                    Category: {category.name}
                  </Typography>
                  <Typography style={{ marginBottom: "2%" }}>
                    <div className="product-detail-tags">
                      <Tags
                        productDetail={productDetail}
                        categoryName={category.name}
                      ></Tags>
                    </div>
                  </Typography>
                </Grid>
              </Grid>
            </Paper>
          </div>
          <Divider />
          <Typography
            onClick={() => {
              setIsComment(false);
            }}
            className={isComment ? classes.Para : classes.Para1}
            style={{ float: "left", marginRight: "1%" }}
          >
            Detail
          </Typography>
          <Typography
            onClick={() => {
              setIsComment(true);
            }}
            className={isComment ? classes.Para1 : classes.Para}
            style={{ minHeight: "20px" }}
          >
            Comment({comments.length})
          </Typography>
          {!isComment && (
            <Typography style={{ minHeight: "100px" }}>
              {/* <ReadMore maxCharacter={100}>
              </ReadMore> */}
              {productDetail.description}
            </Typography>
          )}
          <Comments
            productDetail={productDetail}
            comments={comments}
            setComments={setComments}
            isShow={isComment}
          ></Comments>
          <Divider style={{ marginTop: "3%", marginBottom: "3%" }} />
          <div style={{ paddingTop: "5%" }} className="related-products">
            <h2>Related Products</h2>
            <div className="products">
              {products.map((product) => {
                return product.category === productDetail.category &&
                  product._id != productDetail._id ? (
                  <ProductItem
                    key={product._id}
                    product={product}
                  ></ProductItem>
                ) : null;
              })}
            </div>
          </div>
        </Paper>
      </motion.div>
    </>
  );
};

export default ProductDetail;
