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
  IconButton, CircularProgress
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
import { deleteProduct } from "../../../redux/slices/admin";

export const Row = ({ product }) => {
  const { push } = useHistory();
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.admin.authLoading);
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const collapseRef = useRef(null);

  // const handleClose = () => setOpenReviews(false);
  // const handleOpen = () => setOpenReviews(true);

  const deleteProductHandler = () => {
    dispatch(deleteProduct(product.productId));
  };

  return (
    <>
      <TableRow key={product.productId} className={classes.row}>
        <TableCell>
          <IconButton size="small" onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
          </IconButton>
        </TableCell>
        <TableCell>
          <div className={classes.img}>
            <img src={product.image} />
          </div>
        </TableCell>
        <TableCell>{product.productName}</TableCell>
        <TableCell>{product.price}đ</TableCell>
        <TableCell>{product.quantity}</TableCell>
        <TableCell>{product.specialPrice}đ</TableCell>
        <TableCell>{product?.category?.categoryName || "No category"}</TableCell>
        <TableCell>
          {loading ? (
            <CircularProgress size={20} color="primary" />
          ) : (
            <>
              <IconButton
                onClick={() => push(`/admin/edit-product/${product.productId}`)}
                color="primary"
                size="small"
                style={{ marginRight: "10px" }}
              >
                <EditOutlined />
              </IconButton>
              <IconButton
                color="secondary"
                size="small"
                onClick={deleteProductHandler}
              >
                <DeleteOutlineOutlined />
              </IconButton>
            </>
          )}
        </TableCell>
      </TableRow>

        <TableRow>
          <TableCell colSpan={8} style={{ paddingBottom: 0, paddingTop: 0 }}>
            <Collapse in={open} timeout="auto" unmountOnExit ref={collapseRef}>
              <Box marginTop={2} paddingBottom={2}>
                <Typography variant="h5">More Detail</Typography>
                <Table
                    size="small"
                    style={{ marginTop: "10px" }}
                    component={Paper}
                >
                  <TableHead>
                    <TableRow>
                      <TableCell>Description</TableCell>
                      <TableCell>Category</TableCell>
                      <TableCell>Created</TableCell>
                      <TableCell>Updated</TableCell>
                      <TableCell>Discount</TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    <TableCell>{product.description}</TableCell>
                    <TableCell>{product.category.categoryName}</TableCell>
                    <TableCell>{moment(product?.createdAt).fromNow()}</TableCell>
                    <TableCell>
                      {moment(product?.updatedAt).fromNow()}
                    </TableCell>
                    <TableCell>
                      {product.discount ? `${product.discount}%` : "No discount"}
                    </TableCell>
                  </TableBody>
                </Table>
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
      </>
  );
};
