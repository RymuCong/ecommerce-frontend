import { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Card,
  Grid,
  Chip,
  Button,
  TablePagination,
} from "@material-ui/core";
import {} from "@material-ui/icons";
import { useStyles } from "./style";
import { useDispatch, useSelector } from "react-redux";
import { fetchOrders } from "../../../redux/slices/order";
import { fetchAdminOrders } from "../../../redux/slices/admin";
import moment from "moment";
import { useHistory } from "react-router-dom";
import { Loader } from "../../../components/Loader/";

export const Orders = ({ admin }) => {
  const classes = useStyles();
  const history = useHistory();
  const dispatch = useDispatch();
  const orders = useSelector((state) =>
      admin ? state.admin.orders : state.orders.orders
  );
  const total = useSelector((state) =>
      admin ? state.admin.total : state.orders.total
  );
  const contentLoading = useSelector((state) =>
      admin ? state.admin.contentLoading : state.orders.contentLoading
  );
  const adminExist = localStorage.getItem("adminToken");
  const userExist = localStorage.getItem("userToken");

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(12);

  useEffect(() => {
    if (admin && !adminExist) {
      history.replace("/admin/login");
    }
    if (!admin && !userExist) {
      history.replace("/");
    }
  }, [userExist, adminExist]);

  useEffect(() => {
    dispatch(admin ? fetchAdminOrders({ pageNumber: page, pageSize: rowsPerPage }) : fetchOrders({ pageNumber: page, pageSize: rowsPerPage }));
  }, [page, rowsPerPage]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  console.log(orders);

  return (
      <Container maxWidth="lg">
        {contentLoading ? (
            <Loader />
        ) : (
            <>
              <Typography className={classes.heading} variant="h3">
                Orders
              </Typography>

              {orders.length ? null : <Typography>No orders.</Typography>}

              <Grid container spacing={4}>
                {orders.map((order) => {
                  const orderItems = order?.orderItems?.reduce(
                      (total, item) => item.quantity + total,
                      0
                  );

                  return (
                      <Grid key={order.orderId} item md={4} sm={6} xs={12}>
                        <Card className={classes.card}>
                          <Typography>
                            <span>ID</span> <Chip label={order.orderId} size="small" />
                          </Typography>
                          <Typography>
                            <span>Products</span> {order.orderItems.length}
                          </Typography>
                          <Typography>
                            <span>Items</span> {orderItems}
                          </Typography>
                          <Typography>
                            <span>Date</span> {moment(order.orderDate).fromNow()}
                          </Typography>
                          <Typography>
                            <span>Price</span> ${order.totalAmount}
                          </Typography>
                          <Typography>
                            <span>Status</span>{" "}
                            <Chip
                                style={{ color: "white" }}
                                label={order.orderStatus}
                                size="small"
                                color="primary"
                            />
                          </Typography>
                          <Button
                              variant="outlined"
                              color="primary"
                              size="small"
                              onClick={() =>
                                  admin
                                      ? history.push(`/admin/order/${order.orderId}`)
                                      : history.push(`/order/${order.orderId}`)
                              }
                          >
                            Details
                          </Button>
                        </Card>
                      </Grid>
                  );
                })}
              </Grid>
              <TablePagination
                  rowsPerPageOptions={[12, 24, 48]}
                  component="div"
                  count={total}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </>
        )}
      </Container>
  );
};