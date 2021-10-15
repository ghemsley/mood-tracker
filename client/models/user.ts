import { DateTime } from 'luxon'

/** an object representing a user */
export type UserObject = {
  id?: number
  email?: string
  admin?: boolean
  enabled?: string
  createdAt?: number
  updatedAt?: number
}

/** a model representing a single user */
class User {
  constructor(args: UserObject) {
    this.id = args.id ? args.id : null
    this.email = args.email ? args.email : null
    this.admin = args.admin ? args.admin : null
    this.enabled = args.enabled ? args.enabled : null
    this.createdAt = args.createdAt ? args.createdAt : null
    this.updatedAt = args.updatedAt ? args.updatedAt : null
  }
  /** id of the user */
  public id: number | null
  /** user email address */
  public email: string | null
  /** whether user has admin rights */
  public admin: boolean | null
  /** user's enabled features */
  public enabled: string | null
  /** the date this user was created at in Date compatible millisecond format */
  public createdAt: number | null
  /** the date this user was updated at in Date compatible millisecond format */
  public updatedAt: number | null
  /** returns the user's createdAt property as a DateTime instance */
  public createdAtDateTime(): DateTime | null {
    return this.createdAt ? DateTime.fromMillis(this.createdAt) : null
  }
  /** returns the user's updatedAt property as a DateTime instance */
  public updatedAtDateTime(): DateTime | null {
    return this.updatedAt ? DateTime.fromMillis(this.updatedAt) : null
  }
  /** return a plain object representing a user */
  public toObject() {
    return {
      id: this.id,
      email: this.email,
      admin: this.admin,
      enabled: this.enabled,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    }
  }
  /** update the user from a plain object */
  public updateFromObject(userObject: UserObject): User {
    for (const [key, value] of Object.entries(userObject)) {
      if (new Set(Object.keys(this)).has(key)) {
        typeof value === 'string'
          ? Function(`this.${key} = '${value}'`).call(this)
          : Function(`this.${key} = ${value}`).call(this)
      }
    }
    return this
  }
}

export default User
