import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import User from 'App/Models/User'

export default class UserSeeder extends BaseSeeder {
  public static developmentOnly = true

  public async run() {
    await User.createMany([
      {
        username: 'Graham',
        password: 'password',
        admin: true,
      },
      {
        username: 'user1',
        password: 'password',
      },
    ])
  }
}
