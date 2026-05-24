import {
  type RouteConfig,
  index,
  layout,
  route,
} from "@react-router/dev/routes";

export default [
  layout("routes/home.tsx", [
    index("routes/home-content.tsx"),
    route("about", "routes/about.tsx"),
    route("products", "routes/products/products.tsx"),
    route("products/:id", "routes/products/product:id.tsx"),
    route("contact", "routes/contact.tsx"),
  ]),
] satisfies RouteConfig;
