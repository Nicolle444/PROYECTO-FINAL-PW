import { AbstractRouter } from '../../../../../server/model/AbstractRouter.js'
import { StockController } from '../controllers/StockController.js'
import { authMiddleware, requireRoles } from '../../../../middleware/AuthMiddleware.js'

export class StockView extends AbstractRouter {
  constructor(private readonly stockController: StockController) {
    super()
    this.routes()
  }

  private routes(): void {
    this.router.post('/api/v1/stock/entry', authMiddleware, requireRoles('ADMIN', 'GERENTE_COMPRAS', 'OPERARIO_BODEGA'), this.stockController.entry)
    this.router.post('/api/v1/stock/exit', authMiddleware, requireRoles('ADMIN', 'GERENTE_COMPRAS', 'OPERARIO_BODEGA'), this.stockController.exit)
    this.router.post('/api/v1/stock/adjust', authMiddleware, requireRoles('ADMIN', 'GERENTE_COMPRAS'), this.stockController.adjust)
  }
}
