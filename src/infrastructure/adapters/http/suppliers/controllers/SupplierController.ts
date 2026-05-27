import { Request, Response } from 'express'
import { CreateSupplierUseCase } from '../../../../../application/usecases/suppliers/CreateSupplierUseCase.js'
import { ListSuppliersUseCase } from '../../../../../application/usecases/suppliers/ListSuppliersUseCase.js'
import { GetSupplierUseCase } from '../../../../../application/usecases/suppliers/GetSupplierUseCase.js'
import { UpdateSupplierUseCase } from '../../../../../application/usecases/suppliers/UpdateSupplierUseCase.js'
import { DeleteSupplierUseCase } from '../../../../../application/usecases/suppliers/DeleteSupplierUseCase.js'

export class SupplierController {
  constructor(
    private readonly createSupplier: CreateSupplierUseCase,
    private readonly listSuppliers: ListSuppliersUseCase,
    private readonly getSupplier: GetSupplierUseCase,
    private readonly updateSupplier: UpdateSupplierUseCase,
    private readonly deleteSupplier: DeleteSupplierUseCase
  ) {}

  readonly create = async (req: Request, res: Response): Promise<void> => {
    try {
      const supplier = await this.createSupplier.execute(req.body as Parameters<typeof this.createSupplier.execute>[0])
      res.status(201).json(supplier.toJSON())
    } catch (err) {
      res.status(400).json({ message: err instanceof Error ? err.message : 'Failed' })
    }
  }

  readonly list = async (_req: Request, res: Response): Promise<void> => {
    try {
      const suppliers = await this.listSuppliers.execute()
      res.status(200).json(suppliers.map((s) => s.toJSON()))
    } catch (err) {
      res.status(500).json({ message: err instanceof Error ? err.message : 'Failed' })
    }
  }

  readonly getById = async (req: Request, res: Response): Promise<void> => {
    try {
      const supplier = await this.getSupplier.execute((req.params['id'] as string) ?? '')
      res.status(200).json(supplier.toJSON())
    } catch (err) {
      res.status(404).json({ message: err instanceof Error ? err.message : 'Not found' })
    }
  }

  readonly update = async (req: Request, res: Response): Promise<void> => {
    try {
      const supplier = await this.updateSupplier.execute((req.params['id'] as string) ?? '', req.body as Parameters<typeof this.updateSupplier.execute>[1])
      res.status(200).json(supplier.toJSON())
    } catch (err) {
      res.status(400).json({ message: err instanceof Error ? err.message : 'Failed' })
    }
  }

  readonly remove = async (req: Request, res: Response): Promise<void> => {
    try {
      await this.deleteSupplier.execute((req.params['id'] as string) ?? '')
      res.status(204).send()
    } catch (err) {
      res.status(404).json({ message: err instanceof Error ? err.message : 'Not found' })
    }
  }
}
