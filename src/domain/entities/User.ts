export type UserRole = 'ADMIN' | 'GERENTE_COMPRAS' | 'OPERARIO_BODEGA'

export interface UserProps {
  id: string
  name: string
  email: string
  passwordHash: string
  role: UserRole
  createdAt: Date
}

export class User {
  private readonly _id: string
  private _name: string
  private readonly _email: string
  private readonly _passwordHash: string
  private readonly _role: UserRole
  private readonly _createdAt: Date

  constructor(props: UserProps) {
    this._id = props.id
    this._name = props.name
    this._email = props.email
    this._passwordHash = props.passwordHash
    this._role = props.role
    this._createdAt = props.createdAt
  }

  get id(): string { return this._id }
  get name(): string { return this._name }
  get email(): string { return this._email }
  get passwordHash(): string { return this._passwordHash }
  get role(): UserRole { return this._role }
  get createdAt(): Date { return this._createdAt }

  toJSON(): Omit<UserProps, 'passwordHash'> {
    return {
      id: this._id,
      name: this._name,
      email: this._email,
      role: this._role,
      createdAt: this._createdAt
    }
  }
}
