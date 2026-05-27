import { AuthController } from '../controllers/AuthController.js'
import { LoginUseCase } from '../../../../../application/usecases/auth/LoginUseCase.js'

export class AuthControllerFactory {
  static readonly create = (loginUseCase: LoginUseCase): AuthController => {
    const controller = new AuthController(loginUseCase)
    if (!controller) throw new Error('AuthControllerFactory: Failed to create AuthController')
    return controller
  }
}
