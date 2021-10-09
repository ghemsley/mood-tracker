import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import User from 'App/Models/User'
import Day from 'App/Models/Day'

export default class Seeder extends BaseSeeder {
  public static developmentOnly = true

  public async run() {
    const users = await User.createMany([
      {
        email: 'user@example.com',
        password: 'password',
        admin: true,
      },
      {
        email: 'user2@example.com',
        password: 'password',
      },
    ])
    await Promise.all(
      users.map((user) =>
        Day.createMany([
          {
            userId: user.id,
            rating: 7,
            mood: 'happy',
            meals: 3,
            meds: true,
            exercise: true,
          },
          {
            userId: user.id,
            rating: 3,
            mood: 'sad',
            meals: 2,
            meds: false,
            exercise: false,
          },
        ])
      )
    )
  }
}
