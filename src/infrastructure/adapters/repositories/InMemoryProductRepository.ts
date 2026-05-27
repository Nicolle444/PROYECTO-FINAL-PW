import { Product } from '../../../domain/entities/Product.js'
import { ProductRepository } from '../../../domain/ports/ProductRepository.js'

export class InMemoryProductRepository implements ProductRepository {
  private readonly _products: Map<string, Product> = new Map()

  async findById(id: string): Promise<Product | null> {
    return this._products.get(id) ?? null
  }

  async findBySku(sku: string): Promise<Product | null> {
    for (const product of this._products.values()) {
      if (product.sku === sku) return product
    }
    return null
  }

  async findAll(): Promise<Product[]> {
    return Array.from(this._products.values())
  }

  async search(query: string): Promise<Product[]> {
    const lower = query.toLowerCase()
    return Array.from(this._products.values()).filter(
      (p) => p.sku.toLowerCase().includes(lower) || p.name.toLowerCase().includes(lower)
    )
  }

  async save(product: Product): Promise<void> {
    this._products.set(product.id, product)
  }

  async delete(id: string): Promise<void> {
    this._products.delete(id)
  }
}
