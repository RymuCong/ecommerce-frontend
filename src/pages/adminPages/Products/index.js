import {useEffect, useState, memo} from "react";
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
  TablePagination,
  FormControl,
  InputLabel,
  Select,
  MenuItem, Box,
} from "@material-ui/core";
import { Add } from "@material-ui/icons";
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
  const total = useSelector((state) => state.admin.total);
  const loading = useSelector((state) => state.admin.loading);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortDir, setSortDir] = useState("desc");

  useEffect(() => {
    dispatch(fetchProducts({ pageNumber: page, pageSize: rowsPerPage, sortBy, sortDir }));
  }, [page, rowsPerPage, sortBy, sortDir, dispatch]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSortByChange = (event) => {
    setSortBy(event.target.value);
  };

  const handleSortDirChange = (event) => {
    setSortDir(event.target.value);
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

              <Box marginBottom={5} className={classes.filterRow}>
                <Box marginTop={5} className={classes.sortControls}>
                  <FormControl className={classes.formControl} style={{ marginRight: '20px' }}>
                    <InputLabel>Sort By</InputLabel>
                    <Select value={sortBy} onChange={handleSortByChange}>
                      <MenuItem value="productName">Product Name</MenuItem>
                      <MenuItem value="price">Price</MenuItem>
                      <MenuItem value="createdAt">Date</MenuItem>
                    </Select>
                  </FormControl>
                  <FormControl className={classes.formControl}>
                    <InputLabel>Direction</InputLabel>
                    <Select value={sortDir} onChange={handleSortDirChange}>
                      <MenuItem value="asc">Ascending</MenuItem>
                      <MenuItem value="desc">Descending</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              </Box>

              <TableContainer component={Paper} className={classes.tableContainer}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell></TableCell>
                      <TableCell>Id</TableCell>
                      <TableCell>Image</TableCell>
                      <TableCell>Name</TableCell>
                      <TableCell>Price</TableCell>
                      <TableCell>Quantity</TableCell>
                      <TableCell>Special Price</TableCell>
                      <TableCell>Category</TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {products.map((product) => (
                        <MemoizedRow key={product.productId} product={product} />
                    ))}
                  </TableBody>
                </Table>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={total}
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

const MemoizedRow = memo(Row);