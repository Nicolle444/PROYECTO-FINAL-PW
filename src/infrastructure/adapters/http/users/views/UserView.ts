import { AbstractRouter } from '../../../../../server/model/AbstractRouter.js'
import { UserController } from '../controllers/UserController.js'
import { authMiddleware, requireRoles } from '../../../../middleware/AuthMiddleware.js'

export class UserView extends AbstractRouter {
  constructor(private readonly userController: UserController) {
    super()
    this.routes()
  }

  private routes(): void {
    this.router.get('/api/v1/users', authMiddleware, requireRoles('ADMIN'), this.userController.list)
    this.router.get('/api/v1/users/:id', authMiddleware, requireRoles('ADMIN'), this.userController.getById)
    this.router.post('/api/v1/users', authMiddleware, requireRoles('ADMIN'), this.userController.create)
    this.router.put('/api/v1/users/:id', authMiddleware, requireRoles('ADMIN'), this.userController.update)
    this.router.delete('/api/v1/users/:id', authMiddleware, requireRoles('ADMIN'), this.userController.remove)
  }
}
