import { ProductRepository } from '../../../domain/ports/ProductRepository.js'

export interface ValuationItem {
  productId: string
  sku: string
  name: string
  stock: number
  acquisitionCost: number
  totalValue: number
}

export interface ValuationReport {
  generatedAt: Date
  totalInventoryValue: number
  items: ValuationItem[]
}

export class GetValuationReportUseCase {
  constructor(private readonly productRepository: ProductRepository) {}

  readonly execute = async (): Promise<ValuationReport> => {
    const products = await this.productRepository.findAll()
    const items = products.map((p) => ({ productId: p.id, sku: p.sku, name: p.name, stock: p.stock, acquisitionCost: p.acquisitionCost, totalValue: p.stock * p.acquisitionCost }))
    const totalInventoryValue = items.reduce((sum, i) => sum + i.totalValue, 0)
    return { generatedAt: new Date(), totalInventoryValue, items }
  }
}
