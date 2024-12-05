import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { Axios, UserAxios } from "../../api/instances";
import * as Api from "../../api/endpoints";
import { NotificationManager } from "react-notifications";
import { history } from "../../utils";

const initialState = {
  products: [],
  product: null,
  loading: false,
  buttonLoading: false,
  filter: "All",
};

const fetchAllProducts = createAsyncThunk(
    "products/fetchAllProducts",
    async ({ pageNumber, pageSize, sortBy, sortDir }) => {
        const res = await Axios.get(Api.GET_PRODUCTS, {
            params: { pageNumber, pageSize, sortBy, sortDir },
        });
        return { products: res.data.products, total: res.data.totalElements };
    }
);

const fetchCategoryProducts = createAsyncThunk(
    "products/fetchCategoryProducts",
    async ({ categoryId, pageNumber, pageSize, sortBy, sortDir }) => {
        const res = await Axios.get(Api.GET_CATEGORY_PRODUCTS(categoryId), {
            params: { pageNumber, pageSize, sortBy, sortDir },
        });
        return { products: res.data.products, total: res.data.totalElements };
    }
);

const fetchProduct = createAsyncThunk("products/fetchProduct", async (id) => {
  const res = await Axios.get(Api.GET_PRODUCT(id));
  return res.data;
});

const fetchLatestProducts = createAsyncThunk("products/fetchLatestProducts", async () => {
    const res = await Axios.get(Api.LATEST_PRODUCTS);
    return res.data.products;
});

const fetchSearchProducts = createAsyncThunk("products/fetchSearchProducts", async (searchRequestDTO) => {
    const res = await Axios.post(Api.SEARCH_PRODUCTS, searchRequestDTO);
    return res.data;
});

const addReview = createAsyncThunk(
  "products/addReview",
  async ({ id, order, rating, comment }) => {
    try {
      const res = await UserAxios.post(Api.CREATE_REVIEW(id), {
        order,
        rating,
        comment,
      });
      history.goBack();
      return res.data.product;
    } catch (error) {
      throw error?.response?.data || error.message;
    }
  }
);

const productsSlice = createSlice({
    name: "products",
    initialState: {
        products: [],
        total: 0,
        filter: {},
        loading: false,
    },
  reducers: {
    applyFilter(state, action) {
      state.filter = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllProducts.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(fetchAllProducts.fulfilled, (state, action) => {
        state.products = action.payload.products;
        state.total = action.payload.total;
        state.loading = false;
      })
      .addCase(fetchLatestProducts.pending, (state, action) => {
            state.loading = true;
        })
      .addCase(fetchLatestProducts.fulfilled, (state, action) => {
            state.products = action.payload;
            state.total = action.payload.total;
            state.loading = false;
        })
      .addCase(fetchCategoryProducts.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(fetchCategoryProducts.fulfilled, (state, action) => {
        state.products = action.payload.products;
        state.total = action.payload.total;
        state.loading = false;
      })
      .addCase(fetchProduct.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(fetchProduct.fulfilled, (state, action) => {
        state.product = action.payload;
        state.loading = false;
      })
      .addCase(fetchSearchProducts.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(fetchSearchProducts.fulfilled, (state, action) => {
        console.log(action.payload);
          state.products = action.payload;
        state.loading = false;
      })
      .addCase(addReview.pending, (state, action) => {
        state.buttonLoading = true;
      })
      .addCase(addReview.fulfilled, (state, action) => {
        state.buttonLoading = false;
        NotificationManager.success("Review added!");
      })
      .addCase(addReview.rejected, (state, action) => {
        state.buttonLoading = false;
        NotificationManager.error(action.error.message);
      });
  },
});

export {
  fetchAllProducts,
  fetchLatestProducts,
  fetchCategoryProducts,
  fetchProduct,
  fetchSearchProducts,
  addReview,
};
export const { applyFilter } = productsSlice.actions;
export default productsSlice.reducer;
