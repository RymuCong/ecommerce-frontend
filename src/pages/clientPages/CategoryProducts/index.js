import { useEffect, useState } from "react";
import { Products } from "../../../components/Products/";
import { useDispatch, useSelector } from "react-redux";
import {fetchCategoryProducts, fetchSearchProducts} from "../../../redux/slices/product";
import { useParams } from "react-router-dom";
import { Container, Typography, Box, TablePagination, Select, MenuItem, FormControl, InputLabel } from "@material-ui/core";
import { useStyles } from "./style";
import { Loader } from "../../../components/Loader/";

export const CategoryProducts = () => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const { id } = useParams();
  const products = useSelector((state) => state.products.products);
  const total = useSelector((state) => state.products.total);
  const loading = useSelector((state) => state.products.loading);
  const pageSize = useSelector((state) => state.products.pagination.pageSize);
  const pageNumber = useSelector((state) => state.products.pagination.pageNumber);
  const searchQuery = useSelector((state) => state.products.searchQuery)

  const [page, setPage] = useState(pageNumber);
  const [rowsPerPage, setRowsPerPage] = useState(pageSize);
  const [sortBy, setSortBy] = useState("productName");
  const [sortDir, setSortDir] = useState("asc");

  const categoryName = products[0]?.category?.categoryName || "";

  useEffect(() => {
    if (searchQuery) {
      dispatch(fetchSearchProducts({ searchTerm: searchQuery, pageNumber: page, pageSize: rowsPerPage, sortBy, sortDir, field: categoryName }));
    } else {
      dispatch(fetchCategoryProducts({ categoryId: id, pageNumber: page, pageSize: rowsPerPage, sortBy, sortDir }));
    }
  }, [id, page, rowsPerPage, sortBy, sortDir, searchQuery, categoryName]);

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
                Products related to '{products[0]?.category?.categoryName}'
              </Typography>
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
              <Products products={products} />
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