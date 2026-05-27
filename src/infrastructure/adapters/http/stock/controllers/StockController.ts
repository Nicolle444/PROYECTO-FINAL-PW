import { Request, Response } from 'express'
import { RegisterEntryUseCase } from '../../../../../application/usecases/stock/RegisterEntryUseCase.js'
import { RegisterExitUseCase } from '../../../../../application/usecases/stock/RegisterExitUseCase.js'
import { AdjustStockUseCase } from '../../../../../application/usecases/stock/AdjustStockUseCase.js'

export class StockController {
  constructor(
    private readonly registerEntry: RegisterEntryUseCase,
    private readonly registerExit: RegisterExitUseCase,
    private readonly adjustStock: AdjustStockUseCase
  ) {}

  readonly entry = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.user?.userId ?? 'unknown'
      const movement = await this.registerEntry.execute({ ...req.body as { productId: string; quantity: number; justification: string }, userId })
      res.status(201).json(movement.toJSON())
    } catch (err) {
      res.status(400).json({ message: err instanceof Error ? err.message : 'Failed' })
    }
  }

  readonly exit = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.user?.userId ?? 'unknown'
      const movement = await this.registerExit.execute({ ...req.body as { productId: string; quantity: number; justification: string }, userId })
      res.status(201).json(movement.toJSON())
    } catch (err) {
      res.status(400).json({ message: err instanceof Error ? err.message : 'Failed' })
    }
  }

  readonly adjust = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.user?.userId ?? 'unknown'
      const movement = await this.adjustStock.execute({ ...req.body as { productId: string; newStock: number; justification: string }, userId })
      res.status(201).json(movement.toJSON())
    } catch (err) {
      res.status(400).json({ message: err instanceof Error ? err.message : 'Failed' })
    }
  }
}
