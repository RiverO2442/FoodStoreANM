import React, { useContext, useEffect, useState } from "react";
import { GlobalState } from "../../../GlobalState";
import { Link } from "react-router-dom";
import "./OrderHistory.css";
import axios from "axios";

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

const OrderHistory = () => {
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

  const headCells = [
    {
      id: "index",
      label: "Index",
      disableSorting: true,
    },
    {
      id: "paymentID",
      label: "Payment ID",
    },
    {
      id: "createdAt",
      label: "Created Date",
    },
    {
      id: "actions",
      label: "Detail",
      colSpan: 4,
      disableSorting: true,
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
      filterFunc.func(history),
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
  //

  const classes = useStyles();

  const state = useContext(GlobalState);
  const [history, setHistory] = state.userAPI.history;
  const [isAdmin] = state.userAPI.isAdmin;
  const [token] = state.token;

  useEffect(() => {
    if (token) {
      const getHistory = async () => {
        if (isAdmin) {
          const res = await axios.get("/api/payment", {
            headers: { Authorization: token },
          });
          setHistory(res.data);
        } else {
          const res = await axios.get("/user/history", {
            headers: { Authorization: token },
          });
          setHistory(res.data);
        }
      };
      getHistory();
    }
  }, [token, isAdmin, setHistory]);
  if (history.length === 0) {
    return (
      <div style={{ minHeight: "900px", backgroundColor: "#f9f9f9" }}>
        {" "}
        <h1 style={{ paddingTop: "5rem", fontSize: "60px" }}>History Emty</h1>
      </div>
    );
  }
  return (
    <motion.div
      exit={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      initial={{ opacity: 0 }}
    >
      <Paper className={classes.pageContent}>
        <Toolbar>
          <Input
            onChange={handleSearch}
            label="Search Payment"
            className={classes.searchInput}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search></Search>
                </InputAdornment>
              ),
            }}
          ></Input>
        </Toolbar>
        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              <TableCell style={{ color: "white" }} colSpan={7}>
                Payment Table
              </TableCell>
            </TableRow>
            <TableRow>
              {headCells.map((headCell) => (
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
            {recordsAfterPagingAndSorting().map((payment, index) => (
              <TableRow key={index}>
                <TableCell align="center">{index + 1}</TableCell>
                <TableCell align="center">{payment.paymentID}</TableCell>
                <TableCell align="center">
                  {new Date(payment.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell align="center">
                  <Link to={`/history/${payment._id}`}>
                    <PageviewOutlinedIcon fontSize="large" color="action" />
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={pages}
          component="div"
          count={history.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        ></TablePagination>
      </Paper>
    </motion.div>
  );
};

export default OrderHistory;
