import type { SvgIconComponent } from "@mui/icons-material";
import PeopleIcon from "@mui/icons-material/People";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import PersonIcon from "@mui/icons-material/Person";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import WarehouseIcon from "@mui/icons-material/Warehouse";
import PublicIcon from "@mui/icons-material/Public";
import InventoryIcon from "@mui/icons-material/Inventory";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import ReceiptIcon from "@mui/icons-material/Receipt";
import PrecisionManufacturingIcon from "@mui/icons-material/PrecisionManufacturing";
import CategoryIcon from "@mui/icons-material/Category";

export interface MenuItem {
  id: string;
  label: string;
  path: string;
  icon: SvgIconComponent;
}

const baseEndfieldMenu: MenuItem[] = [
  { id: "customers", label: "Customers", path: "/dashboard/customer", icon: PersonIcon },
  { id: "inventory", label: "Inventory", path: "/dashboard/inventory", icon: InventoryIcon },
  { id: "products", label: "Products", path: "/dashboard/products", icon: Inventory2Icon },
  { id: "materials", label: "Materials", path: "/dashboard/materials", icon: CategoryIcon },
  { id: "regions", label: "Regions", path: "/dashboard/regions", icon: PublicIcon },
  { id: "purchase-orders", label: "Purchase Orders", path: "/dashboard/purchase-orders", icon: ShoppingCartIcon },
  { id: "suppliers", label: "Suppliers", path: "/dashboard/suppliers", icon: LocalShippingIcon },
  { id: "shipments", label: "Shipments", path: "/dashboard/shipments", icon: LocalShippingIcon },
  { id: "warehouses", label: "Warehouses", path: "/dashboard/warehouses", icon: WarehouseIcon },
  { id: "sales-orders", label: "Sales Orders", path: "/dashboard/sales-orders", icon: ReceiptIcon },
  { id: "schematics", label: "Schematics", path: "/dashboard/schematics", icon: PrecisionManufacturingIcon },
];

export const adminMenu: MenuItem[] = [
  { id: "employees", label: "Employees", path: "/dashboard/admin/employees", icon: PeopleIcon },
  ...baseEndfieldMenu,
];

export const employeeMenu: MenuItem[] = baseEndfieldMenu;

export const consumerMenu: MenuItem[] = [
  { id: "products", label: "Products", path: "/dashboard/products", icon: Inventory2Icon },
  { id: "sales-orders", label: "My Orders", path: "/dashboard/sales-orders", icon: ReceiptIcon },
  { id: "shipments", label: "Shipments", path: "/dashboard/shipments", icon: LocalShippingIcon },
];

export function getMenu(role: string): MenuItem[] {
  switch (role) {
    case "Admin": return adminMenu;
    case "Employee": return employeeMenu;
    default: return consumerMenu;
  }
}
