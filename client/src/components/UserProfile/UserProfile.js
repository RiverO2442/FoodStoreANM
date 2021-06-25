import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { isLength, isMatch } from "../main_pages/Utils/Validation/Validation";
import { GlobalState } from "../../GlobalState";

import "./UserProfile.css";

import UserActive from "./UserActive";

import Notification from "../main_pages/discounts/Controls/Notification";

import TableContainer from "@material-ui/core/TableContainer";
import Input from "../main_pages/discounts/Controls/Input";
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
import Grid from "@material-ui/core/Grid";
import EditOutlinedIcon from "@material-ui/icons/EditOutlined";
import DeleteOutlinedIcon from "@material-ui/icons/DeleteOutlined";

const initialState = {
  name: "",
  password: "",
  confirm_password: "",
  error: "",
  success: "",
};
//MUI table
const UserProfile = () => {
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
    pageContent2: {},
    newButton: {
      position: "absolute",
      right: "10px",
      padding: "20px 20px",
    },
    button: {
      paddingRight: "10px",
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

  const favheadCells = [
    {
      id: "index",
      label: "Index",
      disableSorting: true,
    },
    {
      id: "title",
      label: "Product Name",
    },
    {
      id: "price",
      label: "Price",
    },
    {
      id: "description",
      label: "Description",
    },
    {
      id: "actions",
      label: "Action",
      colSpan: 4,
      disableSorting: true,
    },
  ];
  const headCells = [
    {
      id: "index",
      label: "Index",
      disableSorting: true,
    },
    {
      id: "Status",
      label: "Status",
      disableSorting: true,
    },
    {
      id: "name",
      label: "User Name",
    },
    {
      id: "email",
      label: "User Mail",
    },
    {
      id: "role",
      label: "Admin",
    },
    {
      id: "actions",
      label: "Action",
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
      func: (allUsers) => {
        if (target.value === "") return allUsers;
        else
          return allUsers.filter((user) =>
            user.name.toLowerCase().includes(target.value.toLowerCase())
          );
      },
    });
  };

  const handleSearchFav = (event) => {
    let target = event.target;
    setFilterFunc({
      func: (favoriteProducts) => {
        if (target.value === "") return favoriteProducts;
        else
          return favoriteProducts.filter((product) =>
            product.title.toLowerCase().includes(target.value.toLowerCase())
          );
      },
    });
  };

  const recordsAfterPagingAndSorting = () => {
    return tableSort(
      filterFunc.func(allUsers),
      getComparator(order, orderBy)
    ).slice(page * rowsPerPage, (page + 1) * rowsPerPage);
  };

  const recordsAfterPagingAndSortingFav = () => {
    return tableSort(
      filterFunc.func(favoriteProducts),
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

  const state = useContext(GlobalState);
  const [token] = state.token;
  const [isAdmin, setIsAdmin] = state.userAPI.isAdmin;
  const [user, setUser] = state.userAPI.user;
  const [allUsers, setAllUsers] = state.userAPI.allUsers;
  const [callback, setCallback] = state.userAPI.callback;

  const [favoriteProducts, setfavoriteProducts] =
    state.userAPI.favoriteProducts;

  const [avatar, setAvatar] = useState(false);
  const [loading, setLoading] = useState(false);

  const [data, setData] = useState(initialState);
  const { name, password, confirm_password, error, success } = data;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value, error: "", success: "" });
  };

  const changeAvatar = async (e) => {
    e.preventDefault();
    try {
      const file = e.target.files[0];

      if (!file)
        return setNotify({
          isOpen: true,
          message: "No file uploaded!",
          type: "error",
        });
      //1MB
      if (file.size > 1024 * 1024) {
        return setNotify({
          isOpen: true,
          message: "Size too large!",
          type: "error",
        });
      }

      if (file.type !== "image/jpeg" && file.type !== "image/png") {
        return setNotify({
          isOpen: true,
          message: "Invalid format!",
          type: "error",
        });
      }

      let formData = new FormData();
      formData.append("file", file);

      setLoading(true);

      const res = await axios.post("/api/upload_avatar", formData, {
        headers: {
          "content-type": "multipart/form-data",
          Authorization: token,
        },
      });

      setLoading(false);

      setAvatar(res.data.url);
    } catch (error) {
      setNotify({
        isOpen: true,
        message: error.response.data.msg,
        type: "error",
      });
    }
  };

  const updateUser = () => {
    try {
      axios.patch(
        "/user/update",
        {
          name: name ? name : user.name,
          avatar: avatar ? avatar : user.avatar,
        },
        {
          headers: { Authorization: token },
        }
      );
      setCallback(!callback);
      console.log(token);

      setNotify({
        isOpen: true,
        message: "Updated Successfully",
        type: "success",
      });
    } catch (error) {
      setNotify({
        isOpen: true,
        message: error.response.data.msg,
        type: "error",
      });
    }
  };

  const updateUserPassword = () => {
    if (isLength(password)) {
      return setNotify({
        isOpen: true,
        message: "Password must be at least 6 characters.",
        type: "error",
      });
    }
    if (!isMatch(password, confirm_password)) {
      return setNotify({
        isOpen: true,
        message: "Passwords do not match !",
        type: "error",
      });
    }
    try {
      axios.post(
        "/user/reset",
        { password },
        {
          headers: { Authorization: token },
        }
      );
      setData({ ...data, error: "", success: "Updated Successfully" });
      setNotify({
        isOpen: true,
        message: "Update Successfully",
        type: "success",
      });
    } catch (error) {
      setData({ ...data, error: error.response.data.msg, success: "" });
    }
  };

  //Update all info by combining two func into one
  const handleUpdate = (e) => {
    e.preventDefault();
    if (name || avatar) updateUser();
    if (password) updateUserPassword();
  };

  const handleDelete = async (id) => {
    try {
      // tranh truong hop tu huy , k dc tu xoa ban than
      if (user._id !== id) {
        if (window.confirm("Are you sure you want to delete this account?")) {
          setLoading(true);
          await axios.delete(`/user/delete/${id}`, {
            headers: { Authorization: token },
          });
          setLoading(false);
          setCallback(!callback);
        }
      } else {
        setNotify({
          isOpen: true,
          message: "You can't delete yourself",
          type: "error",
        });
      }
    } catch (error) {
      setData({ ...data, error: error.response.data.msg, success: "" });
    }
  };

  // custom hàm addtofavorite List lại vì nó chỉ thực hiện duy nhất là set cái list này lại thôi.
  const addToFavoriteList = async (favoriteProducts) => {
    await axios.patch(
      "/user/add_favoriteList",
      { favoriteProducts },
      {
        headers: { Authorization: token },
      }
    );
  };

  // xóa sản phẩm yêu thích khỏi list
  const handleDeleteFavoriteProduct = (id) => {
    if (
      window.confirm(
        "Are you sure to remove this product from your favorite list ?"
      )
    ) {
      favoriteProducts.forEach((product, index) => {
        if (product._id === id) {
          favoriteProducts.splice(index, 1);
        }
      });
    }
    setfavoriteProducts([...favoriteProducts]);
    addToFavoriteList(favoriteProducts);
  };

  return (
    <>
      <div>
        <Notification notify={notify} setNotify={setNotify}></Notification>
      </div>
      <div className="profile_page">
        <Paper className={classes.pageContent}>
          <Grid
            container
            direction="row"
            justify="flex-start"
            alignItems="flex-start"
            style={{ minHeight: "700px" }}
          >
            <Grid item xs={4}>
              <div className="col-left">
                <div className="avatar">
                  <img src={avatar ? avatar : user.avatar}></img>
                  <span>
                    <i className="fas fa-camera-retro"></i>
                    <p>Change</p>
                    <input
                      type="file"
                      name="file"
                      id="file_up"
                      onChange={changeAvatar}
                    ></input>
                  </span>
                </div>
                <form className={classes.form}>
                  <TextField
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    label="Name"
                    type="text"
                    name="name"
                    id="name"
                    defaultValue={user.name}
                    placeholder="Your name"
                    onChange={handleChange}
                  />
                  <TextField
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    label="Email"
                    type="email"
                    name="email"
                    id="email"
                    defaultValue={user.email}
                    placeholder="Your Email"
                    disabled
                  />
                  <TextField
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    label="Password"
                    type="password"
                    name="password"
                    id="password"
                    placeholder="Your password"
                    value={password}
                    onChange={handleChange}
                  />
                  <TextField
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    label="Confirm Password"
                    type="password"
                    name="confirm_password"
                    id="confirm_password"
                    placeholder="Confirm Password"
                    value={confirm_password}
                    onChange={handleChange}
                  />
                  <div>
                    <em style={{ color: "crimson" }}>
                      * If you update your password here, you won't able to
                      login quickly using google and facebook.
                    </em>
                  </div>

                  <Button
                    style={{ marginTop: "15px" }}
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="primary"
                    disabled={loading}
                    onClick={handleUpdate}
                  >
                    Update
                  </Button>
                </form>
              </div>
            </Grid>
            <Grid item xs={8} style={{ paddingTop: "5%" }}>
              {isAdmin ? (
                <div style={{ overflowX: "auto" }}>
                  <Toolbar>
                    <Input
                      onChange={handleSearch}
                      label="Search User"
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
                          User Table
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        {headCells.map((headCell) => (
                          <TableCell
                            align="center"
                            colSpan={headCell.id == "actions" ? "2" : "1"}
                            key={headCell.id}
                            sortDirection={
                              orderBy === headCell.id ? order : false
                            }
                            style={{ color: "#eee" }}
                          >
                            {headCell.disableSorting ? (
                              headCell.label
                            ) : (
                              <TableSortLabel
                                active={orderBy === headCell.id}
                                direction={
                                  orderBy === headCell.id ? order : "asc"
                                }
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
                      {recordsAfterPagingAndSorting().map((user, index) => (
                        <TableRow key={index}>
                          <TableCell align="center">{index + 1}</TableCell>
                          <TableCell>
                            <UserActive userID={user._id}></UserActive>
                          </TableCell>
                          <TableCell align="center">{user.name}</TableCell>
                          <TableCell align="center">{user.email}</TableCell>
                          <TableCell align="center">
                            {user.role === 1 ? (
                              <i
                                className="fas fa-check"
                                title="Admin"
                                style={{ color: "green" }}
                              ></i>
                            ) : (
                              <i className="fas fa-times" title="User"></i>
                            )}
                          </TableCell>
                          <TableCell
                            style={{
                              borderRightColor: "white",
                            }}
                            align="center"
                          >
                            <Link to={`/edit_user/${user._id}`}>
                              <Button
                                variant="contained"
                                color="primary"
                                className={classes.button}
                                startIcon={<EditOutlinedIcon style={{}} />}
                              ></Button>
                            </Link>
                          </TableCell>
                          <TableCell style={{}} align="center">
                            <Button
                              variant="contained"
                              color="secondary"
                              className={classes.button}
                              startIcon={<DeleteOutlinedIcon style={{}} />}
                              onClick={() => handleDelete(user._id)}
                            ></Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  <TablePagination
                    rowsPerPageOptions={pages}
                    component="div"
                    count={allUsers.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onChangePage={handleChangePage}
                    onChangeRowsPerPage={handleChangeRowsPerPage}
                  ></TablePagination>
                </div>
              ) : (
                <div style={{ overflowX: "auto" }}>
                  <Toolbar>
                    <Input
                      onChange={handleSearchFav}
                      label="Search Product"
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
                          Favorite Table
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        {favheadCells.map((favheadCell) => (
                          <TableCell
                            align="center"
                            key={favheadCell.id}
                            sortDirection={
                              orderBy === favheadCell.id ? order : false
                            }
                            style={{ color: "#eee" }}
                          >
                            {favheadCell.disableSorting ? (
                              favheadCell.label
                            ) : (
                              <TableSortLabel
                                active={orderBy === favheadCell.id}
                                direction={
                                  orderBy === favheadCell.id ? order : "asc"
                                }
                                onClick={() => {
                                  handleSortLabel(favheadCell.id);
                                }}
                              >
                                {favheadCell.label}
                              </TableSortLabel>
                            )}
                          </TableCell>
                        ))}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {recordsAfterPagingAndSortingFav().map(
                        (product, index) => (
                          <TableRow key={index}>
                            <TableCell align="center">{index + 1}</TableCell>
                            <TableCell align="center">
                              {product.title}
                            </TableCell>
                            <TableCell align="center">
                              {product.price}$
                            </TableCell>
                            <TableCell align="center">
                              {product.description}
                            </TableCell>
                            <TableCell style={{}} align="center">
                              <Button
                                variant="contained"
                                color="secondary"
                                className={classes.button}
                                startIcon={<DeleteOutlinedIcon style={{}} />}
                                onClick={() =>
                                  handleDeleteFavoriteProduct(product._id)
                                }
                              ></Button>
                            </TableCell>
                          </TableRow>
                        )
                      )}
                    </TableBody>
                  </Table>
                  <TablePagination
                    rowsPerPageOptions={pages}
                    component="div"
                    count={favoriteProducts.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onChangePage={handleChangePage}
                    onChangeRowsPerPage={handleChangeRowsPerPage}
                  ></TablePagination>
                </div>
                //           <td>
                //             <img src={product.image.url} alt="Product Image"></img>
                //           </td>
              )}
            </Grid>
          </Grid>
        </Paper>
      </div>
    </>
  );
};

export default UserProfile;
