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
import { Search } from "@material-ui/icons";
import AddIcon from "@material-ui/icons/Add";
import React, { useState, useEffect, useContext } from "react";

import Input from "./Controls/Input";

import DiscountsForm from "./DiscountsForm";

import DiscountButton from "./Controls/DiscountButton";

import PopUp from "./Controls/PopUp";
import ActionButton from "./Controls/ActionButton";
import Notification from "./Controls/Notification";
import ConfirmDialog from "./Controls/ConfirmDialog";

import CloseIcon from "@material-ui/icons/Close";
import EditOutlinedIcon from "@material-ui/icons/EditOutlined";

import DiscountsStatus from "./DiscountsStatus";

import { GlobalState } from "../../../GlobalState";

import axios from "axios";

import { motion } from "framer-motion";

const Discounts = () => {
  const state = useContext(GlobalState);

  const [discounts, setDiscounts] = state.discountsAPI.discounts;
  const [token] = state.token;
  const [onEdit, setOnEdit] = useState(false);
  const [callback, setCallback] = state.discountsAPI.callback;

  //chứa discount  update
  const [updateDiscount, setUpdateDiscount] = useState(null);

  const [pages, setPages] = useState([5, 10, 25]);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [order, setOrder] = useState("");
  const [orderBy, setOrderBy] = useState("");
  const [filterFunc, setFilterFunc] = useState({
    func: (discounts) => {
      return discounts;
    },
  });

  //Popup modal
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
      id: "name",
      label: "Discount Coupon",
    },
    {
      id: "discountValue",
      label: "Discount Value",
    },
    {
      id: "expireTime",
      label: "Expire Time",
    },
    {
      id: "minimumValue",
      label: "Minimum Value",
    },
    {
      id: "status",
      label: "Status",
      disableSorting: true,
    },
    {
      id: "actions",
      label: "Actions",
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
      func: (discounts) => {
        if (target.value === "") return discounts;
        else
          return discounts.filter((discount) =>
            discount.name.toLowerCase().includes(target.value)
          );
      },
    });
  };

  const recordsAfterPagingAndSorting = () => {
    return tableSort(
      filterFunc.func(discounts),
      getComparator(order, orderBy)
    ).slice(page * rowsPerPage, (page + 1) * rowsPerPage);
  };

  const handleSortLabel = (cellID) => {
    const isAsc = orderBy === cellID && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(cellID);
  };

  const openInPopUp = (discount) => {
    setUpdateDiscount(discount);
    setOpenPopUp(true);
  };

  const onDelete = async (discountID) => {
    setConfirmDialog({ ...confirmDialog, isOpen: false });

    try {
      const res = await axios.delete(`/api/discount/${discountID}`, {
        headers: { Authorization: token },
      });

      setCallback(!callback);
    } catch (error) {
      alert(error.response.data.msg);
    }

    setNotify({
      isOpen: true,
      message: "Deleted Successfully!",
      type: "error",
    });
  };

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

  const classes = useStyles();

  return (
    <motion.div
      exit={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      initial={{ opacity: 0 }}
    >
      {/* Discounts List */}
      <Paper className={classes.pageContent}>
        <Toolbar>
          <Input
            onChange={handleSearch}
            label="Search Discounts"
            className={classes.searchInput}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search></Search>
                </InputAdornment>
              ),
            }}
          ></Input>
          <DiscountButton
            text="Add New"
            variant="outlined"
            startIcon={<AddIcon></AddIcon>}
            className={classes.newButton}
            onClick={() => {
              setOpenPopUp(true);
              setUpdateDiscount(null);
              setOnEdit(false);
            }}
          ></DiscountButton>
        </Toolbar>

        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              <TableCell style={{ color: "white" }} colSpan={7}>
                Discounts Table
              </TableCell>
            </TableRow>
            <TableRow>
              {headCells.map((headCell) => (
                <TableCell
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
            {recordsAfterPagingAndSorting().map((discount, index) => (
              <TableRow key={index}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{discount.name}</TableCell>
                <TableCell>{discount.discountValue}%</TableCell>
                <TableCell>{discount.expireTime}</TableCell>
                <TableCell>{discount.minimumValue}</TableCell>
                <TableCell>
                  <DiscountsStatus
                    expireTime={discount.expireTime}
                  ></DiscountsStatus>
                </TableCell>
                <TableCell>
                  <ActionButton
                    color="primary"
                    onClick={() => {
                      openInPopUp(discount);
                      setOnEdit(true);
                    }}
                  >
                    <EditOutlinedIcon fontSize="small"></EditOutlinedIcon>
                  </ActionButton>
                  <ActionButton
                    color="secondary"
                    onClick={() => {
                      setConfirmDialog({
                        isOpen: true,
                        title: "Are you sure to delete this discount?",
                        subTitle: "You can't undo this action!",
                        onConfirm: () => {
                          onDelete(discount._id);
                        },
                      });
                    }}
                  >
                    <CloseIcon fontSize="small"></CloseIcon>
                  </ActionButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={pages}
          component="div"
          count={discounts.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        ></TablePagination>
      </Paper>
      <PopUp
        openPopUp={openPopUp}
        setOpenPopUp={setOpenPopUp}
        title="Discount Form"
      >
        <DiscountsForm
          openPopUp={openPopUp}
          setOpenPopUp={setOpenPopUp}
          updateDiscount={updateDiscount}
          setUpdateDiscount={setUpdateDiscount}
          notify={notify}
          setNotify={setNotify}
          callback={callback}
          setCallback={setCallback}
          onEdit={onEdit}
          setOnEdit={setOnEdit}
        ></DiscountsForm>
      </PopUp>
      <Notification notify={notify} setNotify={setNotify}></Notification>
      <ConfirmDialog
        confirmDialog={confirmDialog}
        setConfirmDialog={setConfirmDialog}
      ></ConfirmDialog>
    </motion.div>
  );
};

export default Discounts;
