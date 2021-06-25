import React, { useContext, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { GlobalState } from "../../../GlobalState";
import "./OrderDetail.css";

import { motion } from "framer-motion";

import Input from "../discounts/Controls/Input";
import Typography from "@material-ui/core/Typography";
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
import { Search } from "@material-ui/icons";
import AddIcon from "@material-ui/icons/Add";
import TextField from "@material-ui/core/TextField";
import PageviewOutlinedIcon from "@material-ui/icons/PageviewOutlined";

const OrderDetail = () => {
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
  const [openPopUp, setOpenPopUp] = useState(false);

  //Notification
  const [notify, setNotify] = useState({
    isOpen: false,
    message: "",
    type: "",
  });

  //Confirm Dialog
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: "",
    subTitle: "",
  });

  const addressHeadCells = [
    {
      id: "name",
      label: "Name",
      disableSorting: true,
    },
    {
      id: "address",
      label: "Address",
      disableSorting: true,
    },
    {
      id: "postalcode",
      label: "Postal Code",
      disableSorting: true,
    },
    {
      id: "countrycode",
      label: "Country Code",
      disableSorting: true,
    },
  ];
  const productHeadCells = [
    {
      id: "index",
      label: "Index",
      disableSorting: true,
    },
    {
      id: "title",
      label: "Title",
    },
    {
      id: "image",
      label: "Image",
      disableSorting: true,
    },
    {
      id: "quantity",
      label: "Quantity",
    },
    {
      id: "postalcode",
      label: "Price",
    },
    {
      id: "countrycode",
      label: "Total",
    },
  ];

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  function tableSort(array, comparator) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
      const order = comparator(a[0], b[0]);
      if (order !== 0) return order;
      return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
  }

  function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
      return -1;
    }
    if (b[orderBy] > a[orderBy]) {
      return 1;
    }
    return 0;
  }

  function getComparator(order, orderBy) {
    return order === "desc"
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy);
  }

  const handleSearch = (event) => {
    let target = event.target;
    setFilterFunc({
      func: (history) => {
        if (target.value === "") return history;
        else
          return history.filter((payment) =>
            payment.paymentID.toLowerCase().includes(target.value.toLowerCase())
          );
      },
    });
  };

  const recordsAfterPagingAndSorting = () => {
    return tableSort(
      filterFunc.func(orderDetail.cart),
      getComparator(order, orderBy)
    ).slice(page * rowsPerPage, (page + 1) * rowsPerPage);
  };

  const handleSortLabel = (cellID) => {
    const isAsc = orderBy === cellID && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(cellID);
  };

  const [pages, setPages] = useState([5, 10, 25]);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [order, setOrder] = useState("");
  const [orderBy, setOrderBy] = useState("");
  const [filterFunc, setFilterFunc] = useState({
    func: (allUsers) => {
      return allUsers;
    },
  });
  const classes = useStyles();

  ////////////////////////
  const state = useContext(GlobalState);
  const [history] = state.userAPI.history;
  const [orderDetail, setOrderDetail] = useState([]);

  const params = useParams();

  useEffect(() => {
    if (params.id) {
      history.forEach((payment) => {
        if (payment._id === params.id) setOrderDetail(payment);
      });
    }
  }, [params.id, history]);

  if (orderDetail.length === 0) {
    return null;
  }

  return (
    <motion.div
      exit={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      initial={{ opacity: 0 }}
    >
      <Paper className={classes.pageContent}>
        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              <TableCell style={{ color: "white" }} colSpan={7}>
                Shipment Detail
              </TableCell>
            </TableRow>
            <TableRow>
              {addressHeadCells.map((headCell) => (
                <TableCell
                  align="center"
                  key={headCell.id}
                  sortDirection={orderBy === headCell.id ? order : false}
                  style={{ color: "#eee" }}
                >
                  {headCell.disableSorting ? (
                    headCell.label
                  ) : (
                    <TableSortLabel
                      active={orderBy === headCell.id}
                      direction={orderBy === headCell.id ? order : "asc"}
                      onClick={() => {
                        handleSortLabel(headCell.id);
                      }}
                    >
                      {headCell.label}
                    </TableSortLabel>
                  )}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell align="center">
                {orderDetail.address.recipient_name}
              </TableCell>
              <TableCell align="center">
                {orderDetail.address.line1 + " - " + orderDetail.address.city}
              </TableCell>
              <TableCell align="center">
                {" "}
                {orderDetail.address.postal_code}
              </TableCell>
              <TableCell align="center">
                {" "}
                {orderDetail.address.country_code}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              <TableCell style={{ color: "white" }} colSpan={7}>
                Payment Table
              </TableCell>
            </TableRow>
            <TableRow>
              {productHeadCells.map((headCell) => (
                <TableCell
                  align="center"
                  key={headCell.id}
                  sortDirection={orderBy === headCell.id ? order : false}
                  style={{ color: "#eee" }}
                >
                  {productHeadCells.disableSorting ? (
                    headCell.label
                  ) : (
                    <TableSortLabel
                      active={orderBy === headCell.id}
                      direction={orderBy === headCell.id ? order : "asc"}
                      onClick={() => {
                        handleSortLabel(headCell.id);
                      }}
                    >
                      {headCell.label}
                    </TableSortLabel>
                  )}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {recordsAfterPagingAndSorting().map((product, index) => (
              <TableRow key={index}>
                <TableCell align="center">{index + 1}</TableCell>
                <TableCell align="center">{product.title}</TableCell>
                <TableCell>
                  <img src={product.image.url} alt="Product Image"></img>
                </TableCell>
                <TableCell align="center">{product.quantity}</TableCell>
                <TableCell align="center">{product.price}</TableCell>
                <TableCell align="center">
                  {product.price * product.quantity}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={pages}
          component="div"
          count={orderDetail.cart.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        ></TablePagination>
      </Paper>
      {/* <div className="history-page">
        <div>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Address</th>
                <th>Postal Code</th>
                <th>Country Code</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{orderDetail.address.recipient_name}</td>
                <td>
                  {orderDetail.address.line1 + " - " + orderDetail.address.city}
                </td>
                <td>{orderDetail.address.postal_code}</td>
                <td>{orderDetail.address.country_code}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <table style={{ margin: "30px 0px" }}>
          <thead>
            <tr>
              <th></th>
              <th>Products</th>
              <th>Quantity</th>
              <th>Price</th>
            </tr>
          </thead>
          <tbody>
            {orderDetail.cart.map((product) => (
              <tr key={product._id}>
                <td>
                  <img src={product.image.url} alt="Product Image"></img>
                </td>
                <td>{product.title}</td>
                <td>{product.quantity}</td>
                <td>{product.price * product.quantity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div> */}
    </motion.div>
  );
};

export default OrderDetail;
