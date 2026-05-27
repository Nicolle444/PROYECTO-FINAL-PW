import { v4 as uuidv4 } from 'uuid'
import { Supplier } from '../../../domain/entities/Supplier.js'
import { SupplierRepository } from '../../../domain/ports/SupplierRepository.js'

export interface CreateSupplierInput {
  name: string
  contactName: string
  email: string
  phone: string
  address: string
}

export class CreateSupplierUseCase {
  constructor(private readonly supplierRepository: SupplierRepository) {}

  readonly execute = async (input: CreateSupplierInput): Promise<Supplier> => {
    if (!input.name || !input.email) throw new Error('Name and email are required')
    const supplier = new Supplier({ id: uuidv4(), ...input, createdAt: new Date(), updatedAt: new Date() })
    await this.supplierRepository.save(supplier)
    return supplier
  }
}
