import {
  createSlice,
  createAsyncThunk,
  createEntityAdapter,
} from "@reduxjs/toolkit";
import { AdminAxios, Axios } from "../../api/instances";
import * as Api from "../../api/endpoints";
import { NotificationManager } from "react-notifications";
import { history } from "../../utils";

const login = createAsyncThunk("admin/login", async ({ email, password }) => {
    const userToken = localStorage.getItem("userToken");
    if (userToken) {
        throw new Error("Please logout from the user account first.");
    }
    try {
    const res = await Axios.post(Api.ADMIN_LOGIN, {
      email,
      password,
    });
    history.push("/admin");
    NotificationManager.success("Logged in!");
    return res.data;
  } catch (error) {
    throw error?.response?.data || error.message;
  }
});

const isLogin = createAsyncThunk("admin/isLogin", async () => {
  const token = localStorage.getItem("adminToken");
  if (!token) throw "ERROR!";

  const res = await AdminAxios.get(Api.IS_ADMIN_LOGIN, {
    headers: {
      Authorization: token,
    },
  });
  return res.data;
});

const fetchProducts = createAsyncThunk("admin/fetchProducts", async ({ pageNumber, pageSize, sortBy, sortDir }) => {
  const res = await Axios.get(Api.GET_PRODUCTS, {
    params: { pageNumber, pageSize, sortBy, sortDir },
  });
  return { products: res.data.products, total: res.data.totalElements };
});

const createProduct = createAsyncThunk(
    "admin/createProduct",
    async ({ name, description, file, category, price, quantity, discount, tags }) => {
      try {
        const productName = name;
        const formattedTags = tags.map(tagId => ({ tagId }));
        const data = new FormData();
        data.append("categoryId", category);
        console.log({ productName, description, price, quantity, discount, category, tags: formattedTags });
        data.append("product", new Blob([JSON.stringify({ productName, description, price, quantity, discount, tags: formattedTags })], { type: "application/json" }));
        if (file) {
          data.append("image", file);
        }

        const token = localStorage.getItem("adminToken");
        const res = await AdminAxios.post(Api.CREATE_PRODUCT, data, {
          headers: {
            "Content-Type": "multipart/form-data",
            "Authorization": token,
          },
        });
        history.push("/admin/products");
        return res.data;
      } catch (error) {
        throw error?.response?.data || error.message;
      }
    }
);

const editProduct = createAsyncThunk(
    "admin/editProduct",
    async ({ id, name, description, file, category, price, quantity, discount, tags }) => {
      try {
        const productName = name;
        const formattedTags = tags.map(tagId => ({ tagId }));
        const data = new FormData();
        data.append("categoryId", category);
        data.append("product", new Blob([JSON.stringify({ productName, description, price, quantity, discount, tags: formattedTags })], { type: "application/json" }));
        if (file) {
          data.append("image", file);
        }

        const token = localStorage.getItem("adminToken");
        const res = await AdminAxios.patch(Api.UPDATE_PRODUCT(id), data, {
          headers: {
            "Content-Type": "multipart/form-data",
            "Authorization": token,
          },
        });
        history.push("/admin/products");
        // NotificationManager.success("Product updated!");
        return res.data;
      } catch (error) {
        throw error?.response?.data || error.message;
      }
    }
);

const deleteProduct = createAsyncThunk("admin/deleteProduct", async (id) => {
  const token = localStorage.getItem("adminToken");
  const res = await AdminAxios.delete(Api.DELETE_PRODUCT(id),
  {
    headers: {
      "Authorization": token,
    }
  });
  console.log(res.data);
  return res.data.productId;
});

const fetchCategories = createAsyncThunk("admin/fetchCategories", async () => {
  const res = await Axios.get(Api.GET_CATEGORIES);
  return res.data.categories;
});

const createCategory = createAsyncThunk(
  "admin/createCategory",
  async ({ categoryName }) => {
    try {
      const token = localStorage.getItem("adminToken");
      const res = await AdminAxios.post(Api.CREATE_CATEGORY, { categoryName }, {
        headers: {
          "Authorization": token,
        },
      });
      history.push("/admin/categories");
      NotificationManager.success("Category created!");
      return res.data.category;
    } catch (error) {
      throw error?.response?.data || error.message;
    }
  }
);

