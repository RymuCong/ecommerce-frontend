import { Login } from "../pages/adminPages/Login/";
import { Home } from "../pages/adminPages/Home/";
import { Products } from "../pages/adminPages/Products/";
import { ProductForm } from "../pages/adminPages/ProductForm/";
import { Categories } from "../pages/adminPages/Categories/";
import { CategoryForm } from "../pages/adminPages/CategoryForm/";
import { Orders } from "../pages/pages/Orders/";
import { Order } from "../pages/pages/Order/";
import {Tags} from "../pages/adminPages/Tags";
import {TagForm} from "../pages/adminPages/TagForm";
import {Users} from "../pages/adminPages/Users";
import {UserForm} from "../pages/adminPages/UserForm";

export const adminRoutes = [
  {
    path: "/admin/login",
    key: "/admin/login",
    component: Login,
  },
  {
    path: "/admin",
    key: "/admin",
    component: Home,
    exact: true,
  },
  {
    path: "/admin/products",
    key: "/admin/products",
    component: Products,
  },
  {
    path: "/admin/create-product",
    key: "/admin/create-product",
    component: ProductForm,
  },
  {
    path: "/admin/edit-product/:id",
    key: "/admin/edit-product/:id",
    render: () => <ProductForm edit />,
  },
  {
    path: "/admin/categories",
    key: "/admin/categories",
    component: Categories,
  },
  {
    path: "/admin/create-category",
    key: "/admin/create-category",
    component: CategoryForm,
  },
  {
    path: "/admin/edit-category/:id",
    key: "/admin/edit-category/:id",
    render: () => <CategoryForm edit />,
  },
  {
    path: "/admin/orders",
    key: "/admin/orders",
    render: () => <Orders admin />,
  },
  {
    path: "/admin/order/:id",
    key: "/admin/order/:id",
    render: () => <Order admin />,
  },
  {
    path: "/admin/tags",
    key: "/admin/tags",
    component: Tags,
  },
  {
    path: "/admin/create-tag",
    key: "/admin/create-tag",
    component: TagForm,
  },
  {
    path: "/admin/edit-tag/:id",
    key: "/admin/edit-tag/:id",
    render: () => <TagForm edit />,
  },
  {
    path: "/admin/users",
    key: "/admin/users",
    component: Users,
  },
  {
    path: "/admin/create-user",
    key: "/admin/create-user",
    component: UserForm,
  }
];
