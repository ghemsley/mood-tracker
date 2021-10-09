import { DateTime } from 'luxon'

class User {
  constructor(
    username: string,
    password: string,
    id: number = 0,
    admin: boolean = false,
    createdAt: number = 0,
    updatedAt: number = createdAt
  ) {
    this._id = id
    this.username = username ? username : ''
    this.password = password ? password : ''
    this._admin = admin
    this._createdAt = createdAt
    this._updatedAt = updatedAt
  }
  private _id: number = 0
  public username: string = ''
  public password: string = ''
  private _admin: boolean = false
  private _createdAt: number = 0
  private _updatedAt: number = this._createdAt
  private _createdAtDateTime: DateTime = DateTime.fromMillis(this._createdAt)
  private _updatedAtDateTime: DateTime = DateTime.fromMillis(this._updatedAt)
  public get createdAtDateTime() {
    return this._createdAtDateTime
  }
  public get updatedAtDateTime() {
    return this._updatedAtDateTime
  }
  public get createdAt() {
    return this._createdAt
  }
  public get updatedAt() {
    return this._updatedAt
  }
  public set updatedAt(ms: number) {
    this._updatedAt = ms
    this._updatedAtDateTime = DateTime.fromMillis(ms)
  }
  public get admin() {
    return this._admin
  }
  public get id() {
    return this._id
  }
  public _setId(id: number) {
    this._id = id
  }

  public _setAdmin(value: boolean) {
    this._admin = value
  }
  public _setCreatedAt(ms: number) {
    this._createdAt = ms
    this._createdAtDateTime = DateTime.fromMillis(ms)
  }
  public toObject() {
    return {
      id: this.id,
      username: this.username,
      password: this.password,
      admin: this.admin,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    }
  }
  public updateFromObject(userObject: object): User {
    for (const [key, value] of Object.entries(userObject)) {
      switch (key) {
        case 'id':
          this._setId(value)
          break
        case 'username':
          this.username = value
          break
        case 'password':
          this.password = value
          break
        case 'admin':
          this._setAdmin(value)
          break
        case 'createdAt':
          if (this.createdAt === 0) {
            this._setCreatedAt(value)
          }
          break
        case 'updatedAt':
          this.updatedAt = value
          break

        default:
          break
      }
    }
    return this
  }
}

export default User
