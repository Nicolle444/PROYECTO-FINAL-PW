import { ProductModelFactory } from './infrastructure/adapters/http/products/factory/ProductModelFactory.js'
import { ProductControllerFactory } from './infrastructure/adapters/http/products/factory/ProductControllerFactory.js'
import { ProductViewFactory } from './infrastructure/adapters/http/products/factory/ProductViewFactory.js'
import { SupplierModelFactory } from './infrastructure/adapters/http/suppliers/factory/SupplierModelFactory.js'
import { SupplierControllerFactory } from './infrastructure/adapters/http/suppliers/factory/SupplierControllerFactory.js'
import { SupplierViewFactory } from './infrastructure/adapters/http/suppliers/factory/SupplierViewFactory.js'
import { StockModelFactory } from './infrastructure/adapters/http/stock/factory/StockModelFactory.js'
import { StockControllerFactory } from './infrastructure/adapters/http/stock/factory/StockControllerFactory.js'
import { StockViewFactory } from './infrastructure/adapters/http/stock/factory/StockViewFactory.js'
import { AuthModelFactory } from './infrastructure/adapters/http/auth/factory/AuthModelFactory.js'
import { AuthControllerFactory } from './infrastructure/adapters/http/auth/factory/AuthControllerFactory.js'
import { AuthViewFactory } from './infrastructure/adapters/http/auth/factory/AuthViewFactory.js'
import { DashboardModelFactory } from './infrastructure/adapters/http/dashboard/factory/DashboardModelFactory.js'
import { DashboardControllerFactory } from './infrastructure/adapters/http/dashboard/factory/DashboardControllerFactory.js'
import { DashboardViewFactory } from './infrastructure/adapters/http/dashboard/factory/DashboardViewFactory.js'
import { ReportModelFactory } from './infrastructure/adapters/http/reports/factory/ReportModelFactory.js'
import { ReportControllerFactory } from './infrastructure/adapters/http/reports/factory/ReportControllerFactory.js'
import { ReportViewFactory } from './infrastructure/adapters/http/reports/factory/ReportViewFactory.js'
import { UserModelFactory } from './infrastructure/adapters/http/users/factory/UserModelFactory.js'
import { UserControllerFactory } from './infrastructure/adapters/http/users/factory/UserControllerFactory.js'
import { UserViewFactory } from './infrastructure/adapters/http/users/factory/UserViewFactory.js'
import { prisma } from './infrastructure/database/prismaClient.js'
import { PrismaProductRepository } from './infrastructure/adapters/repositories/PrismaProductRepository.js'
import { PrismaSupplierRepository } from './infrastructure/adapters/repositories/PrismaSupplierRepository.js'
import { PrismaStockMovementRepository } from './infrastructure/adapters/repositories/PrismaStockMovementRepository.js'
import { PrismaUserRepository } from './infrastructure/adapters/repositories/PrismaUserRepository.js'
import { PrismaStockAlertRepository } from './infrastructure/adapters/repositories/PrismaStockAlertRepository.js'
import { Server } from './server/Server.js'

try {
  // Shared repositories (single instances)
  const productRepo = new PrismaProductRepository(prisma)
  const supplierRepo = new PrismaSupplierRepository(prisma)
  const movementRepo = new PrismaStockMovementRepository(prisma)
  const userRepo = new PrismaUserRepository(prisma)
  const alertRepo = new PrismaStockAlertRepository(prisma)

  // Auth
  const authModel = AuthModelFactory.create(userRepo)
  const authController = AuthControllerFactory.create(authModel)
  const authView = AuthViewFactory.create(authController)

  // Products
  const productModel = ProductModelFactory.create(productRepo, supplierRepo, movementRepo, alertRepo)
  const productController = ProductControllerFactory.create(productModel)
  const productView = ProductViewFactory.create(productController)

  // Suppliers
  const supplierModel = SupplierModelFactory.create(supplierRepo)
  const supplierController = SupplierControllerFactory.create(supplierModel)
  const supplierView = SupplierViewFactory.create(supplierController)

  // Stock
  const stockModel = StockModelFactory.create(productRepo, movementRepo, alertRepo)
  const stockController = StockControllerFactory.create(stockModel)
  const stockView = StockViewFactory.create(stockController)

  // Dashboard
  const dashboardModel = DashboardModelFactory.create(productRepo, movementRepo, alertRepo, userRepo)
  const dashboardController = DashboardControllerFactory.create(dashboardModel)
  const dashboardView = DashboardViewFactory.create(dashboardController)

  // Reports
  const reportModel = ReportModelFactory.create(productRepo, movementRepo)
  const reportController = ReportControllerFactory.create(reportModel)
  const reportView = ReportViewFactory.create(reportController)

  // Users
  const userModel = UserModelFactory.create(userRepo)
  const userController = UserControllerFactory.create(userModel)
  const userView = UserViewFactory.create(userController)

  const server = new Server([authView, productView, supplierView, stockView, dashboardView, reportView, userView])
  server.start()
} catch (error) {
  console.error('Error starting server:', error)
}
