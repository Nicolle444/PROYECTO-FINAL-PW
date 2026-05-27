import { SupplierView } from '../views/SupplierView.js'
import { SupplierController } from '../controllers/SupplierController.js'

export class SupplierViewFactory {
  static readonly create = (supplierController: SupplierController): SupplierView => {
    const view = new SupplierView(supplierController)
    if (!view) throw new Error('SupplierViewFactory: Failed to create SupplierView')
    return view
  }
}
