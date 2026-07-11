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

export interface Product {
  id: string;
  name: string;
  sku: string;
  description?: string;
  category?: string;
  type: string;
  capacityUsage: number;
  imageUri?: string;
  soldQty: number;
  unitPrice: number;
  createdAt: string;
  updatedAt: string;
}

export interface Material {
  id: string;
  name: string;
  sku: string;
  description?: string;
  category?: string;
  unit?: string;
  unitPrice: number;
  createdAt: string;
  updatedAt: string;
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
  productId: string;
  quantityOnHand: number;
  reservedQuantity: number;
  reorderLevel: number;
  createdAt: string;
  updatedAt: string;
}

export interface PurchaseOrder {
  id: string;
  supplierId: string;
  warehouseId: string;
  supplier?: Supplier;
  orderDate: string;
  status: string;
  totalAmount: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SalesOrder {
  id: string;
  customerId: string;
  warehouseId: string;
  customer?: Customer;
  warehouse?: Warehouse;
  orderDate: string;
  status: string;
  totalAmount: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Shipment {
  id: string;
  poId: string;
  salesOrderId?: string;
  purchaseOrder?: PurchaseOrder;
  salesOrder?: SalesOrder;
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
  outputProductId: string;
  outputProduct?: Product;
  createdAt: string;
  updatedAt: string;
}

export interface UserProfile {
  id: string;
  username: string;
  email: string;
  role: string;
}
