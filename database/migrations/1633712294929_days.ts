import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Days extends BaseSchema {
  protected tableName = 'days'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.integer('user_id').unsigned().references('users.id').onDelete('CASCADE').notNullable()

      table.integer('rating').defaultTo(5).notNullable()
      table.string('mood').defaultTo('happy').notNullable()
      table.integer('meals').defaultTo(3).notNullable()
      table.boolean('exercise').defaultTo(false).notNullable()
      table.boolean('meds').defaultTo(false).notNullable()

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).notNullable()
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
