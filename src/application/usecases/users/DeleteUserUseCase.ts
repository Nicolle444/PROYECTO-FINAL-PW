import { UserRepository } from '../../../domain/ports/UserRepository.js'

export class DeleteUserUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  readonly execute = async (id: string): Promise<void> => {
    const user = await this.userRepository.findById(id)
    if (!user) throw new Error('User not found')
    await this.userRepository.delete(id)
  }
}
