import { UserController } from '../controllers/UserController.js'
import { UserUseCases } from './UserModelFactory.js'

export class UserControllerFactory {
  static readonly create = (useCases: UserUseCases): UserController => {
    const controller = new UserController(
      useCases.listUsers,
      useCases.getUser,
      useCases.createUser,
      useCases.updateUser,
      useCases.deleteUser
    )
    if (!controller) throw new Error('UserControllerFactory: Failed to create UserController')
    return controller
  }
}
