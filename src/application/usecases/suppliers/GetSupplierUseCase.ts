import { Supplier } from '../../../domain/entities/Supplier.js'
import { SupplierRepository } from '../../../domain/ports/SupplierRepository.js'

export class GetSupplierUseCase {
  constructor(private readonly supplierRepository: SupplierRepository) {}

  readonly execute = async (id: string): Promise<Supplier> => {
    const supplier = await this.supplierRepository.findById(id)
    if (!supplier) throw new Error('Supplier not found')
    return supplier
  }
}
