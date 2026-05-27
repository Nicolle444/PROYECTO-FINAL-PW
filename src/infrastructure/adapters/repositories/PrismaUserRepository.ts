import { PrismaClient } from '@prisma/client'
import { User, UserRole } from '../../../domain/entities/User.js'
import { UserRepository } from '../../../domain/ports/UserRepository.js'

function toDomainRole(role: string): UserRole {
  if (role === 'GERENTE') return 'GERENTE_COMPRAS'
  if (role === 'OPERARIO') return 'OPERARIO_BODEGA'
  return 'ADMIN'
}

function toDbRole(role: UserRole): string {
  if (role === 'GERENTE_COMPRAS') return 'GERENTE'
  if (role === 'OPERARIO_BODEGA') return 'OPERARIO'
  return 'ADMIN'
}

export class PrismaUserRepository implements UserRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findById(id: string): Promise<User | null> {
    const row = await this.prisma.user.findUnique({ where: { id } })
    if (!row) return null
    return new User({
      id: row.id,
      name: row.name,
      email: row.email,
      passwordHash: row.password,
      role: toDomainRole(row.role),
      createdAt: row.createdAt
    })
  }

  async findByEmail(email: string): Promise<User | null> {
    const row = await this.prisma.user.findUnique({ where: { email } })
    if (!row) return null
    return new User({
      id: row.id,
      name: row.name,
      email: row.email,
      passwordHash: row.password,
      role: toDomainRole(row.role),
      createdAt: row.createdAt
    })
  }

  async findAll(): Promise<User[]> {
    const rows = await this.prisma.user.findMany()
    return rows.map((row) => new User({
      id: row.id,
      name: row.name,
      email: row.email,
      passwordHash: row.password,
      role: toDomainRole(row.role),
      createdAt: row.createdAt
    }))
  }

  async delete(id: string): Promise<void> {
    await this.prisma.user.delete({ where: { id } })
  }

  async save(user: User): Promise<void> {
    await this.prisma.user.upsert({
      where: { id: user.id },
      create: {
        id: user.id,
        name: user.name,
        email: user.email,
        password: user.passwordHash,
        role: toDbRole(user.role),
        createdAt: user.createdAt
      },
      update: {
        name: user.name,
        password: user.passwordHash,
        role: toDbRole(user.role)
      }
    })
  }
}
