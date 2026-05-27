import { Product } from '../../../domain/entities/Product.js'
import { ProductRepository } from '../../../domain/ports/ProductRepository.js'

export class SearchProductsUseCase {
  constructor(private readonly productRepository: ProductRepository) {}

  readonly execute = async (query: string): Promise<Product[]> => {
    if (!query || query.trim().length === 0) throw new Error('Search query is required')
    return this.productRepository.search(query.trim())
  }
}
