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

export const fetchSearchProducts = createAsyncThunk("products/fetchSearchProducts", async ({ searchTerm, pageNumber, pageSize, sortBy, sortDir, field }) => {
    if (sortBy === "productName")
        sortBy = "name";
    if (field !== null)
        field = field+",name,description";
    else
        field = "name,description";
    const res = await Axios.get(Api.SEARCH_PRODUCTS, {
        params: { searchTerm, pageNumber, pageSize, sortBy, sortDir, fields: field },
    });
    return { products: res.data.products, total: res.data.totalElements, pageSize: res.data.pageSize, totalPages: res.data.totalPages, pageNumber: res.data.pageNumber };
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
        pagination: {
            pageNumber: 0,
            pageSize: 12,
            totalPages: 0,
            isSearch: false,
        },
        searchQuery: "",
        total: 0,
        filter: {},
        loading: false,
    },
    reducers: {
        applyFilter(state, action) {
            state.filter = action.payload;
        },
        setSearchQuery: (state, action) => {
            state.searchQuery = action.payload;
            state.pagination.isSearch = true;
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
                state.products = action.payload.products;
                state.total = action.payload.total;
                state.pagination.pageSize = action.payload.pageSize;
                state.pagination.totalPages = action.payload.totalPages;
                state.pagination.pageNumber = action.payload.page;
                state.loading = false;
                console.log(action.payload);
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
    addReview,
};

export const { applyFilter, setSearchQuery } = productsSlice.actions;
export default productsSlice.reducer;