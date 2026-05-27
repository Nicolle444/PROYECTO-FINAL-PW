import { Request, Response } from 'express'
import { GetValuationReportUseCase } from '../../../../../application/usecases/reports/GetValuationReportUseCase.js'

export class ReportController {
  constructor(private readonly getValuationReport: GetValuationReportUseCase) {}

  readonly valuation = async (_req: Request, res: Response): Promise<void> => {
    try {
      const report = await this.getValuationReport.execute()
      res.status(200).json(report)
    } catch (err) {
      res.status(500).json({ message: err instanceof Error ? err.message : 'Failed' })
    }
  }
}
