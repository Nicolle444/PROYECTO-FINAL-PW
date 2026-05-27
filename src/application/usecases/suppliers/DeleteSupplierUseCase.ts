import { SupplierRepository } from '../../../domain/ports/SupplierRepository.js'

export class DeleteSupplierUseCase {
  constructor(private readonly supplierRepository: SupplierRepository) {}

  readonly execute = async (id: string): Promise<void> => {
    const supplier = await this.supplierRepository.findById(id)
    if (!supplier) throw new Error('Supplier not found')
    await this.supplierRepository.delete(id)
  }
}
