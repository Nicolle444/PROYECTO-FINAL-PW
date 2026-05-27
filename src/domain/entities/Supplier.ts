export interface SupplierProps {
  id: string
  name: string
  contactName: string
  email: string
  phone: string
  address: string
  createdAt: Date
  updatedAt: Date
}

export class Supplier {
  private readonly _id: string
  private _name: string
  private _contactName: string
  private _email: string
  private _phone: string
  private _address: string
  private readonly _createdAt: Date
  private _updatedAt: Date

  constructor(props: SupplierProps) {
    this._id = props.id
    this._name = props.name
    this._contactName = props.contactName
    this._email = props.email
    this._phone = props.phone
    this._address = props.address
    this._createdAt = props.createdAt
    this._updatedAt = props.updatedAt
  }

  get id(): string { return this._id }
  get name(): string { return this._name }
  get contactName(): string { return this._contactName }
  get email(): string { return this._email }
  get phone(): string { return this._phone }
  get address(): string { return this._address }
  get createdAt(): Date { return this._createdAt }
  get updatedAt(): Date { return this._updatedAt }

  update(data: Partial<Omit<SupplierProps, 'id' | 'createdAt'>>): void {
    if (data.name !== undefined) this._name = data.name
    if (data.contactName !== undefined) this._contactName = data.contactName
    if (data.email !== undefined) this._email = data.email
    if (data.phone !== undefined) this._phone = data.phone
    if (data.address !== undefined) this._address = data.address
    this._updatedAt = new Date()
  }

  toJSON(): SupplierProps {
    return {
      id: this._id,
      name: this._name,
      contactName: this._contactName,
      email: this._email,
      phone: this._phone,
      address: this._address,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt
    }
  }
}
