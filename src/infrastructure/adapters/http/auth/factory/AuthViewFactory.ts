import { AuthView } from '../views/AuthView.js'
import { AuthController } from '../controllers/AuthController.js'

export class AuthViewFactory {
  static readonly create = (authController: AuthController): AuthView => {
    const view = new AuthView(authController)
    if (!view) throw new Error('AuthViewFactory: Failed to create AuthView')
    return view
  }
}
