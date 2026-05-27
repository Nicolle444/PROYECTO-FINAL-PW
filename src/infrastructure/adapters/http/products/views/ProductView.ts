import { AbstractRouter } from '../../../../../server/model/AbstractRouter.js'
import { ProductController } from '../controllers/ProductController.js'
import { authMiddleware, requireRoles } from '../../../../middleware/AuthMiddleware.js'

export class ProductView extends AbstractRouter {
  constructor(private readonly productController: ProductController) {
    super()
    this.routes()
  }

  private routes(): void {
    this.router.get('/api/v1/products', authMiddleware, this.productController.list)
    this.router.get('/api/v1/products/search', authMiddleware, this.productController.search)
    this.router.get('/api/v1/products/:id', authMiddleware, this.productController.getById)
    this.router.get('/api/v1/products/:id/kardex', authMiddleware, this.productController.kardex)
    this.router.post('/api/v1/products', authMiddleware, requireRoles('ADMIN', 'GERENTE_COMPRAS'), this.productController.create)
    this.router.put('/api/v1/products/:id', authMiddleware, requireRoles('ADMIN', 'GERENTE_COMPRAS'), this.productController.update)
    this.router.delete('/api/v1/products/:id', authMiddleware, requireRoles('ADMIN'), this.productController.remove)
  }
}
