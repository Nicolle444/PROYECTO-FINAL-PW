import { Product } from '../entities/Product.js'
import { StockObserver } from '../ports/observers/StockObserver.js'

export class DashboardUpdater implements StockObserver {
  private _lastUpdated: Date = new Date()
  private _changedProducts: Set<string> = new Set()

  onStockChanged(product: Product): void {
    this._changedProducts.add(product.id)
    this._lastUpdated = new Date()
    console.log(`[DASHBOARD] Stock updated for: ${product.name} | New stock: ${product.stock}`)
  }

  getLastUpdated(): Date { return this._lastUpdated }
  getChangedProducts(): string[] { return Array.from(this._changedProducts) }
  clearChanges(): void { this._changedProducts.clear() }
}