const editCategory = createAsyncThunk(
  "admin/editCategory",
  async ({ id, categoryName }) => {
    try {
      const res = await AdminAxios.patch(Api.UPDATE_CATEGORY(id), { categoryName }, {
        headers: {
          "Authorization": localStorage.getItem("adminToken"),
        },
      });
      history.push("/admin/categories");
      NotificationManager.success("Category updated!");
      return res.data.category;
    } catch (error) {
      throw error?.response?.data || error.message;
    }
  }
);

const deleteCategory = createAsyncThunk("admin/deleteCategory", async (id) => {
  const res = await AdminAxios.delete(Api.DELETE_CATEGORY(id), {
    headers: {
      "Authorization": localStorage.getItem("adminToken"),
    },
  });
  console.log(res.data.categoryId);
  return res.data.categoryId;
});

const fetchAdminOrders = createAsyncThunk(
  "admin/fetchAdminOrders",
  async () => {
    const res = await AdminAxios.get(Api.ADMIN_ORDERS, {
        headers: {
            "Authorization": localStorage.getItem("adminToken"),
        },
    });
    console.log(res.data);
    return res.data.content;
  }
);

const fetchAdminOrder = createAsyncThunk(
  "admin/fetchAdminOrder",
  async (id) => {
    const res = await AdminAxios.get(Api.ADMIN_ORDER(id), {
        headers: {
            "Authorization": localStorage.getItem("adminToken"),
        },
    });
    console.log(res.data);
    return res.data;
  }
);

const editAdminOrder = createAsyncThunk(
    "admin/editAdminOrder",
    async ({ id, status }) => {
      const data = new FormData();
      data.append("status", status);

      const res = await AdminAxios.patch(Api.UPDATE_ORDER(id), data, {
        headers: {
          "Content-Type": "multipart/form-data",
          "Authorization": localStorage.getItem("adminToken"),
        },
      });

      NotificationManager.success("Order's status updated!");
      return res.data;
    }
);

const fetchTags = createAsyncThunk("admin/fetchTags", async () => {
    const res = await Axios.get(Api.GET_TAGS);
    return res.data.tags;
});

const createTag = createAsyncThunk(
    "admin/createTag",
    async ({ tagName }) => {
        try {
            const token = localStorage.getItem("adminToken");
            const res = await AdminAxios.post(Api.CREATE_TAG, { tagName }, {
            headers: {
                "Authorization": token,
            },
            });
            history.push("/admin/tags");
            NotificationManager.success("Tag created!");
            return res.data;
        } catch (error) {
            throw error?.response?.data || error.message;
        }
    }
  );

const editTag = createAsyncThunk(
    "admin/editTag",
    async ({ id, tagName }) => {
        try {
            const res = await AdminAxios.patch(Api.UPDATE_TAG(id), { tagName }, {
            headers: {
                "Authorization": localStorage.getItem("adminToken"),
            },
            });
            history.push("/admin/tags");
            NotificationManager.success("Tag updated!");
            return res.data;
        } catch (error) {
            throw error?.response?.data || error.message;
        }
    }
);

const deleteTag = createAsyncThunk("admin/deleteTag", async (id) => {
    const res = await AdminAxios.delete(Api.DELETE_TAG(id), {
        headers: {
            "Authorization": localStorage.getItem("adminToken"),
        },
    });
    return res.data;
});

const fetchUsers = createAsyncThunk("admin/fetchUsers", async ({ pageNumber, pageSize, sortBy, sortDir }) => {
    const res = await Axios.get(Api.GET_USERS, {
        params: { pageNumber, pageSize, sortBy, sortDir },
      headers: {
          "Authorization": localStorage.getItem("adminToken"),
      }
    });
    console.log(res.data);
    return { users: res.data.users, total: res.data.totalElements };
});

