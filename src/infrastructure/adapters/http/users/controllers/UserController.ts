import { Request, Response } from 'express'
import { ListUsersUseCase } from '../../../../../application/usecases/users/ListUsersUseCase.js'
import { GetUserUseCase } from '../../../../../application/usecases/users/GetUserUseCase.js'
import { CreateUserUseCase } from '../../../../../application/usecases/users/CreateUserUseCase.js'
import { UpdateUserUseCase } from '../../../../../application/usecases/users/UpdateUserUseCase.js'
import { DeleteUserUseCase } from '../../../../../application/usecases/users/DeleteUserUseCase.js'

export class UserController {
  constructor(
    private readonly listUsers: ListUsersUseCase,
    private readonly getUser: GetUserUseCase,
    private readonly createUser: CreateUserUseCase,
    private readonly updateUser: UpdateUserUseCase,
    private readonly deleteUser: DeleteUserUseCase
  ) {}

  readonly list = async (_req: Request, res: Response): Promise<void> => {
    try {
      const users = await this.listUsers.execute()
      res.status(200).json(users.map((u) => u.toJSON()))
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to list users'
      res.status(500).json({ message })
    }
  }

  readonly getById = async (req: Request, res: Response): Promise<void> => {
    try {
      const user = await this.getUser.execute((req.params['id'] as string) ?? '')
      res.status(200).json(user.toJSON())
    } catch (err) {
      const message = err instanceof Error ? err.message : 'User not found'
      res.status(404).json({ message })
    }
  }

  readonly create = async (req: Request, res: Response): Promise<void> => {
    try {
      const user = await this.createUser.execute(req.body as Parameters<typeof this.createUser.execute>[0])
      res.status(201).json(user.toJSON())
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create user'
      res.status(400).json({ message })
    }
  }

  readonly update = async (req: Request, res: Response): Promise<void> => {
    try {
      const user = await this.updateUser.execute(
        (req.params['id'] as string) ?? '',
        req.body as Parameters<typeof this.updateUser.execute>[1]
      )
      res.status(200).json(user.toJSON())
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update user'
      res.status(400).json({ message })
    }
  }

  readonly remove = async (req: Request, res: Response): Promise<void> => {
    try {
      await this.deleteUser.execute((req.params['id'] as string) ?? '')
      res.status(204).send()
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete user'
      res.status(404).json({ message })
    }
  }
}
