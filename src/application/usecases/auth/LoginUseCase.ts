import * as bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { UserRepository } from '../../../domain/ports/UserRepository.js'

const JWT_SECRET = process.env['JWT_SECRET'] ?? 'inventario-pyme-secret-2024'

export interface LoginInput {
  email: string
  password: string
}

export interface LoginOutput {
  token: string
  user: { id: string; name: string; email: string; role: string }
}

export class LoginUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  readonly execute = async (input: LoginInput): Promise<LoginOutput> => {
    if (!input.email || !input.password) {
      throw new Error('Email and password are required')
    }
    const user = await this.userRepository.findByEmail(input.email)
    if (!user) throw new Error('Invalid credentials')
    const valid = await bcrypt.compare(input.password, user.passwordHash)
    if (!valid) throw new Error('Invalid credentials')
    const token = jwt.sign({ userId: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '8h' })
    return { token, user: user.toJSON() }
  }
}
