import { AbstractRouter } from '../../../../../server/model/AbstractRouter.js'
import { ReportController } from '../controllers/ReportController.js'
import { authMiddleware, requireRoles } from '../../../../middleware/AuthMiddleware.js'

export class ReportView extends AbstractRouter {
  constructor(private readonly reportController: ReportController) {
    super()
    this.routes()
  }

  private routes(): void {
    this.router.get('/api/v1/reports/valuation', authMiddleware, requireRoles('ADMIN', 'GERENTE_COMPRAS'), this.reportController.valuation)
  }
}
