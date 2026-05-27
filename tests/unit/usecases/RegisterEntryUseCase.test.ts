import { RegisterEntryUseCase } from '../../../src/application/usecases/stock/RegisterEntryUseCase'
import { InMemoryProductRepository } from '../../../src/infrastructure/adapters/repositories/InMemoryProductRepository'
import { InMemoryStockMovementRepository } from '../../../src/infrastructure/adapters/repositories/InMemoryStockMovementRepository'
import { LowStockNotifier } from '../../../src/domain/observers/LowStockNotifier'
import { DashboardUpdater } from '../../../src/domain/observers/DashboardUpdater'
import { Product } from '../../../src/domain/entities/Product'

describe('RegisterEntryUseCase', () => {
  let productRepo: InMemoryProductRepository
  let movementRepo: InMemoryStockMovementRepository
  let useCase: RegisterEntryUseCase

  beforeEach(async () => {
    productRepo = new InMemoryProductRepository()
    movementRepo = new InMemoryStockMovementRepository()
    const product = new Product({ id: 'prod-1', sku: 'SKU-001', name: 'Test', description: '', supplierId: 'sup-1', warehouseLocation: 'A1', stock: 50, minimumStock: 10, acquisitionCost: 100, createdAt: new Date(), updatedAt: new Date() })
    await productRepo.save(product)
    useCase = new RegisterEntryUseCase(productRepo, movementRepo, new LowStockNotifier(), new DashboardUpdater())
  })

  it('should register stock entry and increase product stock', async () => {
    const movement = await useCase.execute({ productId: 'prod-1', quantity: 30, justification: 'Restock', userId: 'user-1' })
    expect(movement.type).toBe('ENTRY')
    expect(movement.quantity).toBe(30)
    expect(movement.previousStock).toBe(50)
    expect(movement.newStock).toBe(80)
    const product = await productRepo.findById('prod-1')
    expect(product?.stock).toBe(80)
  })

  it('should throw if product not found', async () => {
    await expect(useCase.execute({ productId: 'non-existent', quantity: 10, justification: 'Test', userId: 'user-1' })).rejects.toThrow('Product not found')
  })

  it('should throw if quantity is not positive', async () => {
    await expect(useCase.execute({ productId: 'prod-1', quantity: 0, justification: 'Test', userId: 'user-1' })).rejects.toThrow('Quantity must be positive')
  })
})
