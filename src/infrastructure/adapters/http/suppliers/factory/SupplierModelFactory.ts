import { CreateSupplierUseCase } from '../../../../../application/usecases/suppliers/CreateSupplierUseCase.js'
import { ListSuppliersUseCase } from '../../../../../application/usecases/suppliers/ListSuppliersUseCase.js'
import { GetSupplierUseCase } from '../../../../../application/usecases/suppliers/GetSupplierUseCase.js'
import { UpdateSupplierUseCase } from '../../../../../application/usecases/suppliers/UpdateSupplierUseCase.js'
import { DeleteSupplierUseCase } from '../../../../../application/usecases/suppliers/DeleteSupplierUseCase.js'
import { SupplierRepository } from '../../../../../domain/ports/SupplierRepository.js'

export interface SupplierUseCases {
  createSupplier: CreateSupplierUseCase
  listSuppliers: ListSuppliersUseCase
  getSupplier: GetSupplierUseCase
  updateSupplier: UpdateSupplierUseCase
  deleteSupplier: DeleteSupplierUseCase
}

export class SupplierModelFactory {
  static readonly create = (supplierRepo: SupplierRepository): SupplierUseCases => {
    return {
      createSupplier: new CreateSupplierUseCase(supplierRepo),
      listSuppliers: new ListSuppliersUseCase(supplierRepo),
      getSupplier: new GetSupplierUseCase(supplierRepo),
      updateSupplier: new UpdateSupplierUseCase(supplierRepo),
      deleteSupplier: new DeleteSupplierUseCase(supplierRepo)
    }
  }
}
