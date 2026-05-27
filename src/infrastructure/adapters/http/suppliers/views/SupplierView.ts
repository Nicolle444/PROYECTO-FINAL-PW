import { AbstractRouter } from '../../../../../server/model/AbstractRouter.js'
import { SupplierController } from '../controllers/SupplierController.js'
import { authMiddleware, requireRoles } from '../../../../middleware/AuthMiddleware.js'

export class SupplierView extends AbstractRouter {
  constructor(private readonly supplierController: SupplierController) {
    super()
    this.routes()
  }

  private routes(): void {
    this.router.get('/api/v1/suppliers', authMiddleware, this.supplierController.list)
    this.router.get('/api/v1/suppliers/:id', authMiddleware, this.supplierController.getById)
    this.router.post('/api/v1/suppliers', authMiddleware, requireRoles('ADMIN', 'GERENTE_COMPRAS'), this.supplierController.create)
    this.router.put('/api/v1/suppliers/:id', authMiddleware, requireRoles('ADMIN', 'GERENTE_COMPRAS'), this.supplierController.update)
    this.router.delete('/api/v1/suppliers/:id', authMiddleware, requireRoles('ADMIN'), this.supplierController.remove)
  }
}
