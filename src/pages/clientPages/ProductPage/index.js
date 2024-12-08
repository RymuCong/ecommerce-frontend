import { useEffect } from "react";
import { useStyles, BigTooltip } from "./style";
import {
  Container,
  Grid,
  Typography,
  Button,
  Badge,
  Table,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  CircularProgress,
} from "@material-ui/core";
import { useParams, useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchProduct } from "../../../redux/slices/product";
import moment from "moment";
import { addToCart } from "../../../redux/slices/user";
import { Loader } from "../../../components/Loader/";
import {NotificationManager} from "react-notifications";

export const ProductPage = () => {
  const dispatch = useDispatch();
  const product = useSelector((state) => state.products.product);
  const cartLoading = useSelector((state) => state.users.cartLoading);
  const loading = useSelector((state) => state.products.loading);
  const user = useSelector((state) => state.users.user);
  const { id } = useParams();
  const { push } = useHistory();
  const classes = useStyles();

  useEffect(() => {
    dispatch(fetchProduct(id));
  }, [dispatch, id]);

  const handleAddToCart = () => {
    if (!user) {
        NotificationManager.warning("Please login to add to cart", "Warning", 2000);
      push("/login");
    } else {
      dispatch(addToCart(product.productId));
    }
  };

  return (
      <Container maxWidth="lg" className={classes.root}>
        {loading || !product ? (
            <Loader />
        ) : (
            <>
              <Grid container spacing={3}>
                <Grid item md={6} xs={12}>
                  <div className={classes.img}>
                    <img src={product.image} alt={product.productName} />
                  </div>
                </Grid>

                <Grid item md={6} xs={12}>
                  <Typography variant="h3" className={classes.heading}>
                    {product.productName}
                  </Typography>

                  <Typography
                      variant="h5"
                      color="primary"
                      className={classes.price}
                  >
                    ${product.price}
                  </Typography>
                  <Typography>{product.description}</Typography>
                  <Badge
                      badgeContent="Out of stock"
                      color="primary"
                      className={classes.badge}
                      invisible={product.quantity}
                  >
                    <Button
                        variant="outlined"
                        color="primary"
                        disabled={!product.quantity || cartLoading}
                        onClick={handleAddToCart}
                        endIcon={
                          cartLoading ? (
                              <CircularProgress size={20} color="primary" />
                          ) : null
                        }
                    >
                      Add to cart
                    </Button>
                  </Badge>
                </Grid>
              </Grid>

              <TableContainer component={Paper} className={classes.tableContainer}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Product Details</TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    <TableRow>
                      <TableCell component="th">Category</TableCell>
                      <TableCell>{product.category.categoryName}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell component="th">Created</TableCell>
                      <TableCell>{moment(product.createdAt).fromNow()}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell component="th">Quantity in stock</TableCell>
                      <TableCell>{product.quantity}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell component="th">Discount</TableCell>
                      <TableCell>{product.discount || 0}%</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </>
        )}
      </Container>
  );
};