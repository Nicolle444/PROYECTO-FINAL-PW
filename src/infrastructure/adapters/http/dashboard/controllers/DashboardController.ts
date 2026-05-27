import { Request, Response } from 'express'
import { GetDashboardUseCase } from '../../../../../application/usecases/dashboard/GetDashboardUseCase.js'

export class DashboardController {
  constructor(private readonly getDashboard: GetDashboardUseCase) {}

  readonly dashboard = async (_req: Request, res: Response): Promise<void> => {
    try {
      const data = await this.getDashboard.execute()
      res.status(200).json(data)
    } catch (err) {
      res.status(500).json({ message: err instanceof Error ? err.message : 'Failed' })
    }
  }
}
