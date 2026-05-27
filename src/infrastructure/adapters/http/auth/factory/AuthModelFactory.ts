import { LoginUseCase } from '../../../../../application/usecases/auth/LoginUseCase.js'
import { UserRepository } from '../../../../../domain/ports/UserRepository.js'

export class AuthModelFactory {
  static readonly create = (userRepository: UserRepository): LoginUseCase => {
    const model = new LoginUseCase(userRepository)
    if (!model) throw new Error('AuthModelFactory: Failed to create LoginUseCase')
    return model
  }
}
