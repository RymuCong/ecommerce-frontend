import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { Axios, UserAxios } from "../../api/instances";
import * as Api from "../../api/endpoints";
import { history } from "../../utils";
import { NotificationManager } from "react-notifications";

const initialState = {
  user: {},
  loading: false,
  authLoading: false,
  cartLoading: false,
};

const signup = createAsyncThunk(
  "users/signup",
  async ({ name, email, password }) => {
    try {
      const res = await Axios.post(Api.USER_SIGNUP, {
        name,
        email,
        password,
      });
      history.push("/");
      return res.data;
    } catch (error) {
      throw error?.response?.data || error.message;
    }
  }
);

const login = createAsyncThunk("users/login", async ({ email, password }) => {
  try {
    const res = await Axios.post(Api.USER_LOGIN, {
      email,
      password,
    });
    history.push("/");
    return res.data;
  } catch (error) {
    throw error?.response?.data || error.message;
  }
});

const isLogin = createAsyncThunk("users/isLogin", async () => {
  const token = localStorage.getItem("userToken");
  if (!token) throw "ERROR!";

  const res = await UserAxios.get(Api.IS_USER_LOGIN, {
    headers: {
      Authorization: token,
    },
  });
  return res.data;
});

const editUser = createAsyncThunk(
  "users/editUser",
  async ({ name, email, password }) => {
    try {
      const res = await UserAxios.patch(Api.UPDATE_USER, {
        name,
        email,
        password,
      });
      history.push("/profile");
      return res.data.user;
    } catch (error) {
      throw error?.response?.data || error.message;
    }
  }
);

const addToCart = createAsyncThunk("users/addToCart", async (id) => {
  try {
    const res = await UserAxios.post(Api.ADD_TO_CART(id), {
      Authorization: localStorage.getItem("userToken"),
    });
    return res.data;
  } catch (error) {
    throw error?.response?.data || error.message;
  }
});

const getCart = createAsyncThunk("users/getCart", async () => {
    try {
        const res = await UserAxios.get(Api.GET_CART, {
            Authorization: localStorage.getItem("userToken"),
        });
        return res.data;
    } catch (error) {
        throw error?.response?.data || error.message;
    }
});

const updateProductFromCart = createAsyncThunk(
    "users/updateProductFromCart",
    async ({ id, quantity }) => {
      try {
        const res = await UserAxios.patch(Api.UPDATE_CART_PRODUCT(id, quantity), {
          headers: {
            Authorization: localStorage.getItem("userToken"),
          },
        });
        return res.data;
      } catch (error) {
        throw error?.response?.data || error.message;
      }
    }
);

const deleteFromCart = createAsyncThunk("users/deleteFromCart", async (id) => {
  try {
    const res = await UserAxios.delete(Api.DELETE_FROM_CART(id), {
        headers: {
            Authorization: localStorage.getItem("userToken"),
        },
    });
    return res.data;
  } catch (error) {
    throw error?.response?.data || error.message;
  }
});

const createOrder = createAsyncThunk("users/createOrder", async (data) => {
    try {
        const res = await UserAxios.post(Api.CREATE_ORDER, data ,{
        headers: {
            Authorization: localStorage.getItem("userToken"),
        },
        });
        console.log(res.data);
        NotificationManager.success("Order placed!");
        history.push("/"); // Navigate to the home page
        return res.data;
    } catch (error) {
        throw error?.response?.data || error.message;
    }
});


const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    userLogout(state, action) {
      localStorage.removeItem("userToken");
      state.user = null;
      NotificationManager.success("Logged out!");
    },
    emptyCart(state, action) {
      state.cart = {
        cartItems: [],
        totalPrice: 0,
      };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signup.pending, (state, action) => {
        state.authLoading = true;
      })
      .addCase(signup.fulfilled, (state, action) => {
        state.user = action.payload.user;
        localStorage.setItem("userToken", `Bearer ${action.payload.token}`);
        state.authLoading = false;
        NotificationManager.success("Signed up!");
      })
      .addCase(signup.rejected, (state, action) => {
        state.authLoading = false;
        NotificationManager.error(action.error.message);
      })
      .addCase(login.pending, (state, action) => {
        state.authLoading = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.user = action.payload;
        localStorage.setItem("userToken", `Bearer ${action.payload.token}`);
        state.authLoading = false;
        NotificationManager.success("Logged in!");
      })
      .addCase(login.rejected, (state, action) => {
        state.authLoading = false;
        NotificationManager.error(action.error.message);
      })
      .addCase(isLogin.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(isLogin.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loading = false;
      })
      .addCase(isLogin.rejected, (state, action) => {
        state.loading = false;
        localStorage.removeItem("userToken");
        state.user = null
      })
      .addCase(editUser.pending, (state, action) => {
        state.authLoading = true;
      })
      .addCase(editUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.authLoading = false;
        NotificationManager.success("Profile updated!");
      })
      .addCase(editUser.rejected, (state, action) => {
        state.authLoading = false;
        NotificationManager.error(action.error.message);
      })
      .addCase(addToCart.pending, (state, action) => {
        state.cartLoading = true;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.user = action.payload;
        state.cartLoading = false;
        NotificationManager.success("Added to cart");
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.cartLoading = false;
        if (action.error.message === "Unauthenticated") {
          NotificationManager.error("Login to continue!");
        } else {
          NotificationManager.error(action.error.message);
        }
      })
        .addCase(getCart.pending, (state, action) => {
            state.cartLoading = true;
        })
        .addCase(getCart.fulfilled, (state, action) => {
            state.cart = action.payload;
            state.cartLoading = false;
        })
      .addCase(updateProductFromCart.pending, (state, action) => {
        state.cartLoading = true;
      })
      .addCase(updateProductFromCart.fulfilled, (state, action) => {
        state.cart = action.payload;
        state.cartLoading = false;
      })
      .addCase(updateProductFromCart.rejected, (state, action) => {
        state.cartLoading = false;
        NotificationManager.error(action.error.message);
      })
      .addCase(deleteFromCart.pending, (state, action) => {
        state.cartLoading = true;
      })
      .addCase(deleteFromCart.fulfilled, (state, action) => {
        state.cart = action.payload;
        state.cartLoading = false;
        NotificationManager.success("Item removed!");
      })
      .addCase(deleteFromCart.rejected, (state, action) => {
        state.cartLoading = false;
        NotificationManager.error(action.error.message);
      })
      .addCase(createOrder.pending, (state, action) => {
        state.loading = true;
      })
        .addCase(createOrder.fulfilled, (state, action) => {
            state.loading = false;
        })
        .addCase(createOrder.rejected, (state, action) => {
            state.loading = false;
            NotificationManager.error(action.error.message);
        });
  },
});

export {
  signup,
  login,
  isLogin,
  editUser,
  addToCart,
    getCart,
  updateProductFromCart,
  deleteFromCart,
    createOrder,
};

export const { userLogout, emptyCart } = usersSlice.actions;

export default usersSlice.reducer;
