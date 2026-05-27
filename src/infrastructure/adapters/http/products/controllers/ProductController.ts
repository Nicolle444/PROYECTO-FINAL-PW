import { Request, Response } from 'express'
import { CreateProductUseCase } from '../../../../../application/usecases/products/CreateProductUseCase.js'
import { GetProductUseCase } from '../../../../../application/usecases/products/GetProductUseCase.js'
import { ListProductsUseCase } from '../../../../../application/usecases/products/ListProductsUseCase.js'
import { SearchProductsUseCase } from '../../../../../application/usecases/products/SearchProductsUseCase.js'
import { UpdateProductUseCase } from '../../../../../application/usecases/products/UpdateProductUseCase.js'
import { DeleteProductUseCase } from '../../../../../application/usecases/products/DeleteProductUseCase.js'
import { GetKardexUseCase } from '../../../../../application/usecases/products/GetKardexUseCase.js'

export class ProductController {
  constructor(
    private readonly createProduct: CreateProductUseCase,
    private readonly getProduct: GetProductUseCase,
    private readonly listProducts: ListProductsUseCase,
    private readonly searchProducts: SearchProductsUseCase,
    private readonly updateProduct: UpdateProductUseCase,
    private readonly deleteProduct: DeleteProductUseCase,
    private readonly getKardex: GetKardexUseCase
  ) {}

  readonly create = async (req: Request, res: Response): Promise<void> => {
    try {
      const product = await this.createProduct.execute(req.body as Parameters<typeof this.createProduct.execute>[0])
      res.status(201).json(product.toJSON())
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create product'
      res.status(400).json({ message })
    }
  }

  readonly getById = async (req: Request, res: Response): Promise<void> => {
    try {
      const product = await this.getProduct.execute((req.params['id'] as string) ?? '')
      res.status(200).json(product.toJSON())
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Product not found'
      res.status(404).json({ message })
    }
  }

  readonly list = async (_req: Request, res: Response): Promise<void> => {
    try {
      const products = await this.listProducts.execute()
      res.status(200).json(products.map((p) => p.toJSON()))
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to list products'
      res.status(500).json({ message })
    }
  }

  readonly search = async (req: Request, res: Response): Promise<void> => {
    try {
      const query = req.query['q'] as string
      const products = await this.searchProducts.execute(query)
      res.status(200).json(products.map((p) => p.toJSON()))
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Search failed'
      res.status(400).json({ message })
    }
  }

  readonly update = async (req: Request, res: Response): Promise<void> => {
    try {
      const product = await this.updateProduct.execute((req.params['id'] as string) ?? '', req.body as Parameters<typeof this.updateProduct.execute>[1])
      res.status(200).json(product.toJSON())
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update product'
      res.status(400).json({ message })
    }
  }

  readonly remove = async (req: Request, res: Response): Promise<void> => {
    try {
      await this.deleteProduct.execute((req.params['id'] as string) ?? '')
      res.status(204).send()
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete product'
      res.status(404).json({ message })
    }
  }

  readonly kardex = async (req: Request, res: Response): Promise<void> => {
    try {
      const movements = await this.getKardex.execute((req.params['id'] as string) ?? '')
      res.status(200).json(movements)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to get kardex'
      res.status(404).json({ message })
    }
  }
}
