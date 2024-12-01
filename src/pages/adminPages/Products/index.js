import { useEffect, useState } from "react";
import {
  Button,
  Container,
  Typography,
  Table,
  TableContainer,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  IconButton, TablePagination,
} from "@material-ui/core";
import {
  EditOutlined,
  DeleteOutlineOutlined,
  Add,
  KeyboardArrowDown,
} from "@material-ui/icons";
import { useStyles } from "./style";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../../../redux/slices/admin";
import { Row } from "./Row";
import { useHistory } from "react-router-dom";
import { withAdminAuth } from "../../../hoc/withAdminAuth";
import { Loader } from "../../../components/Loader/";

export const Products = withAdminAuth(true)((props) => {
  const { push } = useHistory();
  const classes = useStyles();
  const dispatch = useDispatch();
  const products = useSelector((state) => state.admin.products);
  const loading = useSelector((state) => state.admin.contentLoading);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    dispatch(fetchProducts());
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Container maxWidth="lg">
      {loading ? (
        <Loader />
      ) : (
        <>
          <Typography variant="h3" className={classes.heading}>
            Products
          </Typography>
          <Button
            variant="outlined"
            color="primary"
            style={{ marginLeft: "auto", display: "flex" }}
            size="large"
            startIcon={<Add />}
            onClick={() => push("/admin/create-product")}
          >
            Create
          </Button>

          <TableContainer component={Paper} className={classes.tableContainer}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell></TableCell>
                  <TableCell>Image</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Price</TableCell>
                  <TableCell>Quantity</TableCell>
                  <TableCell>Sold</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {products
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((product) => (
                        <Row key={product.productId} product={product} />
                    ))}
              </TableBody>
            </Table>
            <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={products.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </TableContainer>
        </>
      )}
    </Container>
  );
});
