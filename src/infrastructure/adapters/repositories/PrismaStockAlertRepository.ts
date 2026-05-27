import { PrismaClient } from '@prisma/client'
import { v4 as uuidv4 } from 'uuid'
import { StockAlertEntry, StockAlertRepository } from '../../../domain/ports/StockAlertRepository.js'

export class PrismaStockAlertRepository implements StockAlertRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findUnresolved(): Promise<StockAlertEntry[]> {
    const rows = await this.prisma.stockAlert.findMany({
      where: { resolved: false },
      orderBy: { createdAt: 'desc' },
    })
    return rows.map((r) => ({
      id: r.id,
      productId: r.productId,
      currentStock: r.currentStock,
      minStock: r.minStock,
      resolved: r.resolved,
      createdAt: r.createdAt,
    }))
  }

  async upsertAlert(productId: string, currentStock: number, minStock: number): Promise<void> {
    const existing = await this.prisma.stockAlert.findFirst({
      where: { productId, resolved: false },
    })
    if (existing) {
      await this.prisma.stockAlert.update({
        where: { id: existing.id },
        data: { currentStock, minStock },
      })
    } else {
      await this.prisma.stockAlert.create({
        data: { id: uuidv4(), productId, currentStock, minStock, resolved: false },
      })
    }
  }

  async resolveByProductId(productId: string): Promise<void> {
    await this.prisma.stockAlert.updateMany({
      where: { productId, resolved: false },
      data: { resolved: true },
    })
  }
}
