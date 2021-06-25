import React, { useState, useContext } from "react";
import { GlobalState } from "../../../GlobalState";
import "./Categories.css";
import axios from "axios";
import swal from "sweetalert";

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

import { Search } from "@material-ui/icons";
import AddIcon from "@material-ui/icons/Add";
import TextField from "@material-ui/core/TextField";
import EditOutlinedIcon from "@material-ui/icons/EditOutlined";
import Button from "@material-ui/core/Button";
import DeleteOutlinedIcon from "@material-ui/icons/DeleteOutlined";
import ArchiveIcon from "@material-ui/icons/Archive";
import NoteAddIcon from "@material-ui/icons/NoteAdd";

const Categories = () => {
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
      margin: theme.spacing(0),
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
      label: "Category Name",
    },
    {
      id: "actions",
      label: "Action",
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
      func: (categories) => {
        if (target.value === "") return categories;
        else
          return categories.filter((category) =>
            category.name.toLowerCase().includes(target.value.toLowerCase())
          );
      },
    });
  };

  const recordsAfterPagingAndSorting = () => {
    return tableSort(
      filterFunc.func(categories),
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

  //////////////////////////////
  const state = useContext(GlobalState);
  const [categories, setCategories] = state.categoriesAPI.categories;
  const [token] = state.token;
  const [category, setCategory] = useState("");
  const [callback, setCallback] = state.categoriesAPI.callback;
  const [onEdit, setOnEdit] = useState(false);
  const [id, setID] = useState("");

  const createCategory = async (event) => {
    event.preventDefault();
    try {
      if (onEdit) {
        const res = await axios.put(
          `/api/category/${id}`,
          { name: category },
          {
            headers: { Authorization: token },
          }
        );
        swal({
          title: "Info !",
          text: res.data.msg,
          icon: "success",
          confirmButtonText: "Yes",
        });
      } else {
        const res = await axios.post(
          "/api/category",
          { name: category },
          {
            headers: { Authorization: token },
          }
        );
        swal({
          title: "Info !",
          text: res.data,
          icon: "success",
          confirmButtonText: "Yes",
        });
      }
      setOnEdit(false);
      setCategory("");
      setCallback(!callback);
    } catch (error) {
      alert(error.response.data.msg);
    }
  };

  const editCategory = async (id, name) => {
    setID(id);
    setCategory(name);
    setOnEdit(true);
  };

  const deleteCategory = async (id) => {
    try {
      const res = await axios.delete(`/api/category/${id}`, {
        headers: { Authorization: token },
      });
      swal({
        title: "Info !",
        text: res.data.msg,
        icon: "success",
        confirmButtonText: "Yes",
      });
      setCallback(!callback);
    } catch (error) {
      alert(error.response.data.msg);
    }
  };

  return (
    <motion.div
      exit={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      initial={{ opacity: 0 }}
    >
      <div>
        <Paper className={classes.pageContent}>
          <Toolbar>
            <Input
              style={{ width: "40%" }}
              onChange={handleSearch}
              label="Search Category"
              className={classes.searchInput}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search></Search>
                  </InputAdornment>
                ),
              }}
            ></Input>
            <Input
              label={onEdit ? "Category" : "New Category"}
              InputLabelProps={{ shrink: true }}
              style={{ width: "30%", margin: "0px 1rem 0rem 20rem" }}
              type="text"
              name="category"
              value={category}
              required
              onChange={(event) => setCategory(event.target.value)}
            ></Input>
            <Button
              startIcon={onEdit ? <ArchiveIcon /> : <NoteAddIcon />}
              type="submit"
              variant="contained"
              color="primary"
              onClick={createCategory}
            >
              {onEdit ? "Update" : "Create"}
            </Button>
          </Toolbar>
          <Table className={classes.table}>
            <TableHead>
              <TableRow>
                <TableCell style={{ color: "white" }} colSpan={7}>
                  Category Table
                </TableCell>
              </TableRow>
              <TableRow>
                {headCells.map((headCell) => (
                  <TableCell
                    align="center"
                    colSpan={headCell.id == "actions" ? "2" : "1"}
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
              {recordsAfterPagingAndSorting().map((category, index) => (
                <TableRow key={index}>
                  <TableCell align="center">{index + 1}</TableCell>
                  <TableCell align="center">{category.name}</TableCell>
                  <TableCell
                    style={{ width: "10%", borderRightColor: "white" }}
                    align="center"
                  >
                    <Button
                      variant="contained"
                      color="primary"
                      className={classes.button}
                      startIcon={
                        <EditOutlinedIcon
                          style={{
                            marginLeft: "10px",
                          }}
                        />
                      }
                      onClick={() => editCategory(category._id, category.name)}
                    ></Button>
                  </TableCell>
                  <TableCell style={{ width: "10%" }} align="center">
                    <Button
                      variant="contained"
                      color="secondary"
                      className={classes.button}
                      startIcon={
                        <DeleteOutlinedIcon
                          style={{
                            marginLeft: "10px",
                          }}
                        />
                      }
                      onClick={() => deleteCategory(category._id)}
                    ></Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <TablePagination
            rowsPerPageOptions={pages}
            component="div"
            count={categories.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onChangePage={handleChangePage}
            onChangeRowsPerPage={handleChangeRowsPerPage}
          ></TablePagination>
        </Paper>
        {/* <form onSubmit={createCategory}>
          <label htmlFor="category">Category</label>
          <input
            type="text"
            name="category"
            value={category}
            required
            onChange={(event) => setCategory(event.target.value)}
          ></input>

          <button type="submit">{onEdit ? "Update" : "Create"}</button>
        </form>

        <div className="col">
          {categories.map((category) => (
            <div className="row" key={category._id}>
              <p>{category.name}</p>
              <div>
                <button
                  onClick={() => editCategory(category._id, category.name)}
                >
                  Edit
                </button>
                <button onClick={() => deleteCategory(category._id)}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div> */}
      </div>
    </motion.div>
  );
};

export default Categories;
