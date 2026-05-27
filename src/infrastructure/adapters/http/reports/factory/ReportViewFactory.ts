import { ReportView } from '../views/ReportView.js'
import { ReportController } from '../controllers/ReportController.js'

export class ReportViewFactory {
  static readonly create = (reportController: ReportController): ReportView => {
    const view = new ReportView(reportController)
    if (!view) throw new Error('ReportViewFactory: Failed to create ReportView')
    return view
  }
}
