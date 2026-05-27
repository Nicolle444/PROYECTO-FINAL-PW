import { StockMovement } from '../../../domain/entities/StockMovement.js'
import { StockMovementRepository } from '../../../domain/ports/StockMovementRepository.js'

export class InMemoryStockMovementRepository implements StockMovementRepository {
  private readonly _movements: StockMovement[] = []

  async findByProductId(productId: string): Promise<StockMovement[]> {
    return this._movements.filter((m) => m.productId === productId).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
  }

  async findRecent(limit: number): Promise<StockMovement[]> {
    return [...this._movements].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()).slice(0, limit)
  }

  async save(movement: StockMovement): Promise<void> {
    this._movements.push(movement)
  }
}
