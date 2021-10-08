import { DateTime } from 'luxon'
import { BaseModel, column, hasMany, HasMany } from '@ioc:Adonis/Lucid/Orm'
import Encryption from '@ioc:Adonis/Core/Encryption'
import Day from './Day'

export default class User extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public username: string

  @column({
    serializeAs: null,
    prepare: (value: string) => Encryption.encrypt(value),
    consume: (value: string) => Encryption.decrypt(value),
  })
  public password: string

  @column()
  public admin: boolean

  @column.dateTime({
    autoCreate: true,
    consume: (value: Date) => {
      return value.valueOf()
    },
  })
  public createdAt: DateTime

  @column.dateTime({
    autoCreate: true,
    autoUpdate: true,
    consume: (value: DateTime) => {
      return value.valueOf()
    },
  })
  public updatedAt: DateTime

  @hasMany(() => Day)
  public days: HasMany<typeof Day>
}
