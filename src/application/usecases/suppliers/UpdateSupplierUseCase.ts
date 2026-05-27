import { Supplier } from '../../../domain/entities/Supplier.js'
import { SupplierRepository } from '../../../domain/ports/SupplierRepository.js'

export class UpdateSupplierUseCase {
  constructor(private readonly supplierRepository: SupplierRepository) {}

  readonly execute = async (id: string, data: Partial<{ name: string; contactName: string; email: string; phone: string; address: string }>): Promise<Supplier> => {
    const supplier = await this.supplierRepository.findById(id)
    if (!supplier) throw new Error('Supplier not found')
    supplier.update(data)
    await this.supplierRepository.save(supplier)
    return supplier
  }
}
