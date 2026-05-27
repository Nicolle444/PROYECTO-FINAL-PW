import request from 'supertest'
import express from 'express'
import { InMemoryUserRepository } from '../../src/infrastructure/adapters/repositories/InMemoryUserRepository'
import { AuthModelFactory } from '../../src/infrastructure/adapters/http/auth/factory/AuthModelFactory'
import { AuthControllerFactory } from '../../src/infrastructure/adapters/http/auth/factory/AuthControllerFactory'
import { AuthViewFactory } from '../../src/infrastructure/adapters/http/auth/factory/AuthViewFactory'

const buildApp = () => {
  const app = express()
  app.use(express.json())
  const userRepo = new InMemoryUserRepository()
  const authModel = AuthModelFactory.create(userRepo)
  const authController = AuthControllerFactory.create(authModel)
  const authView = AuthViewFactory.create(authController)
  app.use('/', authView.router)
  return app
}

describe('POST /api/v1/auth/login', () => {
  const app = buildApp()

  it('should return token for valid credentials', async () => {
    const res = await request(app).post('/api/v1/auth/login').send({ email: 'admin@pyme.com', password: 'admin123' })
    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('token')
    expect(res.body.user.role).toBe('ADMIN')
  })

  it('should return 401 for invalid credentials', async () => {
    const res = await request(app).post('/api/v1/auth/login').send({ email: 'admin@pyme.com', password: 'wrong' })
    expect(res.status).toBe(401)
  })

  it('should return 401 for non-existent user', async () => {
    const res = await request(app).post('/api/v1/auth/login').send({ email: 'nobody@pyme.com', password: 'test' })
    expect(res.status).toBe(401)
  })
})
