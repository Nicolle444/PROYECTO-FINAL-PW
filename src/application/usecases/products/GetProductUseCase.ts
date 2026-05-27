import { Product } from '../../../domain/entities/Product.js'
import { ProductRepository } from '../../../domain/ports/ProductRepository.js'

export class GetProductUseCase {
  constructor(private readonly productRepository: ProductRepository) {}

  readonly execute = async (id: string): Promise<Product> => {
    const product = await this.productRepository.findById(id)
    if (!product) throw new Error('Product not found')
    return product
  }
}
