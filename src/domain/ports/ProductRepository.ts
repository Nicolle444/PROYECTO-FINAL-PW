import { Product } from '../entities/Product.js'

export interface ProductRepository {
  findById(id: string): Promise<Product | null>
  findBySku(sku: string): Promise<Product | null>
  findAll(): Promise<Product[]>
  search(query: string): Promise<Product[]>
  save(product: Product): Promise<void>
  delete(id: string): Promise<void>
}
