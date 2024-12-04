import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Table,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  IconButton,
  Button,
  CircularProgress,
  TextField,
} from "@material-ui/core";
import {
  DeleteOutlineOutlined,
  AddOutlined,
  RemoveOutlined,
} from "@material-ui/icons";
import { useStyles } from "./style";
import { useSelector, useDispatch } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import {
  updateProductFromCart,
  deleteFromCart,
  getCart, createOrder,
} from "../../../redux/slices/user";
import { withUserAuth } from "../../../hoc/withUserAuth";

export const Cart = withUserAuth(true)((props) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const history = useHistory();
  const loading = useSelector((state) => state.users.cartLoading);
  const cart = useSelector((state) => state.users.cart);
  const [quantities, setQuantities] = useState({});

  useEffect(() => {
    dispatch(getCart());
  }, [dispatch]);

  useEffect(() => {
    if (cart?.cartItems) {
      const initialQuantities = cart.cartItems.reduce((acc, item) => {
        acc[item.product.productId] = item.quantity;
        return acc;
      }, {});
      setQuantities(initialQuantities);
    }
  }, [cart]);

  const handleQuantityChange = (productId, newQuantity) => {
    setQuantities((prevQuantities) => ({
      ...prevQuantities,
      [productId]: newQuantity,
    }));
    dispatch(updateProductFromCart({ id: productId, quantity: newQuantity }));
  };

  const handleProceedToCheckout = () => {
    dispatch(createOrder()).then(() => {
        // history.push("/checkout");
    });
  };

  return (
      <Container maxWidth="lg" className={classes.root}>
        <Typography className={classes.heading} variant="h3">
          Cart
        </Typography>

        {!cart?.totalPrice ? (
            <>
              <Typography>
                You haven't added any product to the cart yet!
              </Typography>
              <Typography component={Link} to="/shop">
                Go and do some shopping!
              </Typography>
            </>
        ) : (
            <>
              <TableContainer component={Paper} className={classes.tableContainer}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Product</TableCell>
                      <TableCell>Price</TableCell>
                      <TableCell>Discount</TableCell>
                      <TableCell>Quantity</TableCell>
                      <TableCell>Total</TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {cart?.cartItems?.map((item) => (
                        <TableRow key={item.product.productId}>
                          <TableCell>
                            <Typography
                                component={Link}
                                to={`/product/${item.product.productId}`}
                            >
                              {item.product.productName}
                            </Typography>
                          </TableCell>
                          <TableCell>{item.product.price}đ</TableCell>
                          <TableCell>{item.product.discount}%</TableCell>
                          <TableCell style={{ minWidth: "150px" }}>
                            {loading ? (
                                <CircularProgress size={35} />
                            ) : (
                                <>
                                  <IconButton
                                      size="small"
                                      onClick={() =>
                                          handleQuantityChange(
                                              item.product.productId,
                                              quantities[item.product.productId] + 1
                                          )
                                      }
                                  >
                                    <AddOutlined />
                                  </IconButton>{" "}
                                  <TextField
                                      type="number"
                                      value={quantities[item.product.productId]}
                                      onChange={(e) =>
                                          handleQuantityChange(
                                              item.product.productId,
                                              Number(e.target.value)
                                          )
                                      }
                                      inputProps={{ min: 1 }}
                                  />{" "}
                                  <IconButton
                                      size="small"
                                      onClick={() =>
                                          handleQuantityChange(
                                              item.product.productId,
                                              quantities[item.product.productId] - 1
                                          )
                                      }
                                      disabled={quantities[item.product.productId] <= 1}
                                  >
                                    <RemoveOutlined />
                                  </IconButton>
                                </>
                            )}
                          </TableCell>
                          <TableCell>{item.quantity * item.specialPrice}đ</TableCell>
                          <TableCell>
                            {loading ? (
                                <CircularProgress size={35} />
                            ) : (
                                <IconButton
                                    onClick={() =>
                                        dispatch(deleteFromCart(item.product.productId))
                                    }
                                >
                                  <DeleteOutlineOutlined />
                                </IconButton>
                            )}
                          </TableCell>
                        </TableRow>
                    ))}
                    <TableRow>
                      <TableCell component="th">
                        Subtotal: {cart?.totalPrice}đ
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>

              <Button
                  className={classes.btn}
                  variant="outlined"
                  color="primary"
                  size="large"
                  // component={Link}
                  // to="/checkout"
                  onClick={handleProceedToCheckout}
              >
                Proceed to checkout
              </Button>
            </>
        )}
      </Container>
  );
});