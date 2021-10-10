import { DateTime } from 'luxon'
import { BaseModel, belongsTo, BelongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import User from './User'
import CamelCaseNamingStrategy from './helpers/camelCase'

export default class Day extends BaseModel {
  public static namingStrategy = new CamelCaseNamingStrategy()

  @column({ isPrimary: true })
  public id: number

  @column()
  public userId: number

  @column({ prepare: (value: number) => Math.max(0, Math.min(10, value)) })
  public rating: number

  @column({ prepare: (value: string) => value.toLowerCase() })
  public mood: string

  @column({ prepare: (value: number) => Math.max(0, value) })
  public meals: number

  @column()
  public exercise: boolean

  @column()
  public meds: boolean

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

  @belongsTo(() => User)
  public user: BelongsTo<typeof User>
}
