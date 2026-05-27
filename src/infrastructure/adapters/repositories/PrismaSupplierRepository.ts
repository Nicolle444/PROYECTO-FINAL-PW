import { PrismaClient } from '@prisma/client'
import { Supplier } from '../../../domain/entities/Supplier.js'
import { SupplierRepository } from '../../../domain/ports/SupplierRepository.js'

type SupplierRow = {
  id: string
  name: string
  contactName: string
  email: string
  phone: string
  address: string
  createdAt: Date
  updatedAt: Date
}

function toEntity(row: SupplierRow): Supplier {
  return new Supplier({
    id: row.id,
    name: row.name,
    contactName: row.contactName,
    email: row.email,
    phone: row.phone,
    address: row.address,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt
  })
}

export class PrismaSupplierRepository implements SupplierRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findById(id: string): Promise<Supplier | null> {
    const row = await this.prisma.supplier.findUnique({ where: { id } })
    return row ? toEntity(row) : null
  }

  async findAll(): Promise<Supplier[]> {
    const rows = await this.prisma.supplier.findMany()
    return rows.map(toEntity)
  }

  async save(supplier: Supplier): Promise<void> {
    await this.prisma.supplier.upsert({
      where: { id: supplier.id },
      create: {
        id: supplier.id,
        name: supplier.name,
        contactName: supplier.contactName,
        email: supplier.email,
        phone: supplier.phone,
        address: supplier.address,
        createdAt: supplier.createdAt
      },
      update: {
        name: supplier.name,
        contactName: supplier.contactName,
        email: supplier.email,
        phone: supplier.phone,
        address: supplier.address
      }
    })
  }

  async delete(id: string): Promise<void> {
    await this.prisma.supplier.delete({ where: { id } })
  }
}
