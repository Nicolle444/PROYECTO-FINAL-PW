import { ListUsersUseCase } from '../../../../../application/usecases/users/ListUsersUseCase.js'
import { GetUserUseCase } from '../../../../../application/usecases/users/GetUserUseCase.js'
import { CreateUserUseCase } from '../../../../../application/usecases/users/CreateUserUseCase.js'
import { UpdateUserUseCase } from '../../../../../application/usecases/users/UpdateUserUseCase.js'
import { DeleteUserUseCase } from '../../../../../application/usecases/users/DeleteUserUseCase.js'
import { UserRepository } from '../../../../../domain/ports/UserRepository.js'

export interface UserUseCases {
  listUsers: ListUsersUseCase
  getUser: GetUserUseCase
  createUser: CreateUserUseCase
  updateUser: UpdateUserUseCase
  deleteUser: DeleteUserUseCase
}

export class UserModelFactory {
  static readonly create = (userRepo: UserRepository): UserUseCases => {
    return {
      listUsers: new ListUsersUseCase(userRepo),
      getUser: new GetUserUseCase(userRepo),
      createUser: new CreateUserUseCase(userRepo),
      updateUser: new UpdateUserUseCase(userRepo),
      deleteUser: new DeleteUserUseCase(userRepo)
    }
  }
}
