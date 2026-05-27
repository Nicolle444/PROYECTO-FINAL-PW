import { PrismaClient } from '@prisma/client'
import { StockMovement, MovementType } from '../../../domain/entities/StockMovement.js'
import { StockMovementRepository } from '../../../domain/ports/StockMovementRepository.js'

type MovementRow = {
  id: string
  productId: string
  type: string
  quantity: number
  previousStock: number
  balanceAfter: number
  reason: string
  userId: string
  createdAt: Date
}

function toEntity(row: MovementRow): StockMovement {
  return new StockMovement({
    id: row.id,
    productId: row.productId,
    type: row.type as MovementType,
    quantity: row.quantity,
    previousStock: row.previousStock,
    newStock: row.balanceAfter,
    justification: row.reason,
    userId: row.userId,
    createdAt: row.createdAt
  })
}

export class PrismaStockMovementRepository implements StockMovementRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findByProductId(productId: string): Promise<StockMovement[]> {
    const rows = await this.prisma.stockMovement.findMany({
      where: { productId },
      orderBy: { createdAt: 'desc' }
    })
    return rows.map(toEntity)
  }

  async findRecent(limit: number): Promise<StockMovement[]> {
    const rows = await this.prisma.stockMovement.findMany({
      orderBy: { createdAt: 'desc' },
      take: limit
    })
    return rows.map(toEntity)
  }

  async save(movement: StockMovement): Promise<void> {
    await this.prisma.stockMovement.create({
      data: {
        id: movement.id,
        productId: movement.productId,
        type: movement.type,
        quantity: movement.quantity,
        previousStock: movement.previousStock,
        balanceAfter: movement.newStock,
        reason: movement.justification,
        userId: movement.userId,
        createdAt: movement.createdAt
      }
    })
  }
}
