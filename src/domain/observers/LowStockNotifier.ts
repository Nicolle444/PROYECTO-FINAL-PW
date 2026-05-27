import { Product } from '../entities/Product.js'
import { StockObserver } from '../ports/observers/StockObserver.js'
import { StockAlertRepository } from '../ports/StockAlertRepository.js'

export class LowStockNotifier implements StockObserver {
  private readonly _alerts: Map<string, { productId: string; productName: string; currentStock: number; minimumStock: number; triggeredAt: Date }> = new Map()

  constructor(private readonly alertRepository?: StockAlertRepository) {}

  onStockChanged(product: Product): void {
    if (product.isBelowMinimumStock()) {
      this._alerts.set(product.id, {
        productId: product.id,
        productName: product.name,
        currentStock: product.stock,
        minimumStock: product.minimumStock,
        triggeredAt: new Date()
      })
      console.log(`[ALERT] Low stock: ${product.name} | Stock: ${product.stock} | Min: ${product.minimumStock}`)
      this.alertRepository?.upsertAlert(product.id, product.stock, product.minimumStock)
        .catch((err: unknown) => console.error('[LowStockNotifier] Failed to persist alert:', err))
    } else {
      this._alerts.delete(product.id)
      this.alertRepository?.resolveByProductId(product.id)
        .catch((err: unknown) => console.error('[LowStockNotifier] Failed to resolve alert:', err))
    }
  }

  getAlerts(): Array<{ productId: string; productName: string; currentStock: number; minimumStock: number; triggeredAt: Date }> {
    return Array.from(this._alerts.values())
  }
}
