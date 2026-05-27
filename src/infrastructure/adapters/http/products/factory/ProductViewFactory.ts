import { ProductView } from '../views/ProductView.js'
import { ProductController } from '../controllers/ProductController.js'

export class ProductViewFactory {
  static readonly create = (productController: ProductController): ProductView => {
    const view = new ProductView(productController)
    if (!view) throw new Error('ProductViewFactory: Failed to create ProductView')
    return view
  }
}
