import { AbstractRouter } from '../../../../../server/model/AbstractRouter.js'
import { DashboardController } from '../controllers/DashboardController.js'
import { authMiddleware } from '../../../../middleware/AuthMiddleware.js'

export class DashboardView extends AbstractRouter {
  constructor(private readonly dashboardController: DashboardController) {
    super()
    this.routes()
  }

  private routes(): void {
    this.router.get('/api/v1/dashboard', authMiddleware, this.dashboardController.dashboard)
  }
}
