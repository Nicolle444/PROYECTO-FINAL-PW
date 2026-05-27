import { User } from '../../../domain/entities/User.js'
import { UserRepository } from '../../../domain/ports/UserRepository.js'
import bcrypt from 'bcryptjs'
import { v4 as uuidv4 } from 'uuid'

export class InMemoryUserRepository implements UserRepository {
  private readonly _users: Map<string, User> = new Map()

  constructor() {
    this.seed()
  }

  private seed(): void {
    const hash = bcrypt.hashSync('admin123', 10)
    const admin = new User({ id: uuidv4(), name: 'Administrador', email: 'admin@pyme.com', passwordHash: hash, role: 'ADMIN', createdAt: new Date() })
    const gerenteHash = bcrypt.hashSync('gerente123', 10)
    const gerente = new User({ id: uuidv4(), name: 'Gerente Compras', email: 'gerente@pyme.com', passwordHash: gerenteHash, role: 'GERENTE_COMPRAS', createdAt: new Date() })
    const operarioHash = bcrypt.hashSync('operario123', 10)
    const operario = new User({ id: uuidv4(), name: 'Operario Bodega', email: 'operario@pyme.com', passwordHash: operarioHash, role: 'OPERARIO_BODEGA', createdAt: new Date() })
    this._users.set(admin.id, admin)
    this._users.set(gerente.id, gerente)
    this._users.set(operario.id, operario)
  }

  async findById(id: string): Promise<User | null> {
    return this._users.get(id) ?? null
  }

  async findByEmail(email: string): Promise<User | null> {
    for (const user of this._users.values()) {
      if (user.email === email) return user
    }
    return null
  }

  async save(user: User): Promise<void> {
    this._users.set(user.id, user)
  }

  async findAll(): Promise<User[]> {
    return Array.from(this._users.values())
  }

  async delete(id: string): Promise<void> {
    this._users.delete(id)
  }
}
