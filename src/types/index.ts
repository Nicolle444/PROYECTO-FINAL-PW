export type UserRole = 'ADMIN' | 'GERENTE_COMPRAS' | 'OPERARIO_BODEGA'
export type MovementType = 'ENTRY' | 'EXIT' | 'ADJUSTMENT'

export interface AuthUser {
  id: string
  name: string
  email: string
  role: UserRole
}

export interface LoginResponse {
  token: string
  user: AuthUser
}

export interface Product {
  id: string
  sku: string
  name: string
  description: string
  supplierId: string
  warehouseLocation: string
  stock: number
  minimumStock: number
  acquisitionCost: number
  createdAt: string
  updatedAt: string
}

export interface Supplier {
  id: string
  name: string
  contactName: string
  email: string
  phone: string
  address: string
  createdAt: string
  updatedAt: string
}

export interface StockMovement {
  id: string
  productId: string
  type: MovementType
  quantity: number
  previousStock: number
  newStock: number
  justification: string
  userId: string
  createdAt: string
}

export interface LowStockProduct {
  id: string
  sku: string
  name: string
  stock: number
  minimumStock: number
}

export interface RecentMovement {
  id: string
  productId: string
  type: string
  quantity: number
  createdAt: string
  userName: string
}

export interface DashboardData {
  totalInventoryValue: number
  totalProducts: number
  lowStockProducts: LowStockProduct[]
  recentMovements: RecentMovement[]
}

export interface ValuationBySupplier {
  supplierId: string
  supplierName: string
  quantity: number
  value: number
}

export interface ValuationReport {
  bySupplier: ValuationBySupplier[]
  total: { quantity: number; value: number }
}

export interface UserData {
  id: string
  name: string
  email: string
  role: UserRole
  createdAt: string
}
