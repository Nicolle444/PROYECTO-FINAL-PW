import { AbstractRouter } from '../../../../../server/model/AbstractRouter.js'
import { AuthController } from '../controllers/AuthController.js'

export class AuthView extends AbstractRouter {
  constructor(private readonly authController: AuthController) {
    super()
    this.routes()
  }

  private routes(): void {
    this.router.post('/api/v1/auth/login', this.authController.login)
  }
}
