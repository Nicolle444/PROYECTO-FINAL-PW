export type MovementType = 'ENTRY' | 'EXIT' | 'ADJUSTMENT'

export interface StockMovementProps {
  id: string
  productId: string
  type: MovementType
  quantity: number
  previousStock: number
  newStock: number
  justification: string
  userId: string
  createdAt: Date
}

export class StockMovement {
  private readonly _id: string
  private readonly _productId: string
  private readonly _type: MovementType
  private readonly _quantity: number
  private readonly _previousStock: number
  private readonly _newStock: number
  private readonly _justification: string
  private readonly _userId: string
  private readonly _createdAt: Date

  constructor(props: StockMovementProps) {
    this._id = props.id
    this._productId = props.productId
    this._type = props.type
    this._quantity = props.quantity
    this._previousStock = props.previousStock
    this._newStock = props.newStock
    this._justification = props.justification
    this._userId = props.userId
    this._createdAt = props.createdAt
  }

  get id(): string { return this._id }
  get productId(): string { return this._productId }
  get type(): MovementType { return this._type }
  get quantity(): number { return this._quantity }
  get previousStock(): number { return this._previousStock }
  get newStock(): number { return this._newStock }
  get justification(): string { return this._justification }
  get userId(): string { return this._userId }
  get createdAt(): Date { return this._createdAt }

  toJSON(): StockMovementProps {
    return {
      id: this._id,
      productId: this._productId,
      type: this._type,
      quantity: this._quantity,
      previousStock: this._previousStock,
      newStock: this._newStock,
      justification: this._justification,
      userId: this._userId,
      createdAt: this._createdAt
    }
  }
}
