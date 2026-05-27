import { ProductController } from '../controllers/ProductController.js'
import { ProductUseCases } from './ProductModelFactory.js'

export class ProductControllerFactory {
  static readonly create = (useCases: ProductUseCases): ProductController => {
    const controller = new ProductController(
      useCases.createProduct,
      useCases.getProduct,
      useCases.listProducts,
      useCases.searchProducts,
      useCases.updateProduct,
      useCases.deleteProduct,
      useCases.getKardex
    )
    if (!controller) throw new Error('ProductControllerFactory: Failed to create ProductController')
    return controller
  }
}
