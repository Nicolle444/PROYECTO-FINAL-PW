import request from 'supertest'
import express from 'express'
import { InMemoryProductRepository } from '../../src/infrastructure/adapters/repositories/InMemoryProductRepository'
import { InMemorySupplierRepository } from '../../src/infrastructure/adapters/repositories/InMemorySupplierRepository'
import { InMemoryStockMovementRepository } from '../../src/infrastructure/adapters/repositories/InMemoryStockMovementRepository'
import { InMemoryUserRepository } from '../../src/infrastructure/adapters/repositories/InMemoryUserRepository'
import { ProductModelFactory } from '../../src/infrastructure/adapters/http/products/factory/ProductModelFactory'
import { ProductControllerFactory } from '../../src/infrastructure/adapters/http/products/factory/ProductControllerFactory'
import { ProductViewFactory } from '../../src/infrastructure/adapters/http/products/factory/ProductViewFactory'
import { AuthModelFactory } from '../../src/infrastructure/adapters/http/auth/factory/AuthModelFactory'
import { AuthControllerFactory } from '../../src/infrastructure/adapters/http/auth/factory/AuthControllerFactory'
import { AuthViewFactory } from '../../src/infrastructure/adapters/http/auth/factory/AuthViewFactory'
import { SupplierModelFactory } from '../../src/infrastructure/adapters/http/suppliers/factory/SupplierModelFactory'
import { SupplierControllerFactory } from '../../src/infrastructure/adapters/http/suppliers/factory/SupplierControllerFactory'
import { SupplierViewFactory } from '../../src/infrastructure/adapters/http/suppliers/factory/SupplierViewFactory'

const buildApp = () => {
  const app = express()
  app.use(express.json())
  const productRepo = new InMemoryProductRepository()
  const supplierRepo = new InMemorySupplierRepository()
  const movementRepo = new InMemoryStockMovementRepository()
  const userRepo = new InMemoryUserRepository()
  const authModel = AuthModelFactory.create(userRepo)
  const authController = AuthControllerFactory.create(authModel)
  const authView = AuthViewFactory.create(authController)
  const productModel = ProductModelFactory.create(productRepo, supplierRepo, movementRepo)
  const productController = ProductControllerFactory.create(productModel)
  const productView = ProductViewFactory.create(productController)
  const supplierModel = SupplierModelFactory.create(supplierRepo)
  const supplierController = SupplierControllerFactory.create(supplierModel)
  const supplierView = SupplierViewFactory.create(supplierController)
  app.use('/', authView.router)
  app.use('/', productView.router)
  app.use('/', supplierView.router)
  return app
}

describe('Products API', () => {
  const app = buildApp()
  let adminToken: string
  let supplierId: string

  beforeAll(async () => {
    const loginRes = await request(app).post('/api/v1/auth/login').send({ email: 'admin@pyme.com', password: 'admin123' })
    adminToken = loginRes.body.token as string
    const supplierRes = await request(app).post('/api/v1/suppliers').set('Authorization', `Bearer ${adminToken}`).send({ name: 'Test Supplier', contactName: 'John', email: 'supplier@test.com', phone: '123456789', address: 'Test St 1' })
    supplierId = supplierRes.body.id as string
  })

  it('should list empty products initially', async () => {
    const res = await request(app).get('/api/v1/products').set('Authorization', `Bearer ${adminToken}`)
    expect(res.status).toBe(200)
    expect(res.body).toEqual([])
  })

  it('should create a product', async () => {
    const res = await request(app).post('/api/v1/products').set('Authorization', `Bearer ${adminToken}`).send({ sku: 'SKU-001', name: 'Product A', description: 'Desc', supplierId, warehouseLocation: 'A1', stock: 100, minimumStock: 10, acquisitionCost: 50 })
    expect(res.status).toBe(201)
    expect(res.body.sku).toBe('SKU-001')
  })

  it('should reject duplicate SKU', async () => {
    const res = await request(app).post('/api/v1/products').set('Authorization', `Bearer ${adminToken}`).send({ sku: 'SKU-001', name: 'Product B', description: 'Desc', supplierId, warehouseLocation: 'B1', stock: 50, minimumStock: 5, acquisitionCost: 30 })
    expect(res.status).toBe(400)
  })

  it('should search products by name', async () => {
    const res = await request(app).get('/api/v1/products/search?q=Product').set('Authorization', `Bearer ${adminToken}`)
    expect(res.status).toBe(200)
    expect(res.body.length).toBeGreaterThan(0)
  })

  it('should return 401 without token', async () => {
    const res = await request(app).get('/api/v1/products')
    expect(res.status).toBe(401)
  })
})
