import { User } from '../../../domain/entities/User.js'
import { UserRepository } from '../../../domain/ports/UserRepository.js'

export class GetUserUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  readonly execute = async (id: string): Promise<User> => {
    const user = await this.userRepository.findById(id)
    if (!user) throw new Error('User not found')
    return user
  }
}
