import { UserView } from '../views/UserView.js'
import { UserController } from '../controllers/UserController.js'

export class UserViewFactory {
  static readonly create = (userController: UserController): UserView => {
    const view = new UserView(userController)
    if (!view) throw new Error('UserViewFactory: Failed to create UserView')
    return view
  }
}
