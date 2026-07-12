import {
  type RouteConfig,
  index,
  layout,
  route,
} from "@react-router/dev/routes";

export default [
  route("api/v1/image/:id", "routes/api/image-proxy.tsx"),
  layout("routes/home/home.tsx", [
    index("routes/home/home-content.tsx"),
    route("about", "routes/home/about.tsx"),
    route("products", "routes/home/products/products.tsx"),
    route("products/:id", "routes/home/products/productId.tsx"),
    route("contact", "routes/home/contact.tsx"),
  ]),
  route("dashboard", "routes/dashboard/auth-guard.tsx", [
    route("login", "routes/dashboard/login.tsx"),
    layout("routes/dashboard/dashboard.tsx", [
      index("routes/dashboard/dashboard-index.tsx"),
      /* detail routes must precede list routes */
      route("products/:id", "routes/dashboard/product-detail.tsx"),
      route("products", "routes/dashboard/products.tsx"),
      route("customers/:id", "routes/dashboard/customer-detail.tsx"),
      route("customers", "routes/dashboard/customers.tsx"),
      route("suppliers/:id", "routes/dashboard/supplier-detail.tsx"),
      route("suppliers", "routes/dashboard/suppliers.tsx"),
      route("warehouses/:id", "routes/dashboard/warehouse-detail.tsx"),
      route("warehouses", "routes/dashboard/warehouses.tsx"),
      route("regions/:id", "routes/dashboard/region-detail.tsx"),
      route("regions", "routes/dashboard/regions.tsx"),
      route("inventory/:id", "routes/dashboard/inventory-detail.tsx"),
      route("inventory", "routes/dashboard/inventory.tsx"),
      route("purchase-orders/:id", "routes/dashboard/purchase-order-detail.tsx"),
      route("purchase-orders", "routes/dashboard/purchase-orders.tsx"),
      route("sales-orders/:id", "routes/dashboard/sales-order-detail.tsx"),
      route("sales-orders", "routes/dashboard/sales-orders.tsx"),
      route("shipments/:id", "routes/dashboard/shipment-detail.tsx"),
      route("shipments", "routes/dashboard/shipments.tsx"),
      route("schematics/:id", "routes/dashboard/schematic-detail.tsx"),
      route("schematics", "routes/dashboard/schematics.tsx"),
      route("materials/:id", "routes/dashboard/material-detail.tsx"),
      route("materials", "routes/dashboard/materials.tsx"),
      route("employees", "routes/dashboard/employees.tsx"),
    ]),
  ]),
] satisfies RouteConfig;
