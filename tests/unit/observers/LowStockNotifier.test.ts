import { LowStockNotifier } from '../../../src/domain/observers/LowStockNotifier'
import { Product } from '../../../src/domain/entities/Product'

const makeProduct = (stock: number, minimumStock: number): Product =>
  new Product({ id: '1', sku: 'SKU-001', name: 'Test', description: '', supplierId: 'sup-1', warehouseLocation: 'A1', stock, minimumStock, acquisitionCost: 10, createdAt: new Date(), updatedAt: new Date() })

describe('LowStockNotifier', () => {
  it('should add alert when stock is below minimum', () => {
    const notifier = new LowStockNotifier()
    const product = makeProduct(5, 10)
    notifier.onStockChanged(product)
    expect(notifier.getAlerts()).toHaveLength(1)
    expect(notifier.getAlerts()[0]?.productId).toBe('1')
  })

  it('should remove alert when stock is restored', () => {
    const notifier = new LowStockNotifier()
    const product = makeProduct(5, 10)
    notifier.onStockChanged(product)
    expect(notifier.getAlerts()).toHaveLength(1)
    const normalProduct = makeProduct(20, 10)
    Object.defineProperty(normalProduct, 'id', { get: () => '1' })
    notifier.onStockChanged(normalProduct)
    expect(notifier.getAlerts()).toHaveLength(0)
  })

  it('should return empty alerts initially', () => {
    const notifier = new LowStockNotifier()
    expect(notifier.getAlerts()).toHaveLength(0)
  })
})
