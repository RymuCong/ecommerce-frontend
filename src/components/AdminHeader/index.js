import { useState } from "react";
import {
  AppBar,
  Typography,
  Toolbar,
  IconButton,
  Hidden,
  Menu,
  MenuItem
} from "@material-ui/core";
import { ExitToAppOutlined, MenuRounded } from "@material-ui/icons";
import { useStyles } from "./style";
import { Link, NavLink } from "react-router-dom";
import { adminLogout } from "../../redux/slices/admin";
import { useDispatch, useSelector } from "react-redux";

export const AdminHeader = (props) => {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState(null);
  const dispatch = useDispatch();
  const isAdminLoggedIn = useSelector((state) => state.admin.admin);

  const closeDropdownHandler = () => setAnchorEl(null);
  const openDropdownHandler = (e) => setAnchorEl(e.currentTarget);

  const dropdown = (
      <Menu
          anchorEl={anchorEl}
          open={!!anchorEl}
          keepMounted
          onClose={closeDropdownHandler}
      >
        <MenuItem component={Link} to="/" onClick={closeDropdownHandler}>
          Home
        </MenuItem>
        <MenuItem component={Link} to="/admin" onClick={closeDropdownHandler}>
          Panel
        </MenuItem>
        <MenuItem
            component={Link}
            to="/admin/products"
            onClick={closeDropdownHandler}
        >
          Products
        </MenuItem>
        <MenuItem
            component={Link}
            to="/admin/categories"
            onClick={closeDropdownHandler}
        >
          Categories
        </MenuItem>
        <MenuItem
            component={Link}
            to="/admin/orders"
            onClick={closeDropdownHandler}
        >
          Orders
        </MenuItem>
      </Menu>
  );

  return (
      <AppBar position="sticky" className={classes.root}>
        <Toolbar>
          <Typography
              className={classes.heading}
              component={Link}
              to="/admin"
              variant="h5"
          >
            Admin Panel
          </Typography>

          <Hidden xsDown>
            <Typography
                component={NavLink}
                activeClassName={classes.activeLink}
                exact
                to="/"
            >
              Home
            </Typography>
            <Typography
                component={NavLink}
                activeClassName={classes.activeLink}
                exact
                to="/admin"
            >
              Panel
            </Typography>
            <Typography
                component={NavLink}
                activeClassName={classes.activeLink}
                to="/admin/products"
            >
              Products
            </Typography>
            <Typography
                component={NavLink}
                activeClassName={classes.activeLink}
                to="/admin/categories"
            >
              Categories
            </Typography>
            <Typography
                component={NavLink}
                activeClassName={classes.activeLink}
                to="/admin/orders"
            >
              Orders
            </Typography>
            {isAdminLoggedIn && (
                <Typography
                    className={classes.navItems}
                    onClick={() => dispatch(adminLogout())}
                >
                  <ExitToAppOutlined /> Logout
                </Typography>
            )}
          </Hidden>

          {dropdown}

          <Hidden smUp>
            <IconButton onClick={openDropdownHandler}>
              <MenuRounded />
            </IconButton>
          </Hidden>
        </Toolbar>
      </AppBar>
  );
};