import { Product } from '../../../domain/entities/Product.js'
import { ProductRepository } from '../../../domain/ports/ProductRepository.js'

export interface UpdateProductInput {
  name?: string
  description?: string
  supplierId?: string
  warehouseLocation?: string
  minimumStock?: number
  acquisitionCost?: number
}

export class UpdateProductUseCase {
  constructor(private readonly productRepository: ProductRepository) {}

  readonly execute = async (id: string, input: UpdateProductInput): Promise<Product> => {
    const product = await this.productRepository.findById(id)
    if (!product) throw new Error('Product not found')
    product.update(input)
    await this.productRepository.save(product)
    return product
  }
}
