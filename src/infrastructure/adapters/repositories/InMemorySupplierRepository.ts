import { Supplier } from '../../../domain/entities/Supplier.js'
import { SupplierRepository } from '../../../domain/ports/SupplierRepository.js'

export class InMemorySupplierRepository implements SupplierRepository {
  private readonly _suppliers: Map<string, Supplier> = new Map()

  async findById(id: string): Promise<Supplier | null> {
    return this._suppliers.get(id) ?? null
  }

  async findAll(): Promise<Supplier[]> {
    return Array.from(this._suppliers.values())
  }

  async save(supplier: Supplier): Promise<void> {
    this._suppliers.set(supplier.id, supplier)
  }

  async delete(id: string): Promise<void> {
    this._suppliers.delete(id)
  }
}
