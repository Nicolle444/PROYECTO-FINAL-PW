import { ProductRepository } from '../../../domain/ports/ProductRepository.js'

export class DeleteProductUseCase {
  constructor(private readonly productRepository: ProductRepository) {}

  readonly execute = async (id: string): Promise<void> => {
    const product = await this.productRepository.findById(id)
    if (!product) throw new Error('Product not found')
    await this.productRepository.delete(id)
  }
}