const deleteUser = createAsyncThunk("admin/deleteUser", async (id) => {
    const res = await AdminAxios.delete(Api.DELETE_USER(id), {
        headers: {
            "Authorization": localStorage.getItem("adminToken"),
        },
    });
    return res.data;
});

const createUser = createAsyncThunk("admin/createUser", async ({ firstName, lastName, email, password, roles }) => {
    const data = {
        firstName,
        lastName,
        email,
        password,
        roles
    };

    const res = await AdminAxios.post(Api.REGISTER_USER, data, {
        headers: {
            "Authorization": localStorage.getItem("adminToken"),
        },
    });
    history.push("/admin/users");
    return res.data;
});

const initialState = {
  admin: true,
  authLoading: false,
  loading: false,
  products: [],
  contentLoading: false,
  categories: [],
  orders: [],
  tags: [],
  users: [],
  total : 0,
};

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers : {
    adminLogout: (state) => {
        state.admin = false;
        localStorage.removeItem("adminToken");
        NotificationManager.success("Logged out!");
        history.push("/admin/login");
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state, action) => {
        state.authLoading = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.admin = true;
        localStorage.setItem("adminToken", `Bearer ${action.payload.token}`);
        state.authLoading = false;
      })
      .addCase(login.rejected, (state, action) => {
        state.authLoading = false;
        NotificationManager.error(action.error.message);
      })
      .addCase(isLogin.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(isLogin.fulfilled, (state, action) => {
        state.admin = true;
        state.loading = false;
      })
      .addCase(isLogin.rejected, (state, action) => {
        state.loading = false;
        state.admin = false;
        localStorage.removeItem("adminToken");
      })
      .addCase(fetchProducts.pending, (state, action) => {
        state.contentLoading = true;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.products = action.payload.products;
        state.total = action.payload.total;
        state.contentLoading = false;
      })
      .addCase(createProduct.pending, (state, action) => {
        state.authLoading = true;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.products.push(action.payload);
        state.authLoading = false;
        NotificationManager.success("Product created!");
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.authLoading = false;
        NotificationManager.error(action.error.message);
      })
      .addCase(editProduct.pending, (state, action) => {
        state.authLoading = true;
      })
      .addCase(editProduct.fulfilled, (state, action) => {
        state.authLoading = false;
        NotificationManager.success("Product updated!");
      })
      .addCase(editProduct.rejected, (state, action) => {
        state.authLoading = false;
        NotificationManager.error(action.error.message);
      })
      .addCase(deleteProduct.pending, (state, action) => {
        state.authLoading = true;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.authLoading = false;
        NotificationManager.success("Product deleted!");
        state.products = state.products.filter(
          ({ productId }) => productId !== action.payload
        );
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.authLoading = false;
        NotificationManager.error(action.error.message);
      })
      .addCase(fetchCategories.pending, (state, action) => {
        state.contentLoading = true;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categories = action.payload;
        state.contentLoading = false;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.contentLoading = false;
        NotificationManager.error(action.error.message);
      })
      .addCase(createCategory.pending, (state, action) => {
        state.authLoading = true;
      })
      .addCase(createCategory.fulfilled, (state, action) => {
        state.authLoading = false;
      })
      .addCase(createCategory.rejected, (state, action) => {
        state.authLoading = false;
        NotificationManager.error(action.error.message);
      })
      .addCase(editCategory.pending, (state, action) => {
        state.authLoading = true;
      })
      .addCase(editCategory.fulfilled, (state, action) => {
        state.authLoading = false;
      })
      .addCase(editCategory.rejected, (state, action) => {
        state.authLoading = false;
        NotificationManager.error(action.error.message);
      })
      .addCase(deleteCategory.pending, (state, action) => {
        state.authLoading = true;
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.authLoading = false;
        NotificationManager.success("Category deleted!");
        state.categories = state.categories.filter(
          ({ categoryId }) => categoryId !== action.payload
        );
      })
      .addCase(deleteCategory.rejected, (state, action) => {
        state.authLoading = false;
        NotificationManager.error(action.error.message);
      })
      .addCase(fetchAdminOrders.pending, (state, action) => {
        state.contentLoading = true;
      })
      .addCase(fetchAdminOrders.fulfilled, (state, action) => {
        state.orders = action.payload;
        state.contentLoading = false;
      })
      .addCase(fetchAdminOrder.pending, (state, action) => {
        state.contentLoading = true;
      })
      .addCase(fetchAdminOrder.fulfilled, (state, action) => {
        console.log(action.payload);
        state.order = action.payload;
        state.contentLoading = false;
      })
      .addCase(editAdminOrder.pending, (state, action) => {
        state.authLoading = true;
      })
      .addCase(editAdminOrder.fulfilled, (state, action) => {
        state.order = action.payload;
        state.authLoading = false;
      })
        .addCase(editAdminOrder.rejected, (state, action) => {
            state.authLoading = false;
            NotificationManager.error(action.error.message);
        })
        .addCase(fetchTags.pending, (state, action) => {
            state.contentLoading = true;
        })
        .addCase(fetchTags.fulfilled, (state, action) => {
            state.tags = action.payload;
            state.contentLoading = false;
        })
        .addCase(createTag.pending, (state, action) => {
            state.authLoading = true;
        })
        .addCase(createTag.fulfilled, (state, action) => {
            state.authLoading = false;
        })
        .addCase(createTag.rejected, (state, action) => {
            state.authLoading = false;
            NotificationManager.error(action.error.message);
        })
        .addCase(editTag.pending, (state, action) => {
            state.authLoading = true;
        })
        .addCase(editTag.fulfilled, (state, action) => {
            state.authLoading = false;
        })
        .addCase(editTag.rejected, (state, action) => {
            state.authLoading = false;
            NotificationManager.error(action.error.message);
        })
        .addCase(deleteTag.pending, (state, action) => {
            state.authLoading = true;
        })
        .addCase(deleteTag.fulfilled, (state, action) => {
            state.authLoading = false;
            NotificationManager.success("Tag deleted!");
            state.tags = state.tags.filter(
                ({ tagId }) => tagId !== action.payload.tagId
            );
        })
        .addCase(deleteTag.rejected, (state, action) => {
            state.authLoading = false;
            NotificationManager.error(action.error.message);
        })
        .addCase(fetchUsers.pending, (state, action) => {
            state.contentLoading = true;
        })
        .addCase(fetchUsers.fulfilled, (state, action) => {
            state.users = action.payload.users;
            state.total = action.payload.total;
            console.log(action.payload);
            state.contentLoading = false;
        })
        .addCase(fetchUsers.rejected, (state, action) => {
            state.contentLoading = false;
            NotificationManager.error(action.error.message);
        })
        .addCase(deleteUser.pending, (state, action) => {
            state.authLoading = true;
        })
        .addCase(deleteUser.fulfilled, (state, action) => {
            state.authLoading = false;
            NotificationManager.success("User deleted!");
            state.users = state.users.filter(
                ({ userId }) => userId !== action.payload
            );
        })
        .addCase(deleteUser.rejected, (state, action) => {
            state.authLoading = false;
            NotificationManager.error(action.error.message);
        })
        .addCase(createUser.pending, (state, action) => {
            state.authLoading = true;
        })
        .addCase(createUser.fulfilled, (state, action) => {
            state.authLoading = false;
            NotificationManager.success("User created!");
        })
        .addCase(createUser.rejected, (state, action) => {
            state.authLoading = false;
            NotificationManager.error(action.error.message);
        });
  },
});

export {
  login,
  isLogin,
  fetchProducts,
  createProduct,
  editProduct,
  deleteProduct,
  fetchCategories,
  createCategory,
  editCategory,
  deleteCategory,
  fetchAdminOrders,
  fetchAdminOrder,
  editAdminOrder,
    fetchTags,
    createTag,
    editTag,
    deleteTag,
    fetchUsers,
    deleteUser,
    createUser,
};

export default adminSlice.reducer;

export const { adminLogout } = adminSlice.actions;