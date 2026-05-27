import bcrypt from 'bcryptjs'
import { v4 as uuidv4 } from 'uuid'
import { User, UserRole } from '../../../domain/entities/User.js'
import { UserRepository } from '../../../domain/ports/UserRepository.js'

export interface CreateUserInput {
  name: string
  email: string
  password: string
  role: UserRole
}

export class CreateUserUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  readonly execute = async (input: CreateUserInput): Promise<User> => {
    if (!input.name || !input.email || !input.password) {
      throw new Error('Name, email and password are required')
    }
    const existing = await this.userRepository.findByEmail(input.email)
    if (existing) throw new Error(`User with email ${input.email} already exists`)

    const passwordHash = await bcrypt.hash(input.password, 10)
    const user = new User({
      id: uuidv4(),
      name: input.name,
      email: input.email,
      passwordHash,
      role: input.role,
      createdAt: new Date()
    })
    await this.userRepository.save(user)
    return user
  }
}
