import { StockObserver } from '../ports/observers/StockObserver.js'

export interface ProductProps {
  id: string
  sku: string
  name: string
  description: string
  supplierId: string
  warehouseLocation: string
  stock: number
  minimumStock: number
  acquisitionCost: number
  createdAt: Date
  updatedAt: Date
}

export class Product {
  private readonly _id: string
  private _sku: string
  private _name: string
  private _description: string
  private _supplierId: string
  private _warehouseLocation: string
  private _stock: number
  private _minimumStock: number
  private _acquisitionCost: number
  private readonly _createdAt: Date
  private _updatedAt: Date
  private readonly _observers: StockObserver[] = []

  constructor(props: ProductProps) {
    this._id = props.id
    this._sku = props.sku
    this._name = props.name
    this._description = props.description
    this._supplierId = props.supplierId
    this._warehouseLocation = props.warehouseLocation
    this._stock = props.stock
    this._minimumStock = props.minimumStock
    this._acquisitionCost = props.acquisitionCost
    this._createdAt = props.createdAt
    this._updatedAt = props.updatedAt
  }

  get id(): string { return this._id }
  get sku(): string { return this._sku }
  get name(): string { return this._name }
  get description(): string { return this._description }
  get supplierId(): string { return this._supplierId }
  get warehouseLocation(): string { return this._warehouseLocation }
  get stock(): number { return this._stock }
  get minimumStock(): number { return this._minimumStock }
  get acquisitionCost(): number { return this._acquisitionCost }
  get createdAt(): Date { return this._createdAt }
  get updatedAt(): Date { return this._updatedAt }

  addObserver(observer: StockObserver): void {
    this._observers.push(observer)
  }

  private notifyObservers(): void {
    for (const observer of this._observers) {
      observer.onStockChanged(this)
    }
  }

  increaseStock(quantity: number): void {
    if (quantity <= 0) throw new Error('Quantity must be positive')
    this._stock += quantity
    this._updatedAt = new Date()
    this.notifyObservers()
  }

  decreaseStock(quantity: number): void {
    if (quantity <= 0) throw new Error('Quantity must be positive')
    if (this._stock - quantity < 0) throw new Error('Stock cannot be negative')
    this._stock -= quantity
    this._updatedAt = new Date()
    this.notifyObservers()
  }

  adjustStock(newStock: number): void {
    if (newStock < 0) throw new Error('Stock cannot be negative')
    this._stock = newStock
    this._updatedAt = new Date()
    this.notifyObservers()
  }

  update(data: Partial<Omit<ProductProps, 'id' | 'createdAt'>>): void {
    if (data.sku !== undefined) this._sku = data.sku
    if (data.name !== undefined) this._name = data.name
    if (data.description !== undefined) this._description = data.description
    if (data.supplierId !== undefined) this._supplierId = data.supplierId
    if (data.warehouseLocation !== undefined) this._warehouseLocation = data.warehouseLocation
    if (data.minimumStock !== undefined) this._minimumStock = data.minimumStock
    if (data.acquisitionCost !== undefined) this._acquisitionCost = data.acquisitionCost
    this._updatedAt = new Date()
  }

  isBelowMinimumStock(): boolean {
    return this._stock <= this._minimumStock
  }

  toJSON(): ProductProps {
    return {
      id: this._id,
      sku: this._sku,
      name: this._name,
      description: this._description,
      supplierId: this._supplierId,
      warehouseLocation: this._warehouseLocation,
      stock: this._stock,
      minimumStock: this._minimumStock,
      acquisitionCost: this._acquisitionCost,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt
    }
  }
}
