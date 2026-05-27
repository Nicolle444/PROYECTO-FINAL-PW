import { PrismaClient } from '@prisma/client'
import { Product } from '../../../domain/entities/Product.js'
import { ProductRepository } from '../../../domain/ports/ProductRepository.js'

type ProductRow = {
  id: string
  sku: string
  name: string
  description: string
  supplierId: string
  location: string
  stock: number
  minStock: number
  acquisitionCost: number
  createdAt: Date
  updatedAt: Date
}

function toEntity(row: ProductRow): Product {
  return new Product({
    id: row.id,
    sku: row.sku,
    name: row.name,
    description: row.description,
    supplierId: row.supplierId,
    warehouseLocation: row.location,
    stock: row.stock,
    minimumStock: row.minStock,
    acquisitionCost: row.acquisitionCost,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt
  })
}

export class PrismaProductRepository implements ProductRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findById(id: string): Promise<Product | null> {
    const row = await this.prisma.product.findUnique({ where: { id } })
    return row ? toEntity(row) : null
  }

  async findBySku(sku: string): Promise<Product | null> {
    const row = await this.prisma.product.findUnique({ where: { sku } })
    return row ? toEntity(row) : null
  }

  async findAll(): Promise<Product[]> {
    const rows = await this.prisma.product.findMany()
    return rows.map(toEntity)
  }

  async search(query: string): Promise<Product[]> {
    const rows = await this.prisma.product.findMany({
      where: {
        OR: [
          { sku: { contains: query } },
          { name: { contains: query } }
        ]
      }
    })
    return rows.map(toEntity)
  }

  async save(product: Product): Promise<void> {
    await this.prisma.product.upsert({
      where: { id: product.id },
      create: {
        id: product.id,
        sku: product.sku,
        name: product.name,
        description: product.description,
        supplierId: product.supplierId,
        location: product.warehouseLocation,
        stock: product.stock,
        minStock: product.minimumStock,
        acquisitionCost: product.acquisitionCost,
        createdAt: product.createdAt
      },
      update: {
        sku: product.sku,
        name: product.name,
        description: product.description,
        supplierId: product.supplierId,
        location: product.warehouseLocation,
        stock: product.stock,
        minStock: product.minimumStock,
        acquisitionCost: product.acquisitionCost
      }
    })
  }

  async delete(id: string): Promise<void> {
    await this.prisma.product.delete({ where: { id } })
  }
}
