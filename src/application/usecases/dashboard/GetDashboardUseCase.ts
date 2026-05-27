import { ProductRepository } from '../../../domain/ports/ProductRepository.js'
import { StockMovementRepository } from '../../../domain/ports/StockMovementRepository.js'
import { StockAlertRepository } from '../../../domain/ports/StockAlertRepository.js'
import { UserRepository } from '../../../domain/ports/UserRepository.js'

export interface DashboardOutput {
  totalInventoryValue: number
  totalProducts: number
  lowStockProducts: Array<{ id: string; sku: string; name: string; stock: number; minimumStock: number }>
  recentMovements: Array<{ id: string; productId: string; type: string; quantity: number; createdAt: Date; userName: string }>
}

export class GetDashboardUseCase {
  constructor(
    private readonly productRepository: ProductRepository,
    private readonly movementRepository: StockMovementRepository,
    private readonly stockAlertRepository: StockAlertRepository,
    private readonly userRepository: UserRepository
  ) {}

  readonly execute = async (): Promise<DashboardOutput> => {
    const [products, recentMovements, unresolvedAlerts, users] = await Promise.all([
      this.productRepository.findAll(),
      this.movementRepository.findRecent(10),
      this.stockAlertRepository.findUnresolved(),
      this.userRepository.findAll(),
    ])

    const totalInventoryValue = products.reduce((sum, p) => sum + p.stock * p.acquisitionCost, 0)
    const productMap = new Map(products.map((p) => [p.id, p]))
    const userMap = new Map(users.map((u) => [u.id, u.name]))

    const lowStockProducts = unresolvedAlerts
      .map((alert) => {
        const product = productMap.get(alert.productId)
        if (!product) return null
        return {
          id: product.id,
          sku: product.sku,
          name: product.name,
          stock: alert.currentStock,
          minimumStock: alert.minStock,
        }
      })
      .filter((item): item is NonNullable<typeof item> => item !== null)

    return {
      totalInventoryValue,
      totalProducts: products.length,
      lowStockProducts,
      recentMovements: recentMovements.map((m) => ({
        id: m.id,
        productId: m.productId,
        type: m.type,
        quantity: m.quantity,
        createdAt: m.createdAt,
        userName: userMap.get(m.userId) ?? 'Desconocido',
      })),
    }
  }
}
