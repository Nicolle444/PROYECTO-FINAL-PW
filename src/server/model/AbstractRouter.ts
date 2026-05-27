import { Router } from 'express'

export abstract class AbstractRouter {
  router: Router
  constructor() {
    this.router = Router()
  }
}
