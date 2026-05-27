import { Request, Response } from 'express'
import { LoginUseCase } from '../../../../../application/usecases/auth/LoginUseCase.js'

export class AuthController {
  constructor(private readonly loginUseCase: LoginUseCase) {}

  readonly login = async (req: Request, res: Response): Promise<void> => {
    try {
      const result = await this.loginUseCase.execute(req.body as { email: string; password: string })
      res.status(200).json(result)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Login failed'
      res.status(401).json({ message })
    }
  }
}
