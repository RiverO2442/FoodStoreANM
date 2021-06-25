import React, { useContext, useState } from "react";
import { GlobalState } from "../../../GlobalState";
import ProductItem from "../Utils/productItem/ProductItem";
import "./Products.css";
import Loading from "../Utils/Loading/Loading";
import axios from "axios";
import FiltersProducts from "./FilterProducts";
import LoadMore from "./LoadMore";
import background from "./fast-food.jpg";
import swal from "sweetalert";
import Pagination from "./Pagination";

import SideBar from "./sidebar/SideBar";

import { motion } from "framer-motion";

const Products = () => {
  const state = useContext(GlobalState);
  const [products, setProducts] = state.productsAPI.products;
  const [isAdmin] = state.userAPI.isAdmin;
  const [token] = state.token;
  const [callback, setCallback] = state.productsAPI.callback;
  const [isCheck, setIsCheck] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage, setProductsPerPage] = useState(8);

  const handleCheck = (id) => {
    products.forEach((product) => {
      if (product._id === id) product.checked = !product.checked;
    });
    setProducts([...products]);
  };

  const deleteProduct = async (id, public_id) => {
    try {
      setIsLoading(true);
      const destroyImg = axios.post(
        "/api/destroy",
        { public_id },
        { headers: { Authorization: token } }
      );
      const destroyProduct = axios.delete(`/api/products/${id}`, {
        headers: { Authorization: token },
      });
      await destroyImg;
      await destroyProduct;
      setCallback(!callback);
      setIsLoading(false);
      swal({
        title: "Info !",
        text: "Product Deleted!",
        icon: "success",
        confirmButtonText: "Yes",
      });
    } catch (error) {
      alert(error.response.data.msg);
    }
  };

  const checkAll = () => {
    products.forEach((product) => {
      product.checked = !isCheck;
    });
    setProducts([...products]);
    setIsCheck(!isCheck);
  };

  const deleteAll = () => {
    products.forEach((product) => {
      if (product.checked) deleteProduct(product._id, product.image.public_id);
    });
  };

  if (isLoading)
    return (
      <div style={{ minHeight: "700px" }}>
        <Loading></Loading>
      </div>
    );

  //code below is using for pagination the products per page

  //Get current products
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  //Change page
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <motion.div
      exit={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      initial={{ opacity: 0 }}
    >
      {/* <div
        style={{ backgroundImage: `url('${background}')`, objectFit: "fill" }}
      > */}
      {isAdmin && (
        <div className="delete-all">
          <h6>Hiển thị: {currentProducts.length} kết quả</h6>
          <span>Select all</span>
          <input type="checkbox" checked={isCheck} onChange={checkAll}></input>
          <button onClick={deleteAll}>Delete All</button>
        </div>
      )}
      <div className="both-container" style={{ minHeight: "700px" }}>
        <SideBar></SideBar>
        <div className="products">
          {currentProducts.map((product) => {
            return (
              <ProductItem
                key={product._id}
                product={product}
                isAdmin={isAdmin}
                deleteProduct={deleteProduct}
                handleCheck={handleCheck}
              ></ProductItem>
            );
          })}
        </div>
      </div>
      <Pagination
        productsPerPage={productsPerPage}
        totalProducts={products.length}
        paginate={paginate}
      ></Pagination>

      {/* <LoadMore></LoadMore> */}
      {products.length === 0 && <Loading></Loading>}
      {/* </div> */}
    </motion.div>
  );
};

export default Products;
