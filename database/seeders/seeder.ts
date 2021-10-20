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
        enabled: 'rating mood meals water people activities exercise meds journal',
      },
      {
        email: 'user2@example.com',
        password: 'password',
        admin: false,
        enabled: 'rating mood meals meds exercise',
      },
    ])
    await Promise.all(
      users.map(user =>
        user.id === 1
          ? Day.create({
              userId: user.id,
              rating: 7,
              mood: 'happy',
              meals: 3,
              water: 3,
              people: 2,
              activities: 1,
              exercise: true,
              meds: true,
              journal: 'Went to store and stuff',
            })
          : Day.create({
              userId: user.id,
              rating: 3,
              mood: 'sad',
              meals: 2,
              meds: false,
              exercise: false,
            })
      )
    )
  }
}
