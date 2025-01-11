// Admin routes
export const ADMIN_LOGIN = "/auth/admin/login";
export const IS_ADMIN_LOGIN = "/admin/is-login";
export const ADMIN_PRODUCTS = "/public/product";
export const ADMIN_PRODUCT = (id) => `/public/product/${id}`;
export const ADMIN_ORDERS = "/admin/orders";
export const ADMIN_ORDER = (id) => `/admin/orders/${id}`;

// User routes
export const USER_SIGNUP = "/auth/register";
export const USER_LOGIN = "/auth/login";
export const IS_USER_LOGIN = "/user/is-login";
export const UPDATE_USER = "/user";
export const GET_USER = "/user";
export const EXPORT_USER = "/admin/users/exportExcelData";
export const IMPORT_USER = "/admin/users/importExcelData";

// Product routes
export const CREATE_PRODUCT = "/admin/product/add";
export const LATEST_PRODUCTS = "/public/latest-products";
export const UPDATE_PRODUCT = (id) => `/admin/product/${id}`;
export const DELETE_PRODUCT = (id) => `/admin/product/${id}`;
export const GET_PRODUCT = (id) => `/public/product/${id}`;
export const GET_PRODUCTS = "/public/product";
export const GET_CATEGORY_PRODUCTS = (id) => `/public/product/category/${id}`;
export const CREATE_REVIEW = (id) => `/product/${id}/review`;
export const SEARCH_PRODUCTS = "/public/product/search";

// Category routes
export const CREATE_CATEGORY = "/admin/category";
export const UPDATE_CATEGORY = (id) => `/admin/category/${id}`;
export const DELETE_CATEGORY = (id) => `/admin/category/${id}`;
export const GET_CATEGORY = (id) => `/public/category/${id}`;
export const GET_CATEGORIES = "/public/category";

// Cart routes
export const ADD_TO_CART = (id) => `/user/cart/${id}`;
export const UPDATE_CART_PRODUCT = (id, quantity) => `/user/cart/product/${id}/quantity/${quantity}`;
export const DELETE_FROM_CART = (id) => `/user/cart/product/${id}`;
export const GET_CART = "/user/cart";

// Order routes
export const CREATE_ORDER_STRIPE = "/order";
export const CREATE_ORDER = "/user/cart/order";
export const UPDATE_ORDER = (id) => `/admin/orders/${id}`;
export const DELETE_ORDER = (id) => `/order/${id}`;
export const GET_ORDER = (id) => `/user/orders/${id}`;
export const GET_ORDERS = "/user/orders";

// Payment routes
export const CREATE_PAYMENT_INTENT = "/create-payment-intent";

// Tag routes
export const CREATE_TAG = "/admin/tag";
export const GET_TAGS = "/public/tag";
export const GET_TAG = (id) => `/public/tag/${id}`;
export const DELETE_TAG = (id) => `/admin/tag/${id}`;
export const UPDATE_TAG = (id) => `/admin/tag/${id}`;

// User Management routes
export const GET_USERS = "/admin/users";
// export const GET_USER_BY_ID = (id) => `/admin/users/${id}`;
export const DELETE_USER = (id) => `/admin/users/${id}`;
export const REGISTER_USER = "/admin/users/register";