import { StockMovementRepository } from '../../../domain/ports/StockMovementRepository.js'
import { ProductRepository } from '../../../domain/ports/ProductRepository.js'
import { StockMovementProps } from '../../../domain/entities/StockMovement.js'

export class GetKardexUseCase {
  constructor(
    private readonly productRepository: ProductRepository,
    private readonly movementRepository: StockMovementRepository
  ) {}

  readonly execute = async (productId: string): Promise<StockMovementProps[]> => {
    const product = await this.productRepository.findById(productId)
    if (!product) throw new Error('Product not found')
    const movements = await this.movementRepository.findByProductId(productId)
    return movements.map((m) => m.toJSON())
  }
}
