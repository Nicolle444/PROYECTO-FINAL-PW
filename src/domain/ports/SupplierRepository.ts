import { Supplier } from '../entities/Supplier.js'

export interface SupplierRepository {
  findById(id: string): Promise<Supplier | null>
  findAll(): Promise<Supplier[]>
  save(supplier: Supplier): Promise<void>
  delete(id: string): Promise<void>
}
