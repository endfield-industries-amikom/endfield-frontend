// Paginated response wrapper
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages?: number;
}

// API response wrapper (matches backend ResponsesService)
export interface ApiResponse<T> {
  statusCode: number;
  message: string;
  data: T;
}

export interface Item {
  id: string;
  name: string;
  sku: string;
  description?: string;
  category?: string;
  unitPrice: number;
  isSellable: boolean;
  isPurchaseable: boolean;
  isManufactureable: boolean;
  imageUri?: string;
  soldQty: number;
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  id: string;
  itemId: string;
  type: string;
  capacityUsage: number;
  item: Item;
}

export interface Material {
  id: string;
  itemId: string;
  unit?: string;
  item: Item;
}

export interface Customer {
  id: string;
  name: string;
  code: string;
  email?: string;
  phone?: string;
  address?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Supplier {
  id: string;
  name: string;
  code: string;
  contactPerson?: string;
  email?: string;
  phone?: string;
  address?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Warehouse {
  id: string;
  name: string;
  code: string;
  address?: string;
  maxCapacity?: number;
  currentCapacity?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Region {
  id: string;
  name: string;
  code: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Inventory {
  id: string;
  warehouseId: string;
  itemId: string;
  item?: Item;
  warehouse?: { id: string; name: string; code: string };
  quantityOnHand: number;
  reservedQuantity: number;
  reorderLevel: number;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  id: string;
  orderType: string;
  orderId: string;
  itemId: string;
  item?: Item;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
}

export interface OrderBase {
  id: string;
  warehouseId: string;
  warehouse?: { id: string; name: string; code: string };
  orderDate: string;
  status: string;
  totalAmount: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PurchaseOrder {
  orderId: string;
  supplierId: string;
  supplier?: Supplier;
  order: OrderBase;
}

export interface SalesOrder {
  orderId: string;
  customerId: string;
  customer?: Customer;
  order: OrderBase;
}

export interface Shipment {
  id: string;
  orderType: string;
  orderId: string;
  carrier?: string;
  trackingNumber?: string;
  shippedDate?: string;
  deliveryDate?: string;
  status: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProductionSchematic {
  id: string;
  name: string;
  type: string;
  inputs: string[];
  inputQty: number[];
  duration: number;
  outputQty: number;
  outputItemId: string;
  outputItem?: Item;
  createdAt: string;
  updatedAt: string;
}

export interface UserProfile {
  id: string;
  username: string;
  email: string;
  role: string;
}
