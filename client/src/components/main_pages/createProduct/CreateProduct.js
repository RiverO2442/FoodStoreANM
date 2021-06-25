import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { GlobalState } from "../../../GlobalState";
import Loading from "../Utils/Loading/Loading";
import "./CreateProduct.css";
import { useHistory, useParams } from "react-router-dom";
import swal from "sweetalert";
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
import TextareaAutosize from "@material-ui/core/TextareaAutosize";

import { motion } from "framer-motion";

const initState = {
  product_id: "",
  title: "",
  price: 0,
  description: "A brand new product totally cool",
  content: "A tasty food !",
  category: "",
};

const CreateProduct = () => {
  //MUI
  const useStyles = makeStyles((theme) => ({
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
    button: {
      margin: theme.spacing(1),
    },
    searchInput: {
      width: "75%",
    },
    pageContent: {
      margin: theme.spacing(5),
      padding: theme.spacing(3),
    },
    newButton: {
      position: "absolute",
      right: "10px",
      padding: "20px 20px",
    },
  }));
  const classes = useStyles();
  ///////////////////////////
  const state = useContext(GlobalState);
  const [product, setProduct] = useState(initState);
  const [categories] = state.categoriesAPI.categories;
  const [image, setImage] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isAdmin] = state.userAPI.isAdmin;
  const [token] = state.token;

  const history = useHistory();
  const param = useParams();

  const [products] = state.productsAPI.products;
  const [onEdit, setOnEdit] = useState(false);

  const [callback, setCallback] = state.productsAPI.callback;

  useEffect(() => {
    if (param.id) {
      setOnEdit(true);
      products.forEach((product) => {
        if (product._id === param.id) {
          setProduct(product);
          setImage(product.image);
        }
      });
    } else {
      setOnEdit(false);
      setProduct(initState);
      setImage(false);
    }
  }, [param.id, products]);

  const handleUpload = async (e) => {
    e.preventDefault();
    try {
      if (!isAdmin) return alert("You're not an admin");
      const file = e.target.files[0];

      if (!file) return alert("File not exist.");

      if (file.size > 1024 * 1024) return alert("Size too large!");

      if (file.type !== "image/jpeg" && file.type !== "image/png")
        // 1mb
        return alert("File format is incorrect.");

      let formData = new FormData();
      formData.append("file", file);

      setLoading(true);
      const res = await axios.post("/api/upload", formData, {
        headers: {
          "content-type": "multipart/form-data",
          Authorization: token,
        },
      });
      setLoading(false);
      setImage(res.data);
    } catch (err) {
      alert(err.response.data.msg);
    }
  };

  const handleDestroy = async (event) => {
    try {
      if (!isAdmin) return alert("You are not an admin");
      setLoading(true);
      await axios.post(
        "/api/destroy",
        { public_id: image.public_id },
        {
          headers: { Authorization: token },
        }
      );
      setLoading(false);
      setImage(false);
    } catch (error) {
      return alert(error.response.data.msg);
    }
  };

  const handleChangeInput = (event) => {
    const { name, value } = event.target;
    setProduct({ ...product, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      if (!isAdmin) return alert("You are not an admin");
      if (!image) return alert("No image uploaded");
      if (onEdit) {
        await axios.put(
          `/api/products/${product._id}`,
          { ...product, image },
          { headers: { Authorization: token } }
        );
        swal({
          title: "Info !",
          text: "Updated Product Successfully",
          icon: "success",
          confirmButtonText: "Yes",
        });
      } else {
        await axios.post(
          "/api/products",
          { ...product, image },
          { headers: { Authorization: token } }
        );
        swal({
          title: "Info !",
          text: "Product Created!",
          icon: "success",
          confirmButtonText: "Yes",
        });
      }
      setCallback(!callback);
      setImage(false);
      setProduct(initState);
      history.push("/products");
    } catch (error) {
      return alert(error.response.data.msg);
    }
  };

  const styleUpload = {
    display: image ? "block" : "none",
  };

  return (
    <motion.div
      exit={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      initial={{ opacity: 0 }}
    >
      <Paper>
        <div className="create_product">
          <Grid
            container
            direction="row"
            justify="flex-start"
            alignItems="flex-start"
            style={{ minHeight: "700px" }}
          >
            <Grid item xs={4}>
              <div className="upload">
                <input
                  type="file"
                  name="file"
                  id="file_up"
                  onChange={handleUpload}
                />

                {loading ? (
                  <div className="loading-img">
                    <Loading></Loading>
                  </div>
                ) : (
                  <div id="file_img" style={styleUpload}>
                    <img src={image ? image.url : ""} alt="" />
                    <span onClick={handleDestroy}>X</span>
                  </div>
                )}
              </div>
            </Grid>
            <Grid item xs>
              <form onSubmit={handleSubmit} className={classes.form}>
                <TextField
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  label="Product ID"
                  type="text"
                  name="product_id"
                  id="product_id"
                  required
                  value={product.product_id}
                  onChange={handleChangeInput}
                  disabled={onEdit}
                />
                <TextField
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  label="Title"
                  type="text"
                  name="title"
                  id="title"
                  required
                  value={product.title}
                  onChange={handleChangeInput}
                />
                <TextField
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  label="Price"
                  type="number"
                  name="price"
                  id="price"
                  required
                  value={product.price}
                  onChange={handleChangeInput}
                />
                <TextField
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  label="Description"
                  type="text"
                  name="description"
                  id="description"
                  required
                  value={product.description}
                  onChange={handleChangeInput}
                  multiline
                  rows={5}
                  rowsMax={5}
                />
                <TextField
                  multiline
                  rows={5}
                  rowsMax={5}
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  label="Description"
                  type="text"
                  name="content"
                  id="content"
                  required
                  value={product.content}
                  onChange={handleChangeInput}
                />
                {/* <Autocomplete
                  name="category"
                  options={categories}
                  getOptionLabel={(Category) => Category.name}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Category"
                      variant="outlined"
                      value={product.category}
                      onChange={handleChangeInput}
                    />
                  )}
                /> */}
                <div className="row">
                  <label htmlFor="categories">Categories: </label>
                  <select
                    name="category"
                    value={product.category}
                    onChange={handleChangeInput}
                  >
                    <option value="">Please select a category</option>
                    {categories.map((category) => (
                      <option value={category._id} key={category._id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
                <Button
                  style={{ marginTop: "10px" }}
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  type="submit"
                >
                  {onEdit ? "Update" : "Create"}
                </Button>
              </form>
            </Grid>
          </Grid>
        </div>
      </Paper>
    </motion.div>
  );
};

export default CreateProduct;
