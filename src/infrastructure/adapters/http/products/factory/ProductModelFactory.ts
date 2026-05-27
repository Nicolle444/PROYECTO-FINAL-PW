import { CreateProductUseCase } from '../../../../../application/usecases/products/CreateProductUseCase.js'
import { GetProductUseCase } from '../../../../../application/usecases/products/GetProductUseCase.js'
import { ListProductsUseCase } from '../../../../../application/usecases/products/ListProductsUseCase.js'
import { SearchProductsUseCase } from '../../../../../application/usecases/products/SearchProductsUseCase.js'
import { UpdateProductUseCase } from '../../../../../application/usecases/products/UpdateProductUseCase.js'
import { DeleteProductUseCase } from '../../../../../application/usecases/products/DeleteProductUseCase.js'
import { GetKardexUseCase } from '../../../../../application/usecases/products/GetKardexUseCase.js'
import { LowStockNotifier } from '../../../../../domain/observers/LowStockNotifier.js'
import { DashboardUpdater } from '../../../../../domain/observers/DashboardUpdater.js'
import { ProductRepository } from '../../../../../domain/ports/ProductRepository.js'
import { SupplierRepository } from '../../../../../domain/ports/SupplierRepository.js'
import { StockMovementRepository } from '../../../../../domain/ports/StockMovementRepository.js'
import { StockAlertRepository } from '../../../../../domain/ports/StockAlertRepository.js'

export interface ProductUseCases {
  createProduct: CreateProductUseCase
  getProduct: GetProductUseCase
  listProducts: ListProductsUseCase
  searchProducts: SearchProductsUseCase
  updateProduct: UpdateProductUseCase
  deleteProduct: DeleteProductUseCase
  getKardex: GetKardexUseCase
}

export class ProductModelFactory {
  static readonly create = (
    productRepo: ProductRepository,
    supplierRepo: SupplierRepository,
    movementRepo: StockMovementRepository,
    alertRepo: StockAlertRepository
  ): ProductUseCases => {
    const lowStockNotifier = new LowStockNotifier(alertRepo)
    const dashboardUpdater = new DashboardUpdater()
    return {
      createProduct: new CreateProductUseCase(productRepo, supplierRepo, lowStockNotifier, dashboardUpdater),
      getProduct: new GetProductUseCase(productRepo),
      listProducts: new ListProductsUseCase(productRepo),
      searchProducts: new SearchProductsUseCase(productRepo),
      updateProduct: new UpdateProductUseCase(productRepo),
      deleteProduct: new DeleteProductUseCase(productRepo),
      getKardex: new GetKardexUseCase(productRepo, movementRepo)
    }
  }
}
