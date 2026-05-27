import { StockMovement } from '../entities/StockMovement.js'

export interface StockMovementRepository {
  findByProductId(productId: string): Promise<StockMovement[]>
  findRecent(limit: number): Promise<StockMovement[]>
  save(movement: StockMovement): Promise<void>
}
