import { v4 as uuidv4 } from 'uuid'
import { Product } from '../../../domain/entities/Product.js'
import { LowStockNotifier } from '../../../domain/observers/LowStockNotifier.js'
import { DashboardUpdater } from '../../../domain/observers/DashboardUpdater.js'
import { ProductRepository } from '../../../domain/ports/ProductRepository.js'
import { SupplierRepository } from '../../../domain/ports/SupplierRepository.js'

export interface CreateProductInput {
  sku: string
  name: string
  description: string
  supplierId: string
  warehouseLocation: string
  stock: number
  minimumStock: number
  acquisitionCost: number
}

export class CreateProductUseCase {
  constructor(
    private readonly productRepository: ProductRepository,
    private readonly supplierRepository: SupplierRepository,
    private readonly lowStockNotifier: LowStockNotifier,
    private readonly dashboardUpdater: DashboardUpdater
  ) {}

  readonly execute = async (input: CreateProductInput): Promise<Product> => {
    if (!input.sku || !input.name) throw new Error('SKU and name are required')
    if (input.stock < 0) throw new Error('Stock cannot be negative')
    if (input.minimumStock < 0) throw new Error('Minimum stock cannot be negative')
    if (input.acquisitionCost < 0) throw new Error('Acquisition cost cannot be negative')
    const existing = await this.productRepository.findBySku(input.sku)
    if (existing) throw new Error(`Product with SKU ${input.sku} already exists`)
    const supplier = await this.supplierRepository.findById(input.supplierId)
    if (!supplier) throw new Error('Supplier not found')
    const product = new Product({ id: uuidv4(), ...input, createdAt: new Date(), updatedAt: new Date() })
    product.addObserver(this.lowStockNotifier)
    product.addObserver(this.dashboardUpdater)
    await this.productRepository.save(product)
    return product
  }
}
