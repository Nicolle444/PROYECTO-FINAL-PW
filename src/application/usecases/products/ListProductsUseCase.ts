import { Product } from '../../../domain/entities/Product.js'
import { ProductRepository } from '../../../domain/ports/ProductRepository.js'

export class ListProductsUseCase {
  constructor(private readonly productRepository: ProductRepository) {}

  readonly execute = async (): Promise<Product[]> => {
    return this.productRepository.findAll()
  }
}
