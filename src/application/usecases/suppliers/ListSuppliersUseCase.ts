import { Supplier } from '../../../domain/entities/Supplier.js'
import { SupplierRepository } from '../../../domain/ports/SupplierRepository.js'

export class ListSuppliersUseCase {
  constructor(private readonly supplierRepository: SupplierRepository) {}

  readonly execute = async (): Promise<Supplier[]> => {
    return this.supplierRepository.findAll()
  }
}
