import { v4 as uuidv4 } from 'uuid'
import { StockMovement } from '../../../domain/entities/StockMovement.js'
import { LowStockNotifier } from '../../../domain/observers/LowStockNotifier.js'
import { DashboardUpdater } from '../../../domain/observers/DashboardUpdater.js'
import { ProductRepository } from '../../../domain/ports/ProductRepository.js'
import { StockMovementRepository } from '../../../domain/ports/StockMovementRepository.js'

export interface RegisterExitInput {
  productId: string
  quantity: number
  justification: string
  userId: string
}

export class RegisterExitUseCase {
  constructor(
    private readonly productRepository: ProductRepository,
    private readonly movementRepository: StockMovementRepository,
    private readonly lowStockNotifier: LowStockNotifier,
    private readonly dashboardUpdater: DashboardUpdater
  ) {}

  readonly execute = async (input: RegisterExitInput): Promise<StockMovement> => {
    if (input.quantity <= 0) throw new Error('Quantity must be positive')
    const product = await this.productRepository.findById(input.productId)
    if (!product) throw new Error('Product not found')
    product.addObserver(this.lowStockNotifier)
    product.addObserver(this.dashboardUpdater)
    const previousStock = product.stock
    product.decreaseStock(input.quantity)
    await this.productRepository.save(product)
    const movement = new StockMovement({ id: uuidv4(), productId: input.productId, type: 'EXIT', quantity: input.quantity, previousStock, newStock: product.stock, justification: input.justification || 'Stock exit', userId: input.userId, createdAt: new Date() })
    await this.movementRepository.save(movement)
    return movement
  }
}
