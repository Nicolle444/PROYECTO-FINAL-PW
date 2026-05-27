import { GetDashboardUseCase } from '../../../../../application/usecases/dashboard/GetDashboardUseCase.js'
import { ProductRepository } from '../../../../../domain/ports/ProductRepository.js'
import { StockMovementRepository } from '../../../../../domain/ports/StockMovementRepository.js'
import { StockAlertRepository } from '../../../../../domain/ports/StockAlertRepository.js'
import { UserRepository } from '../../../../../domain/ports/UserRepository.js'

export class DashboardModelFactory {
  static readonly create = (
    productRepo: ProductRepository,
    movementRepo: StockMovementRepository,
    alertRepo: StockAlertRepository,
    userRepo: UserRepository
  ): GetDashboardUseCase => {
    return new GetDashboardUseCase(productRepo, movementRepo, alertRepo, userRepo)
  }
}
