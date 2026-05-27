import { DashboardView } from '../views/DashboardView.js'
import { DashboardController } from '../controllers/DashboardController.js'

export class DashboardViewFactory {
  static readonly create = (dashboardController: DashboardController): DashboardView => {
    const view = new DashboardView(dashboardController)
    if (!view) throw new Error('DashboardViewFactory: Failed to create DashboardView')
    return view
  }
}
