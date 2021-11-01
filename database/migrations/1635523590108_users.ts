import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class UsersSchema extends BaseSchema {
  protected tableName = 'users'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.string('name', 20).notNullable()
      table.string('password', 255).notNullable()
      table.string('mobile', 20).notNullable()
      table.integer('is_admin', 1).nullable()

      /**
       * Uses timestampz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.integer('created_at', 0).notNullable()
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
