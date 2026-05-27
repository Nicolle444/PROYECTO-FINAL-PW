import { StockController } from '../controllers/StockController.js'
import { StockUseCases } from './StockModelFactory.js'

export class StockControllerFactory {
  static readonly create = (useCases: StockUseCases): StockController => {
    const controller = new StockController(useCases.registerEntry, useCases.registerExit, useCases.adjustStock)
    if (!controller) throw new Error('StockControllerFactory: Failed to create StockController')
    return controller
  }
}
