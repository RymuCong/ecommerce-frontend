import { useState, useRef } from "react";
import {
  Collapse,
  Box,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  IconButton,
  CircularProgress,
} from "@material-ui/core";
import {
  KeyboardArrowDown,
  KeyboardArrowUp,
  EditOutlined,
  DeleteOutlineOutlined,
} from "@material-ui/icons";
import { useStyles } from "./style";
import moment from "moment";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { deleteUser } from "../../../redux/slices/admin";

export const Row = ({ user }) => {
  const { push } = useHistory();
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.admin.authLoading);
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const collapseRef = useRef(null);

  const deleteUserHandler = () => {
    dispatch(deleteUser(user.userId));
  };

  const getFullName = (firstName, lastName) => {
    if (!firstName && !lastName) return "Unknown";
    if (!firstName) return lastName;
    if (!lastName) return firstName;
    return `${firstName} ${lastName}`;
  };

  return (
      <>
        <TableRow key={user.userId} className={classes.row}>
          <TableCell>
            <IconButton size="small" onClick={() => setOpen(!open)}>
              {open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
            </IconButton>
          </TableCell>
          <TableCell>{user.userId}</TableCell>
          <TableCell>{user.email}</TableCell>
          <TableCell>
            {user.roles && user.roles.length > 0 ? (
                user.roles.map((role) => role.roleName).join(", ")
            ) : (
                "No roles for this user"
            )}
          </TableCell>
          <TableCell>{getFullName(user.firstName, user.lastName)}</TableCell>
          <TableCell>
            {loading ? (
                <CircularProgress size={20} color="primary" />
            ) : (
                <>
                  {/*<IconButton*/}
                  {/*    onClick={() => push(`/admin/edit-user/${user.userId}`)}*/}
                  {/*    color="primary"*/}
                  {/*    size="small"*/}
                  {/*    style={{ marginRight: "10px" }}*/}
                  {/*>*/}
                  {/*  <EditOutlined />*/}
                  {/*</IconButton>*/}
                  <IconButton
                      color="secondary"
                      size="small"
                      onClick={deleteUserHandler}
                  >
                    <DeleteOutlineOutlined />
                  </IconButton>
                </>
            )}
          </TableCell>
        </TableRow>

        <TableRow>
          <TableCell colSpan={6} style={{ paddingBottom: 0, paddingTop: 0 }}>
            <Collapse in={open} timeout="auto" unmountOnExit ref={collapseRef}>
              <Box marginTop={2} paddingBottom={2}>
                <Typography variant="h5">More Detail</Typography>
                <Table size="small" style={{ marginTop: "10px" }} component={Paper}>
                  <TableHead>
                    <TableRow>
                      <TableCell>First name</TableCell>
                      <TableCell>Last name</TableCell>
                      <TableCell>Mobile number</TableCell>
                      <TableCell>Address</TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    <TableRow>
                      <TableCell>{user?.firstName}</TableCell>
                      <TableCell>{user?.lastName}</TableCell>
                      <TableCell>{user?.mobileNumber}</TableCell>
                      <TableCell>
                        {user.address && user.address.length > 0 ? (
                            user.address.map((address) => (
                                <div key={address.addressId}>{address.addressDetail}</div>
                            ))
                        ) : (
                            "No addresses available"
                        )}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
      </>
  );
};