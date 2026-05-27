import { Product } from '../../entities/Product.js'

export interface StockObserver {
  onStockChanged(product: Product): void
}
