import { DateTime } from 'luxon'
import Hash from '@ioc:Adonis/Core/Hash'
import { column, beforeSave, BaseModel, hasMany, HasMany } from '@ioc:Adonis/Lucid/Orm'
import Day from './Day'

export default class User extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public email: string

  @column({ serializeAs: null })
  public password: string

  @column()
  public rememberMeToken?: string

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

  @beforeSave()
  public static async hashPassword(user: User) {
    if (user.$dirty.password) {
      user.password = await Hash.make(user.password)
    }
  }
}
