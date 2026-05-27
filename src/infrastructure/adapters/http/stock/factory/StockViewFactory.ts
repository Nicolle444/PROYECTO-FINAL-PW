import { StockView } from '../views/StockView.js'
import { StockController } from '../controllers/StockController.js'

export class StockViewFactory {
  static readonly create = (stockController: StockController): StockView => {
    const view = new StockView(stockController)
    if (!view) throw new Error('StockViewFactory: Failed to create StockView')
    return view
  }
}
