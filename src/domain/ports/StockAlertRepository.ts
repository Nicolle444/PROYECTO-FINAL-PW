export interface StockAlertEntry {
  id: string
  productId: string
  currentStock: number
  minStock: number
  resolved: boolean
  createdAt: Date
}

export interface StockAlertRepository {
  findUnresolved(): Promise<StockAlertEntry[]>
  upsertAlert(productId: string, currentStock: number, minStock: number): Promise<void>
  resolveByProductId(productId: string): Promise<void>
}
