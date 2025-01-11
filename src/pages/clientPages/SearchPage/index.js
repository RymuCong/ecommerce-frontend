import { useStyles } from "./style";
import { useEffect, useState } from "react";
import { Products } from "../../../components/Products/";
import { useDispatch, useSelector } from "react-redux";
import { fetchSearchProducts } from "../../../redux/slices/product";
import { Container, Typography, TablePagination, Select, MenuItem, FormControl, InputLabel, Box } from "@material-ui/core";
import { useLocation } from "react-router-dom";
import { Loader } from "../../../components/Loader/";

export const SearchPage = (props) => {
  const dispatch = useDispatch();
  const products = useSelector((state) => state.products.products);
  const total = useSelector((state) => state.products.total);
  const loading = useSelector((state) => state.products.loading);
  const classes = useStyles();
  const { search } = useLocation();

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(12);
  const [sortBy, setSortBy] = useState("productName");
  const [sortDir, setSortDir] = useState("asc");

  useEffect(() => {
    const params = new URLSearchParams(search);
    const searchTerm = params.get("search");
    dispatch(fetchSearchProducts({ searchTerm, pageNumber: page, pageSize: rowsPerPage, sortBy, sortDir }));
  }, [dispatch, search, page, rowsPerPage, sortBy, sortDir]);

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
                Result for '{new URLSearchParams(search).get("search")}'
              </Typography>
              <Box marginBottom={5} className={classes.filterRow}>
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
        {!loading && !products.length ? (
            <Typography style={{ marginTop: "20px" }}>No product found!</Typography>
        ) : null}
      </Container>
  );
};