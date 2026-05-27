import { RegisterExitUseCase } from '../../../src/application/usecases/stock/RegisterExitUseCase'
import { InMemoryProductRepository } from '../../../src/infrastructure/adapters/repositories/InMemoryProductRepository'
import { InMemoryStockMovementRepository } from '../../../src/infrastructure/adapters/repositories/InMemoryStockMovementRepository'
import { LowStockNotifier } from '../../../src/domain/observers/LowStockNotifier'
import { DashboardUpdater } from '../../../src/domain/observers/DashboardUpdater'
import { Product } from '../../../src/domain/entities/Product'

describe('RegisterExitUseCase', () => {
  let productRepo: InMemoryProductRepository
  let movementRepo: InMemoryStockMovementRepository
  let useCase: RegisterExitUseCase

  beforeEach(async () => {
    productRepo = new InMemoryProductRepository()
    movementRepo = new InMemoryStockMovementRepository()
    const product = new Product({ id: 'prod-1', sku: 'SKU-001', name: 'Test', description: '', supplierId: 'sup-1', warehouseLocation: 'A1', stock: 50, minimumStock: 10, acquisitionCost: 100, createdAt: new Date(), updatedAt: new Date() })
    await productRepo.save(product)
    useCase = new RegisterExitUseCase(productRepo, movementRepo, new LowStockNotifier(), new DashboardUpdater())
  })

  it('should register stock exit and decrease product stock', async () => {
    const movement = await useCase.execute({ productId: 'prod-1', quantity: 20, justification: 'Sale', userId: 'user-1' })
    expect(movement.type).toBe('EXIT')
    expect(movement.newStock).toBe(30)
    const product = await productRepo.findById('prod-1')
    expect(product?.stock).toBe(30)
  })

  it('should throw if exit would make stock negative', async () => {
    await expect(useCase.execute({ productId: 'prod-1', quantity: 100, justification: 'Sale', userId: 'user-1' })).rejects.toThrow('Stock cannot be negative')
  })
})
