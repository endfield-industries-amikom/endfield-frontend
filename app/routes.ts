import {
  type RouteConfig,
  index,
  layout,
  route,
} from "@react-router/dev/routes";

export default [
  layout("routes/home/home.tsx", [
    index("routes/home/home-content.tsx"),
    route("about", "routes/home/about.tsx"),
    route("products", "routes/home/products/products.tsx"),
    route("products/:id", "routes/home/products/productId.tsx"),
    route("contact", "routes/home/contact.tsx"),
  ]),
  route("dashboard", "routes/dashboard/auth-guard.tsx", [
    index("routes/dashboard/dashboard.tsx"),
    route("login", "routes/dashboard/login.tsx"),
  ]),
] satisfies RouteConfig;
