import { DashboardController } from '../controllers/DashboardController.js'
import { GetDashboardUseCase } from '../../../../../application/usecases/dashboard/GetDashboardUseCase.js'

export class DashboardControllerFactory {
  static readonly create = (useCase: GetDashboardUseCase): DashboardController => {
    const controller = new DashboardController(useCase)
    if (!controller) throw new Error('DashboardControllerFactory: Failed to create DashboardController')
    return controller
  }
}
