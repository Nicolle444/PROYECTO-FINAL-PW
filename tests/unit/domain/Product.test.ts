import { Product, ProductProps } from '../../../src/domain/entities/Product'
import { StockObserver } from '../../../src/domain/ports/observers/StockObserver'

const makeProduct = (overrides: Partial<ProductProps> = {}): Product => {
  return new Product({
    id: '1',
    sku: 'SKU-001',
    name: 'Test Product',
    description: 'Test',
    supplierId: 'sup-1',
    warehouseLocation: 'A1',
    stock: 100,
    minimumStock: 10,
    acquisitionCost: 50,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides
  })
}

describe('Product Entity', () => {
  it('should increase stock correctly', () => {
    const product = makeProduct({ stock: 50 })
    product.increaseStock(20)
    expect(product.stock).toBe(70)
  })

  it('should decrease stock correctly', () => {
    const product = makeProduct({ stock: 50 })
    product.decreaseStock(20)
    expect(product.stock).toBe(30)
  })

  it('should not allow negative stock', () => {
    const product = makeProduct({ stock: 10 })
    expect(() => product.decreaseStock(20)).toThrow('Stock cannot be negative')
  })

  it('should not allow negative quantity on increase', () => {
    const product = makeProduct()
    expect(() => product.increaseStock(-5)).toThrow('Quantity must be positive')
  })

  it('should adjust stock to new value', () => {
    const product = makeProduct({ stock: 50 })
    product.adjustStock(75)
    expect(product.stock).toBe(75)
  })

  it('should not adjust to negative stock', () => {
    const product = makeProduct()
    expect(() => product.adjustStock(-1)).toThrow('Stock cannot be negative')
  })

  it('should detect low stock correctly', () => {
    const product = makeProduct({ stock: 5, minimumStock: 10 })
    expect(product.isBelowMinimumStock()).toBe(true)
  })

  it('should not flag normal stock as low', () => {
    const product = makeProduct({ stock: 50, minimumStock: 10 })
    expect(product.isBelowMinimumStock()).toBe(false)
  })

  it('should notify observers on stock change', () => {
    const product = makeProduct({ stock: 50 })
    const observer: StockObserver = { onStockChanged: jest.fn() }
    product.addObserver(observer)
    product.increaseStock(10)
    expect(observer.onStockChanged).toHaveBeenCalledWith(product)
  })

  it('should notify multiple observers', () => {
    const product = makeProduct({ stock: 50 })
    const obs1: StockObserver = { onStockChanged: jest.fn() }
    const obs2: StockObserver = { onStockChanged: jest.fn() }
    product.addObserver(obs1)
    product.addObserver(obs2)
    product.decreaseStock(10)
    expect(obs1.onStockChanged).toHaveBeenCalled()
    expect(obs2.onStockChanged).toHaveBeenCalled()
  })
})
