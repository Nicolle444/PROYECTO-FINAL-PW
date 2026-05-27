import { RegisterEntryUseCase } from '../../../../../application/usecases/stock/RegisterEntryUseCase.js'
import { RegisterExitUseCase } from '../../../../../application/usecases/stock/RegisterExitUseCase.js'
import { AdjustStockUseCase } from '../../../../../application/usecases/stock/AdjustStockUseCase.js'
import { LowStockNotifier } from '../../../../../domain/observers/LowStockNotifier.js'
import { DashboardUpdater } from '../../../../../domain/observers/DashboardUpdater.js'
import { ProductRepository } from '../../../../../domain/ports/ProductRepository.js'
import { StockMovementRepository } from '../../../../../domain/ports/StockMovementRepository.js'
import { StockAlertRepository } from '../../../../../domain/ports/StockAlertRepository.js'

export interface StockUseCases {
  registerEntry: RegisterEntryUseCase
  registerExit: RegisterExitUseCase
  adjustStock: AdjustStockUseCase
}

export class StockModelFactory {
  static readonly create = (
    productRepo: ProductRepository,
    movementRepo: StockMovementRepository,
    alertRepo: StockAlertRepository
  ): StockUseCases => {
    const lowStockNotifier = new LowStockNotifier(alertRepo)
    const dashboardUpdater = new DashboardUpdater()
    return {
      registerEntry: new RegisterEntryUseCase(productRepo, movementRepo, lowStockNotifier, dashboardUpdater),
      registerExit: new RegisterExitUseCase(productRepo, movementRepo, lowStockNotifier, dashboardUpdater),
      adjustStock: new AdjustStockUseCase(productRepo, movementRepo, lowStockNotifier, dashboardUpdater)
    }
  }
}
