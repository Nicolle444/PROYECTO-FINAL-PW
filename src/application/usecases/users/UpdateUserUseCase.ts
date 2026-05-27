import bcrypt from 'bcryptjs'
import { User, UserRole } from '../../../domain/entities/User.js'
import { UserRepository } from '../../../domain/ports/UserRepository.js'

export interface UpdateUserInput {
  name?: string
  email?: string
  password?: string
  role?: UserRole
}

export class UpdateUserUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  readonly execute = async (id: string, input: UpdateUserInput): Promise<User> => {
    const existing = await this.userRepository.findById(id)
    if (!existing) throw new Error('User not found')

    const passwordHash = input.password
      ? await bcrypt.hash(input.password, 10)
      : existing.passwordHash

    const updated = new User({
      id: existing.id,
      name: input.name ?? existing.name,
      email: input.email ?? existing.email,
      passwordHash,
      role: input.role ?? existing.role,
      createdAt: existing.createdAt
    })
    await this.userRepository.save(updated)
    return updated
  }
}
