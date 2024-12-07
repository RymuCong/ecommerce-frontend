import { useEffect } from "react";
import { Container, Typography, Hidden, Box } from "@material-ui/core";
import { Hero } from "../../../components/Hero/";
import { Products } from "../../../components/Products/";
import { useStyles } from "./style";
import { useDispatch, useSelector } from "react-redux";
import {fetchLatestProducts, fetchSearchProducts, setSearchQuery} from "../../../redux/slices/product";
import { Search } from "../../../components/Search/";
import { Loader } from "../../../components/Loader/";

export const Home = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const products = useSelector((state) => state.products.products);
  const loading = useSelector((state) => state.products.loading);
  const searchQuery = useSelector((state) => state.products.searchQuery);

    useEffect(() => {
        if (searchQuery) {
            dispatch(fetchSearchProducts({ searchTerm: searchQuery, pageNumber: 0, pageSize: 12}));
        } else {
            dispatch(fetchLatestProducts());
        }
    }, [searchQuery]);

    const handleSearchSubmit = (searchText) => {
        dispatch(setSearchQuery(searchText));
    };

  return (
    <Container maxWidth="lg">
      <Hero />

      <Typography
        variant="h3"
        style={{ fontWeight: "bold", marginBottom: "30px" }}
        id="products"
      >
        Our Products
      </Typography>

      <Hidden mdUp>
        <Search className={classes.input} onSearchSubmit={handleSearchSubmit}/>
      </Hidden>

      {loading ? (
        <Loader />
      ) : (
        <Products products={products} />
      )}
    </Container>
  );
};
