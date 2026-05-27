import { SupplierController } from '../controllers/SupplierController.js'
import { SupplierUseCases } from './SupplierModelFactory.js'

export class SupplierControllerFactory {
  static readonly create = (useCases: SupplierUseCases): SupplierController => {
    const controller = new SupplierController(
      useCases.createSupplier,
      useCases.listSuppliers,
      useCases.getSupplier,
      useCases.updateSupplier,
      useCases.deleteSupplier
    )
    if (!controller) throw new Error('SupplierControllerFactory: Failed to create SupplierController')
    return controller
  }
}
