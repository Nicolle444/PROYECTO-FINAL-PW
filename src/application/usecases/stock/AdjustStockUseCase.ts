import { v4 as uuidv4 } from 'uuid'
import { StockMovement } from '../../../domain/entities/StockMovement.js'
import { LowStockNotifier } from '../../../domain/observers/LowStockNotifier.js'
import { DashboardUpdater } from '../../../domain/observers/DashboardUpdater.js'
import { ProductRepository } from '../../../domain/ports/ProductRepository.js'
import { StockMovementRepository } from '../../../domain/ports/StockMovementRepository.js'

export interface AdjustStockInput {
  productId: string
  newStock: number
  justification: string
  userId: string
}

export class AdjustStockUseCase {
  constructor(
    private readonly productRepository: ProductRepository,
    private readonly movementRepository: StockMovementRepository,
    private readonly lowStockNotifier: LowStockNotifier,
    private readonly dashboardUpdater: DashboardUpdater
  ) {}

  readonly execute = async (input: AdjustStockInput): Promise<StockMovement> => {
    if (!input.justification || input.justification.trim().length < 10) throw new Error('Justification is required and must be at least 10 characters')
    if (input.newStock < 0) throw new Error('Stock cannot be negative')
    const product = await this.productRepository.findById(input.productId)
    if (!product) throw new Error('Product not found')
    product.addObserver(this.lowStockNotifier)
    product.addObserver(this.dashboardUpdater)
    const previousStock = product.stock
    const diff = Math.abs(input.newStock - previousStock)
    product.adjustStock(input.newStock)
    await this.productRepository.save(product)
    const movement = new StockMovement({ id: uuidv4(), productId: input.productId, type: 'ADJUSTMENT', quantity: diff, previousStock, newStock: product.stock, justification: input.justification.trim(), userId: input.userId, createdAt: new Date() })
    await this.movementRepository.save(movement)
    return movement
  }
}
