import React, { useState, useContext, useEffect } from 'react';
import { GlobalState } from '../../GlobalState';

import ShoppingCartIcon from './icon/shopping-cart.png';
import { Link, useLocation } from 'react-router-dom';
import '../headers/Header.css';
import axios from 'axios';
import Button from './Button';
import { Grid } from '@material-ui/core';
import SearchBox from './SearchBox.js';
import { makeStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import { animateScroll as scroll } from 'react-scroll';
import { Paper } from '@material-ui/core';
import Fab from '@material-ui/core/Fab';
import ButtonUI from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import FaceIcon from '@material-ui/icons/Face';
const Header = () => {
  const state = useContext(GlobalState);
  const [isLogged, setIsLogged] = state.userAPI.isLogged;
  const [isAdmin, setIsAdmin] = state.userAPI.isAdmin;

  const [user] = state.userAPI.user;

  const [cart] = state.userAPI.cart;

  const [menu, setMenu] = useState(false);
  const [button, setButton] = useState(true);

  const menuClassname = ['nav-menu-3', 'nav-menu-5'];

  const checkMenuSize = isAdmin ? menuClassname[1] : menuClassname[0];

  const location = useLocation();
  const [avatar, setAvatar] = useState(true);
  const [toggleShakingCart, setToggleShakingCart] =
    state.userAPI.toggleShakingCart;
  // const [token] = state.token;
  const useStyles = makeStyles((theme) => ({
    infoIn: {
      backgroundColor: 'white',
      height: '0px',
      width: '0px',
      position: 'absolute',
      top: '58px',
      transition: 'all 0.5s ease',
      right: '0.5rem',
      overflow: 'hidden',
    },
    infoOut: {
      backgroundColor: 'white',
      position: 'absolute',
      top: '58px',
      transition: 'all 0.5s ease',
      overflow: 'hidden',
      right: '0.5rem',
      padding: theme.spacing(2),
      elevation: '3',
      width: '300px',
    },
    root: {
      maxWidth: 345,
    },
    media: {
      height: 140,
    },
    root: {
      '& > *': {
        margin: theme.spacing(1),
      },
    },
    small: {
      width: theme.spacing(7),
      height: theme.spacing(7),
    },
    large: {
      width: theme.spacing(10),
      height: theme.spacing(10),
    },
  }));

  const classes = useStyles();

  const showButton = () => {
    if (window.innerWidth <= 960) {
      setButton(false);
    } else {
      setButton(true);
    }
  };

  // bỏ rung shopping cart icon sau 1 thoi gian
  setTimeout(function () {
    if (toggleShakingCart) {
      setToggleShakingCart(false);
    }
  }, 1000);

  useEffect(() => {
    showButton();
  }, []);

  window.addEventListener('resize', showButton);

  const logOutUser = async () => {
    await axios.get('/user/logout');
    setIsAdmin(false);
    setIsLogged(false);
  };

  const adminRouter = () => {
    return (
      <>
        <li className="nav-item">
          <Link
            to="/create_product"
            onClick={() => {
              setMenu(false);
              ToggleHome();
            }}
            className="nav-links"
          >
            Create Product
          </Link>
        </li>
        <li className="nav-item">
          <Link
            to="/category"
            onClick={() => {
              setMenu(false);
              ToggleHome();
            }}
            className="nav-links"
          >
            Categories
          </Link>
        </li>
        <li className="nav-item">
          <Link
            to="/discount"
            onClick={() => {
              setMenu(false);
              ToggleHome();
            }}
            className="nav-links"
          >
            Discount
          </Link>
        </li>
      </>
    );
  };

  const ToggleHome = () => {
    scroll.scrollToTop();
  };

  // bắt 2 sự kiện hàm cho onclick
  const onClickEvents = () => {
    setMenu(false);
    logOutUser();
  };

  // console.log(menu);
  const loggedRouter = () => {
    return (
      <>
        <li className="nav-item">
          <Link
            to="/history"
            onClick={() => {
              setMenu(false);
              ToggleHome();
            }}
            className="nav-links"
          >
            History
          </Link>
        </li>
        {!isAdmin && (
          <li className="nav-item">
            <Link
              to="/aboutus"
              onClick={() => {
                setMenu(false);
                ToggleHome();
              }}
              className="nav-links"
            >
              About Us
            </Link>
          </li>
        )}
        <li>
          <Link
            className="nav-items"
            to="/chat"
            onClick={() => {
              setMenu(false);
              ToggleHome();
            }}
            className="nav-links"
          >
            Chat
          </Link>
        </li>
        {!button && (
          <li>
            <Link
              className="nav-items"
              to="/profile"
              onClick={() => {
                setMenu(false);
                ToggleHome();
              }}
              className="nav-links"
            >
              Profile
            </Link>
          </li>
        )}
        <li className="nav-item">
          <Link
            to="/products"
            onClick={onClickEvents}
            className="nav-links-mobile"
          >
            Log out
          </Link>
        </li>
      </>
    );
  };

  const userLink = () => {
    return (
      <Grid
        container
        style={{ width: '30%', position: 'relative' }}
        justify="center"
      >
        <Fab
          style={{ borderRadius: '100px' }}
          color="primary"
          aria-label="add"
          style={{ padding: '0.5rem' }}
          onClick={() => setAvatar(!avatar)}
        >
          <Avatar
            alt="Remy Sharp"
            src={user.avatar}
            className={classes.small}
          />
        </Fab>
        <Paper className={avatar ? classes.infoIn : classes.infoOut}>
          <Grid
            container
            direction="column"
            justify="center"
            alignItems="center"
          >
            <Fab color="primary" aria-label="add" style={{ margin: '1rem' }}>
              <Avatar
                alt="Remy Sharp"
                src={user.avatar}
                className={classes.large}
              />
            </Fab>
            <Typography variant="h5" style={{ fontWeight: '600' }}>
              {user.name}
            </Typography>
            <Typography>{user.email}</Typography>
            <Link
              onClick={() => setAvatar(!avatar)}
              style={{ width: '100%' }}
              to="/profile"
            >
              <ButtonUI
                fullWidth
                style={{
                  marginTop: '1rem',
                  borderLeft: 'none',
                  borderRight: 'none',
                  borderBottom: 'none',
                  borderRadius: '0',
                  fontSize: 'large',
                }}
                startIcon={<FaceIcon></FaceIcon>}
                variant="outlined"
              >
                Profile
              </ButtonUI>
            </Link>
            <Link style={{ width: '100%' }} to="/" onClick={onClickEvents}>
              <ButtonUI
                fullWidth
                style={{
                  border: 'none',
                  borderRadius: '0',
                  fontSize: 'large',
                }}
                startIcon={<ExitToAppIcon></ExitToAppIcon>}
                variant="outlined"
              >
                Log Out
              </ButtonUI>
            </Link>
          </Grid>
        </Paper>
      </Grid>
    );
  };

  return (
    <nav className="navbar">
      <Grid container direction="row" justify="flex-start" alignItems="center">
        <Grid item xs={1}>
          <Link
            to="/"
            className="shop-logo"
            onClick={() => {
              setMenu(!menu);
              ToggleHome();
            }}
          >
            {isAdmin ? 'Admin' : 'MamMam '}
          </Link>
          <div className="menu-icon" onClick={() => setMenu(!menu)}>
            <i className={menu ? 'fas fa-times' : 'fas fa-bars'}></i>
          </div>
        </Grid>
        <Grid item xs={8}>
          <ul
            className={menu ? `${checkMenuSize} active ` : `${checkMenuSize}`}
          >
            <li className="nav-item">
              <Link
                to="/products"
                onClick={() => setMenu(false)}
                className="nav-links"
              >
                {isAdmin ? 'Products' : 'Shopping'}
              </Link>
            </li>

            {isAdmin && adminRouter()}

            {isLogged ? (
              loggedRouter()
            ) : (
              <li className="nav-item">
                <Link
                  to="/login"
                  onClick={() => setMenu(false)}
                  className="nav-links-mobile"
                >
                  Sign Up
                </Link>
              </li>
            )}
          </ul>
        </Grid>
        {button && (
          <Grid item xs={2}>
            <Grid
              container
              direction="row"
              justify="flex-end"
              alignItems="center"
            >
              {isLogged ? (
                userLink()
              ) : (
                <Button
                  buttonStyle="btn--outline"
                  isLogged={isLogged}
                  onClick={isLogged && onClickEvents}
                >
                  SIGN IN
                </Button>
              )}
              {!isAdmin && isLogged && (
                <div
                  className={
                    toggleShakingCart ? 'cart-icon active' : 'cart-icon'
                  }
                >
                  <span>{cart.length}</span>
                  <Link to="/cart">
                    <img
                      src={ShoppingCartIcon}
                      alt="shopping cart icon"
                      width="30px"
                    ></img>
                  </Link>
                </div>
              )}
            </Grid>
          </Grid>
        )}
        {button && (
          <Grid item xs>
            {location.pathname === '/products' && <SearchBox />}
          </Grid>
        )}
      </Grid>
    </nav>
  );
};

export default Header;
