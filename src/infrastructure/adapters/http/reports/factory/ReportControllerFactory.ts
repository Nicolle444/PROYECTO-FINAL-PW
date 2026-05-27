import { ReportController } from '../controllers/ReportController.js'
import { GetValuationReportUseCase } from '../../../../../application/usecases/reports/GetValuationReportUseCase.js'

export class ReportControllerFactory {
  static readonly create = (useCase: GetValuationReportUseCase): ReportController => {
    const controller = new ReportController(useCase)
    if (!controller) throw new Error('ReportControllerFactory: Failed to create ReportController')
    return controller
  }
}
