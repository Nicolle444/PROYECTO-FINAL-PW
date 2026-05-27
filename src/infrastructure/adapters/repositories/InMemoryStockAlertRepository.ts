import { v4 as uuidv4 } from 'uuid'
import { StockAlertEntry, StockAlertRepository } from '../../../domain/ports/StockAlertRepository.js'

export class InMemoryStockAlertRepository implements StockAlertRepository {
  private alerts: StockAlertEntry[] = []

  async findUnresolved(): Promise<StockAlertEntry[]> {
    return this.alerts.filter((a) => !a.resolved)
  }

  async upsertAlert(productId: string, currentStock: number, minStock: number): Promise<void> {
    const existing = this.alerts.find((a) => a.productId === productId && !a.resolved)
    if (existing) {
      existing.currentStock = currentStock
      existing.minStock = minStock
    } else {
      this.alerts.push({ id: uuidv4(), productId, currentStock, minStock, resolved: false, createdAt: new Date() })
    }
  }

  async resolveByProductId(productId: string): Promise<void> {
    this.alerts
      .filter((a) => a.productId === productId && !a.resolved)
      .forEach((a) => { a.resolved = true })
  }
}
