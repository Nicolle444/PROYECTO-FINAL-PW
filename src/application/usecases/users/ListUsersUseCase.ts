import { User } from '../../../domain/entities/User.js'
import { UserRepository } from '../../../domain/ports/UserRepository.js'

export class ListUsersUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  readonly execute = async (): Promise<User[]> => {
    return this.userRepository.findAll()
  }
}
