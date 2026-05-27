import { GetValuationReportUseCase } from '../../../../../application/usecases/reports/GetValuationReportUseCase.js'
import { ProductRepository } from '../../../../../domain/ports/ProductRepository.js'
import { StockMovementRepository } from '../../../../../domain/ports/StockMovementRepository.js'

export class ReportModelFactory {
  static readonly create = (productRepo: ProductRepository, _movementRepo: StockMovementRepository): GetValuationReportUseCase => {
    return new GetValuationReportUseCase(productRepo)
  }
}
